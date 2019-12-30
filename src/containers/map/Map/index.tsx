import { Map as MapInterface, map } from "leaflet";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  selectMapProvider,
  selectMapRoute,
  selectMapStickers
} from "$redux/map/selectors";
import { connect } from "react-redux";
import * as MAP_ACTIONS from "$redux/map/actions";

import { Route } from "$containers/map/Route";
import { TileLayer } from "$containers/map/TileLayer";
import { Stickers } from "$containers/map/Stickers";
import { selectUserEditing } from '$redux/user/selectors'

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
  route: selectMapRoute(state),
  stickers: selectMapStickers(state),
  editing: selectUserEditing(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
  mapDropSticker: MAP_ACTIONS.mapDropSticker,
  mapSetSticker: MAP_ACTIONS.mapSetSticker,
  mapClicked: MAP_ACTIONS.mapClicked
};

type IProps = React.HTMLAttributes<HTMLDivElement> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {};

const MapUnconnected: React.FC<IProps> = ({
  provider,
  route,
  stickers,
  editing,

  mapClicked,
  mapSetRoute,
  mapSetSticker,
  mapDropSticker
}) => {
  const ref = React.useRef(null);
  const [layer, setLayer] = React.useState<MapInterface>(null);

  const onClick = React.useCallback(event => {
    mapClicked(event.latlng);
  }, [mapClicked]);

  React.useEffect(() => {
    if (!ref.current) return;

    setLayer(map(ref.current).setView([55.0153275, 82.9071235], 13));
  }, [ref]);

  React.useEffect(() => {
    if (!layer) return;

    layer.addEventListener("click", onClick)

    return () => {
      layer.removeEventListener("click", onClick)
    }
  }, [layer, onClick]);

  return createPortal(
    <div ref={ref}>
      <TileLayer provider={provider} map={layer} />
      <Route route={route} mapSetRoute={mapSetRoute} map={layer} is_editing={editing} />
      <Stickers
        stickers={stickers}
        map={layer}
        mapSetSticker={mapSetSticker}
        mapDropSticker={mapDropSticker}
        is_editing={editing}
      />
    </div>,
    document.getElementById("canvas")
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapUnconnected);
export { Map };
