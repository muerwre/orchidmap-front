import React, { FC, useEffect, useMemo, useCallback, memo } from 'react';
import pick from 'ramda/es/pick';
import { OsrmRouter } from '~/utils/osrm';
import { connect } from 'react-redux';
import { selectMap } from '~/redux/map/selectors';
import { selectEditorRouter, selectEditorMode } from '~/redux/editor/selectors';
import { MainMap } from '~/constants/map';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { MODES } from '~/constants/modes';

const mapStateToProps = state => ({
  map: pick(['route'], selectMap(state)),
  router: pick(['waypoints', 'points'], selectEditorRouter(state)),
  mode: selectEditorMode(state),
});

const mapDispatchToProps = {
  editorSetRouter: EDITOR_ACTIONS.editorSetRouter,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const RouterUnconnected: FC<Props> = memo(
  ({ map: { route }, mode, router: { waypoints }, editorSetRouter }) => {
    const updateWaypoints = useCallback(
      ({ waypoints }) => editorSetRouter({ waypoints: waypoints.filter(wp => !!wp.latLng) }),
      [editorSetRouter]
    );

    useEffect(() => {
      OsrmRouter.on('waypointschanged', updateWaypoints).addTo(MainMap);

      return () => {
        OsrmRouter.off('waypointschanged', updateWaypoints).setWaypoints([]);
      };
    }, [MainMap, updateWaypoints, mode]);

    useEffect(() => {
      if (mode !== MODES.ROUTER) return;

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
