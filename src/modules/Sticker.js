import L from 'leaflet';
import 'leaflet-editable';

import { DomMarker } from '$utils/leafletDomMarkers';

export class Sticker {
  constructor({ latlng, deleteSticker }) {
    this.isDragging = false;

    this.deleteSticker = deleteSticker;
    this.element = document.createElement('div');

    const stickerImage = document.createElement('div');
    stickerImage.innerHTML = '<div class="sticker-label" />';

    const stickerArrow = document.createElement('div');
    stickerArrow.innerHTML = '<div class="sticker-arrow" />';

    this.element.appendChild(stickerArrow);
    this.element.appendChild(stickerImage);

    const marker = new DomMarker({
      element: this.element,
    });

    this.sticker = L.marker(latlng, { icon: marker });

    stickerImage.addEventListener('mousedown', this.onDragStart);
    stickerImage.addEventListener('mouseup', this.onDragStop);
    //
    // this.sticker.addEventListener('click', this.onDelete);
  }

  onDelete = () => {
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = e => {
    this.isDragging = true;
    this.sticker.disableEdit();
    console.log('dragStart');
  };

  onDragStop = e => {
    this.isDragging = false;
    this.sticker.enableEdit();
    console.log('dragStop');
  }
}
