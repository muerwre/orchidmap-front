import { FC, useEffect, useCallback, memo, useState } from 'react';
import { OsrmRouter } from '~/utils/map/OsrmRouter';
import { connect } from 'react-redux';
import { selectMapRoute } from '~/redux/map/selectors';
import {
  selectEditorRouter,
  selectEditorMode,
  selectEditorDistance,
} from '~/redux/editor/selectors';
import { MainMap } from '~/constants/map';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { MODES } from '~/constants/modes';
import { LatLngLiteral, marker, divIcon } from 'leaflet';
import classNames from 'classnames';
import { angleBetweenPoints } from '~/utils/geom';

const mapStateToProps = state => ({
  route: selectMapRoute(state),
  router: selectEditorRouter(state),
  mode: selectEditorMode(state),
  distance: selectEditorDistance(state),
});

const mapDispatchToProps = {
  editorSetRouter: EDITOR_ACTIONS.editorSetRouter,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const RouterUnconnected: FC<Props> = memo(
  ({ route, mode, router: { waypoints }, editorSetRouter, distance }) => {
    const [dist, setDist] = useState(0);
    const [end, setEnd] = useState<LatLngLiteral>(null);
    const [direction, setDirection] = useState<boolean>(false);

    const updateWaypoints = useCallback(
      ({ waypoints }) => {
        const filtered = waypoints.filter(wp => !!wp.latLng);

        if (filtered.length < 2) {
          setDist(0);
        }

        editorSetRouter({ waypoints: filtered });
      },
      [editorSetRouter, setDist]
    );

    const updateDistance = useCallback(
      ({ routes, waypoints }) => {
        if (!routes || !routes.length || waypoints.length < 2) {
          setDist(0);
          return;
        }

        const { summary, coordinates } = routes[0];

        if (coordinates.length <= 1) {
          setDist(0);
          return;
        }

        const totalDistance = parseFloat((summary.totalDistance / 1000).toFixed(1)) || 0;
        const latlng =
          (waypoints[waypoints.length - 1] && waypoints[waypoints.length - 1].latLng) || null;

        const angle = angleBetweenPoints(
          MainMap.latLngToContainerPoint(waypoints[waypoints.length - 1].latLng),
          MainMap.latLngToContainerPoint(coordinates[coordinates.length - 1])
        );

        setDist(totalDistance);
        setEnd(latlng);
        setDirection(angle > -90 && angle < 90);
      },
      [setDist, setEnd]
    );

    useEffect(() => {
      OsrmRouter.on('waypointschanged', updateWaypoints)
        .on('routesfound', updateDistance)
        .addTo(MainMap);

      return () => {
        OsrmRouter.off('waypointschanged', updateWaypoints).setWaypoints([]);
      };
    }, [MainMap, updateWaypoints, mode]);

    useEffect(() => {
      if (!dist || !end) {
        return;
      }

      const item = marker(end, {
        draggable: false,
        interactive: false,
        icon: divIcon({
          html: `
          <div>
            ${parseFloat((distance + dist).toFixed(1))}
          </div>
        `,
          className: classNames('router-marker', { right: !direction }),
          iconSize: [11, 11],
          iconAnchor: [6, 6],
        }),
        zIndexOffset: -100,
      });

      item.addTo(MainMap);

      return () => {
        item.removeFrom(MainMap);
      };
    }, [dist, end, direction, distance]);

    useEffect(() => {
      if (mode !== MODES.ROUTER) {
        setDist(0);
        return;
      }

      const wp = OsrmRouter.getWaypoints()
        .filter(point => point.latLng)
        .map(point => point.latLng);

      if (
        !route.length ||
        !wp.length ||
        (route[route.length - 1].lat === wp[0].lat && route[route.length - 1].lng === wp[0].lng)
      )
        return;

      OsrmRouter.setWaypoints([route[route.length - 1], ...wp]);
    }, [route, mode, waypoints]);

    return null;
  }
);

const Router = connect(mapStateToProps, mapDispatchToProps)(RouterUnconnected);

export { Router };
