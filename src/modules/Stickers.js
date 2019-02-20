import L, { layerGroup } from 'leaflet';
import { Sticker } from '$modules/Sticker';
import 'leaflet.markercluster';
import icons from '$sprites/icon.svg';
import { clusterIcon } from '$utils/clusterIcon';

export class Stickers {
  constructor({ map, lockMapClicks, triggerOnChange }) {
    this.map = map;
    this.layer = layerGroup();
    this.triggerOnChange = triggerOnChange;

    this.clusterLayer = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: false,
      maxClusterRadius: 80,
      disableClusteringAtZoom: 15,
      iconCreateFunction: clusterIcon,
    }).addTo(map);

    this.lockMapClicks = lockMapClicks;
    this.stickers = [];

    this.layer.addTo(this.map);
  }

  createSticker = ({
    latlng, sticker, angle = 2.2, text = '', set
  }) => {
    const marker = new Sticker({
      latlng,
      angle,
      deleteSticker: this.deleteStickerByReference,
      map: this.map,
      lockMapClicks: this.lockMapClicks,
      sticker,
      set,
      triggerOnChange: this.triggerOnChange,
      text,
    });

    this.stickers.push(marker);

    marker.marker.addTo(this.clusterLayer);

    this.triggerOnChange();
    // marker.marker.enableEdit();
  };

  deleteStickerByReference = ref => {
    const index = this.stickers.indexOf(ref);

    if (index < 0) return;

    this.clusterLayer.removeLayer(ref.marker);
    this.stickers.splice(index, 1);

    this.triggerOnChange();
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
  };

  stopEditing = () => {
    this.stickers.map(sticker => sticker.stopEditing());
  };

  clusterLayer;
}
