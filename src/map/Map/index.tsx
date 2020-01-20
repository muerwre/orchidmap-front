import React from 'react';

import { MainMap } from '~/constants/map';
import { createPortal } from 'react-dom';
import { selectMapProvider, selectMapRoute, selectMapStickers } from '~/redux/map/selectors';
import { connect } from 'react-redux';
import * as MAP_ACTIONS from '~/redux/map/actions';

import { Route } from '~/map/Route';
import { Router } from '~/map/Router';
import { TileLayer } from '~/map/TileLayer';
import { Stickers } from '~/map/Stickers';
import { KmMarks } from '~/map/KmMarks';
import { CurrentLocation } from '~/map/CurrentLocation';

import 'leaflet/dist/leaflet.css';
import { selectEditorEditing, selectEditorMode } from '~/redux/editor/selectors';
import { MODES } from '~/constants/modes';
import { selectUserLocation } from '~/redux/user/selectors';

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
  route: selectMapRoute(state),
  stickers: selectMapStickers(state),
  editing: selectEditorEditing(state),
  mode: selectEditorMode(state),
  location: selectUserLocation(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
  mapDropSticker: MAP_ACTIONS.mapDropSticker,
  mapSetSticker: MAP_ACTIONS.mapSetSticker,
  mapClicked: MAP_ACTIONS.mapClicked,
};

type IProps = React.HTMLAttributes<HTMLDivElement> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {};

const MapUnconnected: React.FC<IProps> = ({
  provider,
  stickers,
  editing,
  mode,
  location,

  mapClicked,
  mapSetSticker,
  mapDropSticker,
}) => {
  const onClick = React.useCallback(
    event => {
      if (!MainMap.clickable || mode === MODES.NONE) return;

      mapClicked(event.latlng);
    },
    [mapClicked, mode]
  );

  React.useEffect(() => {
    MainMap.addEventListener('click', onClick);

    return () => {
      MainMap.removeEventListener('click', onClick);
    };
  }, [MainMap, onClick]);

  return createPortal(
    <div>
      <TileLayer provider={provider} map={MainMap} />

      <Stickers
        stickers={stickers}
        mapSetSticker={mapSetSticker}
        mapDropSticker={mapDropSticker}
        is_editing={editing}
      />

      <Route />
      <Router />

      <KmMarks />
      <CurrentLocation location={location} />
    </div>,
    document.getElementById('canvas')
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapUnconnected);
export { Map };
