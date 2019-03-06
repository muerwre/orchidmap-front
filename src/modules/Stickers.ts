import { LayerGroup, layerGroup, Map } from 'leaflet';
import { IStickerDump, Sticker } from '$modules/Sticker';
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { clusterIcon } from '$utils/clusterIcon';
import { editor, Editor } from "$modules/Editor";
import { STICKERS } from "$constants/stickers";

export interface ILatLng {
  lat: number,
  lng: number,
}

interface Props {
  editor: Editor;
  map: Map;

  triggerOnChange: typeof editor.triggerOnChange;
  lockMapClicks: typeof editor.lockMapClicks;
}

export class Stickers {
  constructor({ map, lockMapClicks, triggerOnChange, editor }: Props) {
    this.map = map;
    this.triggerOnChange = triggerOnChange;
    this.editor = editor;

    this.clusterLayer.addTo(map);

    // this.clusterLayer.on('animationend', this.onSpiderify);

    this.lockMapClicks = lockMapClicks;
    this.stickers = [];

    this.layer.addTo(this.map);
  }

  createSticker = ({
    latlng, sticker, angle = 2.2, text = '', set
  }: IStickerDump): void => {

    if (!STICKERS[set] || !STICKERS[set].layers || !STICKERS[set].layers[sticker]) return;

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
      editor: this.editor,
    });

    this.stickers.push(marker);

    marker.marker.addTo(this.clusterLayer);

    this.triggerOnChange();
  };

  deleteStickerByReference = (ref: Sticker): void => {
    const index = this.stickers.indexOf(ref);

    if (index < 0) return;

    this.clusterLayer.removeLayer(ref.marker);
    this.stickers.splice(index, 1);

    this.triggerOnChange();
  };

  clearAll = (): void => {
    const target = [...this.stickers];
    target.map(sticker => {
      this.deleteStickerByReference(sticker);
      return true;
    });
  };

  dumpData = (): Array<IStickerDump> => this.stickers.map(sticker => sticker.dumpData());

  // onSpiderify = (): void => {
  //   console.log('spider?');
  //   // todo: it has markers passed as argument. Update only them.
  //   if (this.editor.getEditing()) {
  //     this.startEditing();
  //   } else {
  //     this.stopEditing();
  //   }
  // };

  startEditing = (): void => {
    this.stickers.map(sticker => sticker.startEditing());
  };

  stopEditing = (): void => {
    this.stickers.map(sticker => sticker.stopEditing());
  };

  clusterLayer: MarkerClusterGroup = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    animate: false,
    maxClusterRadius: 80,
    disableClusteringAtZoom: 13,
    iconCreateFunction: clusterIcon,
  });

  editor: Props['editor'];
  map: Props['map'];


  stickers: Array<Sticker> = [];
  layer: LayerGroup = layerGroup();

  triggerOnChange: Props['triggerOnChange'];
  lockMapClicks: Props['lockMapClicks'];
}
