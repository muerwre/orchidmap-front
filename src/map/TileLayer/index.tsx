import React from "react";
import { TileContext } from "~/utils/context";
import { TileLayer as TileLayerInterface, tileLayer, Map } from "leaflet";
import { DEFAULT_PROVIDER, PROVIDERS } from "~/constants/providers";
import { IMapReducer } from "~/redux/map";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  provider: IMapReducer['provider'],
  map: Map,
};

const TileLayer: React.FC<IProps> = React.memo(({ children, provider, map }) => {
  const [layer, setLayer] = React.useState<TileLayerInterface>(null);

  React.useEffect(() => {
    if (!map) return;

    setLayer(
      tileLayer(PROVIDERS[DEFAULT_PROVIDER].url, {
        attribution: "Независимое Велосообщество",
        maxNativeZoom: 18,
        maxZoom: 18
      }).addTo(map)
    );
  }, [map]);

  React.useEffect(() => {
    if (!layer || !provider) return;

    const { url } =
      (provider && PROVIDERS[provider] && PROVIDERS[provider]) ||
      PROVIDERS[DEFAULT_PROVIDER];

    layer.setUrl(url);
  }, [layer, provider]);

  return <TileContext.Provider value={layer}>{children}</TileContext.Provider>;
});

export { TileLayer };
