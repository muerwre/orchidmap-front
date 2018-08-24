import { layerGroup } from 'leaflet';
import { Sticker } from '$modules/Sticker';

export class Stickers {
  constructor({ map, lockMapClicks }) {
    this.map = map;
    this.layer = layerGroup();

    this.lockMapClicks = lockMapClicks;
    this.stickers = [];

    this.layer.addTo(this.map);
  }

  createOnClick = e => {
    if (!e || !e.latlng) return;

    const { latlng } = e;
    this.createSticker({ latlng });
  };

  createSticker = ({ latlng, sticker }) => {
    const marker = new Sticker({
      latlng,
      deleteSticker: this.deleteStickerByReference,
      map: this.map,
      lockMapClicks: this.lockMapClicks,
      sticker,
    });
    this.stickers.push(marker);

    marker.sticker.addTo(this.map);
    marker.sticker.enableEdit();
  };

  deleteStickerByReference = ref => {
    const index = this.stickers.indexOf(ref);

    if (index < 0) return;

    this.map.removeLayer(ref.sticker);
    this.stickers.splice(index, 1);
  };
}
