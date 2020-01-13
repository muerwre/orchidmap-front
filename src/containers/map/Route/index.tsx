import React, { FC, useEffect, memo, useState, useCallback } from 'react';
import { IMapRoute } from '../../../redux/map/types';
import { InteractivePoly } from '~/utils/polyline';
import { isMobile } from '~/utils/window';
import { LatLng, Map, LeafletEvent } from 'leaflet';
import { selectEditor } from '~/redux/editor/selectors';
import pick from 'ramda/es/pick';
import * as MAP_ACTIONS from '~/redux/map/actions';
import { connect } from 'react-redux';
import { selectMap } from '~/redux/map/selectors';
import { MainMap } from '~/constants/map';
import { MODES } from '~/constants/modes';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';

const mapStateToProps = state => ({
  editor: pick(['mode', 'editing'], selectEditor(state)),
  map: pick(['route'], selectMap(state)),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
  editorSetDistance: EDITOR_ACTIONS.editorSetDistance,
  editorSetMarkersShown: EDITOR_ACTIONS.editorSetMarkersShown,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const RouteUnconnected: FC<Props> = memo(
  ({
    map: { route },
    editor: { editing, mode },
    mapSetRoute,
    editorSetDistance,
    editorSetMarkersShown,
  }) => {
    const [layer, setLayer] = useState<InteractivePoly>(null);

    const onDistanceChange = useCallback(({ distance }) => editorSetDistance(distance), [
      editorSetDistance,
    ]);

    useEffect(() => {
      if (!MainMap) return;

      const interactive = new InteractivePoly([], {
        color: 'url(#activePathGradient)',
        weight: 6,
        maxMarkers: isMobile() ? 50 : 150,
        smoothFactor: 3,
      })
        .addTo(MainMap.routeLayer)
        .on('distancechange', onDistanceChange)
        .on('vertexdragstart', MainMap.disableClicks)
        .on('vertexdragend', MainMap.enableClicks)
        .on('vertexaddstart', MainMap.disableClicks)
        .on('vertexaddend', MainMap.enableClicks)
        .on('allvertexhide', () => editorSetMarkersShown(false))
        .on('allvertexshow', () => editorSetMarkersShown(true));

      setLayer(interactive);

      return () => {
        MainMap.routeLayer.removeLayer(interactive);
      };
    }, [MainMap, onDistanceChange]);

    const onRouteChanged = useCallback(
      ({ latlngs }) => {
        mapSetRoute(latlngs);
      },
      [mapSetRoute]
    );

    useEffect(() => {
      if (!layer) return;

      layer.on('latlngschange', onRouteChanged);

      return () => layer.off('latlngschange', onRouteChanged);
    }, [layer, onRouteChanged]);

    useEffect(() => {
      if (!layer) return;

      const points = (route && route.length > 0 && route) || [];

      layer.setPoints(points as LatLng[]);
    }, [route, layer]);

    useEffect(() => {
      if (!layer) return;

      if (editing) {
        layer.editor.enable();
      } else {
        layer.editor.disable();
      }
    }, [editing, layer]);

    useEffect(() => {
      if (!layer) return;

      if (mode === MODES.POLY && !layer.is_drawing) {
        layer.editor.continue();
      }

      if (mode !== MODES.POLY && layer.is_drawing) {
        layer.editor.stop();
      }
    }, [mode, layer]);

    return null;
  }
);

const Route = connect(mapStateToProps, mapDispatchToProps)(RouteUnconnected);

export { Route };
