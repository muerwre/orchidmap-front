import React, { useState, memo, FC, useEffect, useCallback } from 'react';
import { IStickerDump } from '~/redux/map/types';
import { FeatureGroup, Map, LeafletEvent } from 'leaflet';
import { Sticker } from '~/map/Sticker';
import { mapSetSticker, mapDropSticker } from '~/redux/map/actions';
import { MainMap } from '~/constants/map';

interface IProps {
  stickers: IStickerDump[];
  is_editing: boolean;

  mapSetSticker: typeof mapSetSticker;
  mapDropSticker: typeof mapDropSticker;
}

const Stickers: FC<IProps> = memo(({ stickers, is_editing, mapSetSticker, mapDropSticker }) => {
  const [layer, setLayer] = useState<FeatureGroup | null>(null);
  const [zoom, setZoom] = useState(MainMap.getZoom());

  const onZoomChange = useCallback(
    (event) => {
      setZoom(event.zoom);
    },
    [setZoom]
  );

  useEffect(() => {
    if (!MainMap) return;

    const item = new FeatureGroup().addTo(MainMap.stickerLayer);
    setLayer(item);
    MainMap.on('zoomanim', onZoomChange);

    return () => {
      MainMap.off('zoomanim', onZoomChange);
      MainMap.stickerLayer.removeLayer(item);
    };
  }, [MainMap, onZoomChange]);

  return (
    <div>
      {layer &&
        stickers.map((sticker, index) => (
          <Sticker
            sticker={sticker}
            key={`${sticker.set}.${sticker.sticker}.${index}`}
            index={index}
            is_editing={is_editing}
            zoom={zoom}
            mapSetSticker={mapSetSticker}
            mapDropSticker={mapDropSticker}
          />
        ))}
    </div>
  );
});

export { Stickers };
