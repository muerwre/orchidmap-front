import { layerGroup } from 'leaflet';
import { Sticker } from '$modules/Sticker';

export class Stickers {
  constructor({ map, lockMapClicks, triggerOnChange }) {
    this.map = map;
    this.layer = layerGroup();
    this.triggerOnChange = triggerOnChange;

    this.lockMapClicks = lockMapClicks;
    this.stickers = [];

    this.layer.addTo(this.map);
  }
  //
  // createOnClick = e => {
  //   if (!e || !e.latlng) return;
  //
  //   const { latlng } = e;
  //   this.createSticker({ latlng });
  // };

  createSticker = ({ latlng, sticker, angle = 2.2 }) => {
    const marker = new Sticker({
      latlng,
      angle,
      deleteSticker: this.deleteStickerByReference,
      map: this.map,
      lockMapClicks: this.lockMapClicks,
      sticker,
      triggerOnChange: this.triggerOnChange,
    });
    this.stickers.push(marker);

    marker.marker.addTo(this.map);
    marker.marker.enableEdit();
  };

  deleteStickerByReference = ref => {
    const index = this.stickers.indexOf(ref);

    if (index < 0) return;

    this.map.removeLayer(ref.marker);
    this.stickers.splice(index, 1);
  };

  clearAll = () => {
    const target = [...this.stickers];
    target.map(sticker => {
      this.deleteStickerByReference(sticker);
      return true;
    });
  };

  dumpData = () => this.stickers.map(sticker => sticker.dumpData());

  startEditing = () => {
    this.stickers.map(sticker => sticker.startEditing());
  }

  stopEditing = () => {
    this.stickers.map(sticker => sticker.stopEditing());
  }
}
