import { Map as MapInterface, map } from "leaflet";
import * as React from "react";
import { createPortal } from "react-dom";
import { MapContext } from "$utils/context.ts";
import { selectMapProvider, selectMapRoute, selectMapStickers } from "$redux/map/selectors";
import { connect } from "react-redux";
import * as MAP_ACTIONS from "$redux/map/actions";

import { Route } from "$containers/map/Route";
import { TileLayer } from "$containers/map/TileLayer";
import { Stickers } from "$containers/map/Stickers";

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
  route: selectMapRoute(state),
  stickers: selectMapStickers(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute
};

type IProps = React.HTMLAttributes<HTMLDivElement> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {};

const MapUnconnected: React.FC<IProps> = ({ provider, route, mapSetRoute, stickers }) => {
  const ref = React.useRef(null);
  const [maps, setMaps] = React.useState<MapInterface>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    setMaps(map(ref.current).setView([55.0153275, 82.9071235], 13));
  }, [ref]);

  // console.log('RERENDER!');

  return createPortal(
    <div ref={ref}>
        <TileLayer provider={provider} map={maps} />
        <Route route={route} mapSetRoute={mapSetRoute} map={maps} is_editing />
        <Stickers stickers={stickers} map={maps} is_editing />
    </div>,
    document.getElementById("canvas")
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapUnconnected);
export { Map };
