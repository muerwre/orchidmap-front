import React from 'react';

import { MainMap } from '~/constants/map';
import { createPortal } from 'react-dom';
import { selectMapProvider, selectMapRoute, selectMapStickers } from '~/redux/map/selectors';
import { connect } from 'react-redux';
import * as MAP_ACTIONS from '~/redux/map/actions';

import { Route } from '~/containers/map/Route';
import { Router } from '~/containers/map/Router';
import { TileLayer } from '~/containers/map/TileLayer';
import { Stickers } from '~/containers/map/Stickers';

import 'leaflet/dist/leaflet.css';
import { selectEditorEditing } from '~/redux/editor/selectors';

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
  route: selectMapRoute(state),
  stickers: selectMapStickers(state),
  editing: selectEditorEditing(state),
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

  mapClicked,
  mapSetSticker,
  mapDropSticker,
}) => {
  const onClick = React.useCallback(
    event => {
      if (!MainMap.clickable) return;

      mapClicked(event.latlng);
    },
    [mapClicked]
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
        map={MainMap}
        mapSetSticker={mapSetSticker}
        mapDropSticker={mapDropSticker}
        is_editing={editing}
      />

      <Route />

      <Router />
    </div>,
    document.getElementById('canvas')
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapUnconnected);
export { Map };
