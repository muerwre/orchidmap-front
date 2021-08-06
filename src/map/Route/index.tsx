import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { InteractivePoly } from '~/utils/map/InteractivePoly';
import { isMobile } from '~/utils/window';
import { LatLng } from 'leaflet';
import { selectEditorDirection, selectEditorEditing, selectEditorMode } from '~/redux/editor/selectors';
import * as MAP_ACTIONS from '~/redux/map/actions';
import { connect } from 'react-redux';
import { selectMapRoute } from '~/redux/map/selectors';
import { MainMap } from '~/constants/map';
import { MODES } from '~/constants/modes';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { IState } from '~/redux/store';

const mapStateToProps = (state: IState) => ({
  mode: selectEditorMode(state),
  editing: selectEditorEditing(state),
  route: selectMapRoute(state),
  drawing_direction: selectEditorDirection(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
  editorSetDistance: EDITOR_ACTIONS.editorSetDistance,
  editorSetMarkersShown: EDITOR_ACTIONS.editorSetMarkersShown,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const RouteUnconnected: FC<Props> = memo(
  ({ route, editing, mode, drawing_direction, mapSetRoute, editorSetDistance, editorSetMarkersShown }) => {
    const [layer, setLayer] = useState<InteractivePoly | null>(null);

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

    useEffect(() => {
      if (!layer) return;

      layer.setDirection(drawing_direction);
    }, [drawing_direction, layer]);

    return null;
  }
);

const Route = connect(mapStateToProps, mapDispatchToProps)(RouteUnconnected);

export { Route };
