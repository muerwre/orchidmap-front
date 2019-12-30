import React, {
  FC,
  useEffect,
  memo,
  useContext,
  useState,
  useCallback
} from "react";
import { IMapRoute, ILatLng } from "../../../redux/map/types";
import { MapContext } from "$utils/context";
import { InteractivePoly } from "$modules/InteractivePoly";
import { isMobile } from "$utils/window";
import { LatLng, Map } from "leaflet";

interface IProps {
  map: Map;
  route: IMapRoute;
  is_editing: boolean;
  mapSetRoute: (latlngs: ILatLng[]) => void;
}

const Route: FC<IProps> = memo(({ route, is_editing, mapSetRoute, map }) => {
  const [layer, setLayer] = useState<InteractivePoly>(null);

  useEffect(() => {
    if (!map) return;

    setLayer(
      new InteractivePoly([], {
        color: "url(#activePathGradient)",
        weight: 6,
        maxMarkers: isMobile() ? 20 : 100,
        smoothFactor: 3,
      })
        .addTo(map)
        // .on("distancechange", console.log)
        // .on("allvertexhide", console.log)
        // .on("allvertexshow", console.log)
    );
  }, [map]);


  const onRouteChanged = useCallback(
    ({ latlngs }) => {
      // console.log('THIS!');
      mapSetRoute(latlngs)
    },
    [mapSetRoute]
  );

  useEffect(() => {
    if (!layer) return;

    layer.on("latlngschange", onRouteChanged);

    return () => layer.off("latlngschange", onRouteChanged);
  }, [layer, onRouteChanged]);

  useEffect(() => {
    if (!layer) return;

    const points = (route && route.length > 0 && route) || [];

    layer.setPoints(points as LatLng[]);
  }, [route, layer]);

  useEffect(() => {
    if (!layer) return;

    if (is_editing) {
      layer.editor.enable();
    } else {
      layer.editor.disable();
    }
  }, [is_editing, layer]);

  return null;
});

export { Route };
