import { Map as MapInterface, map } from "leaflet";
import * as React from "react";
import { createPortal } from "react-dom";
import { MapContext } from "$utils/context.ts";
import { TileLayer } from "$containers/map/TileLayer";
import { Route } from "$containers/map/Route";
import { selectMapProvider, selectMapRoute } from "$redux/map/selectors";
import { connect } from "react-redux";
import * as MAP_ACTIONS from "$redux/map/actions";

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
  route: selectMapRoute(state)
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute
};

type IProps = React.HTMLAttributes<HTMLDivElement> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {};

const MapUnconnected: React.FC<IProps> = ({ provider, route, mapSetRoute }) => {
  const ref = React.useRef(null);
  const [maps, setMaps] = React.useState<MapInterface>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    setMaps(map(ref.current).setView([55.0153275, 82.9071235], 13));
  }, [ref]);

  return createPortal(
    <div ref={ref}>
      <MapContext.Provider value={maps}>
        <TileLayer provider={provider} />
        <Route route={route} mapSetRoute={mapSetRoute} is_editing />
      </MapContext.Provider>
    </div>,
    document.getElementById("canvas")
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapUnconnected);
export { Map };
