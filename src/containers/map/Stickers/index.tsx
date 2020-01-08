import React from 'react';
import { IStickerDump } from '$redux/map/types';
import { FeatureGroup, Map } from 'leaflet';
import { Sticker } from '$containers/map/Sticker';
import { mapSetSticker, mapDropSticker } from '$redux/map/actions';

interface IProps {
  stickers: IStickerDump[];
  is_editing: boolean;
  map: Map;
  mapSetSticker: typeof mapSetSticker;
  mapDropSticker: typeof mapDropSticker;
}

// const { FC, useContext, useState, useEffect } = React;

const Stickers: React.FC<IProps> = React.memo(
  ({ stickers, is_editing, map, mapSetSticker, mapDropSticker }) => {
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
              index={index}
              is_editing={is_editing}
              mapSetSticker={mapSetSticker}
              mapDropSticker={mapDropSticker}
            />
          ))}
      </div>
    );
    // return null;
  }
);

export { Stickers };
