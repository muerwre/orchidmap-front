import React from 'react';
import { IStickerDump } from '~/redux/map/types';
import { FeatureGroup, Map } from 'leaflet';
import { Sticker } from '~/containers/map/Sticker';
import { mapSetSticker, mapDropSticker } from '~/redux/map/actions';
import { MapContainer, MainMap } from '~/constants/map';

interface IProps {
  stickers: IStickerDump[];
  is_editing: boolean;
  mapSetSticker: typeof mapSetSticker;
  mapDropSticker: typeof mapDropSticker;
}

const Stickers: React.FC<IProps> = React.memo(
  ({ stickers, is_editing, mapSetSticker, mapDropSticker }) => {
    const [layer, setLayer] = React.useState<FeatureGroup>(null);

    React.useEffect(() => {
      if (!MainMap) return;

      const item = new FeatureGroup().addTo(MainMap.stickerLayer);
      setLayer(item);

      return () => MainMap.stickerLayer.removeLayer(item);
    }, [MainMap]);

    return (
      <div>
        {layer &&
          stickers.map((sticker, index) => (
            <Sticker
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
