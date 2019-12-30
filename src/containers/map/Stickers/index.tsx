import * as React from "react";
import { IStickerDump } from "$modules/Sticker";
import { Layer, FeatureGroup, Map } from "leaflet";
import { MapContext } from "$utils/context";
import { Sticker } from "$containers/map/Sticker";

interface IProps {
  stickers: IStickerDump[];
  is_editing: boolean;
  map: Map;
}

// const { FC, useContext, useState, useEffect } = React;

const Stickers: React.FC<IProps> = React.memo(({ stickers, is_editing, map }) => {
  const [layer, setLayer] = React.useState<FeatureGroup>(null);

  React.useEffect(() => {
    if (!map) return;

    setLayer(new FeatureGroup().addTo(map));
  }, [map]);

  return (
    <div>
      {layer &&
        stickers.map((sticker, index) => (
          <Sticker
            map={map}
            sticker={sticker}
            key={`${sticker.set}.${sticker.sticker}.${index}`}
          />
        ))}
    </div>
  );
  // return null;
});

export { Stickers };
