import L from 'leaflet';
import 'leaflet-editable';

import { DomMarker } from '$utils/leafletDomMarkers';

export class Sticker {
  constructor({
    latlng, deleteSticker, map
  }) {
    this.angle = 2.2;
    this.isDragging = false;
    this.map = map;

    this.deleteSticker = deleteSticker;

    this.element = document.createElement('div');
    this.stickerImage = document.createElement('div');
    this.stickerArrow = document.createElement('div');
    this.stickerDelete = document.createElement('div');

    this.element.className = 'sticker-container';
    this.stickerImage.className = 'sticker-label';
    this.stickerArrow.className = 'sticker-arrow';
    this.stickerDelete.className = 'sticker-delete';

    this.element.appendChild(this.stickerArrow);
    this.element.appendChild(this.stickerImage);
    this.element.appendChild(this.stickerDelete);

    const marker = new DomMarker({
      element: this.element,
      className: 'sticker-container',
    });

    this.sticker = L.marker(latlng, { icon: marker });

    this.stickerImage.addEventListener('mousedown', this.onDragStart);
    this.stickerImage.addEventListener('mouseup', this.onDragStop);
    this.stickerImage.addEventListener('click', this.preventPropagations);

    this.element.addEventListener('mousedown', this.preventPropagations);

    this.setAngle(this.angle);

    this.stickerDelete.addEventListener('click', this.onDelete);
  }

  onDelete = () => {
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = e => {
    this.preventPropagations(e);

    this.isDragging = true;
    this.sticker.disableEdit();

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.onDragStop);
  };

  preventPropagations = e => {
    if (!e || !e.stopPropagation) return;

    e.stopPropagation();
    e.preventDefault();
  };

  onDragStop = e => {
    this.preventPropagations(e);

    this.isDragging = false;
    this.sticker.enableEdit();

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onDragStop);
  };

  onDrag = e => {
    this.preventPropagations(e);
    this.estimateAngle(e);
  };

  estimateAngle = e => {
    console.log('est');
    const { x, y } = this.element.getBoundingClientRect();
    const { pageX, pageY } = e;
    this.angle = Math.atan2((y - pageY), (x - pageX));

    this.setAngle(this.angle);
  };

  setAngle = angle => {
    // $(active_sticker.container).css('left',6+x-parseInt(active_sticker.ctrl.css('left'))).css('top',6+y-parseInt(active_sticker.ctrl.css('top')));
    //
    const rad = 30;
    const mrad = 48;
    const x = ((Math.cos(angle + 3.14) * rad) - 30);
    const y = ((Math.sin(angle + 3.14) * rad) - 30);

    const ax = ((Math.cos(angle + 3.4) * mrad) - 12);
    const ay = ((Math.sin(angle + 3.4) * mrad) - 12);

    this.stickerImage.style.left = 6 + x;
    this.stickerImage.style.top = 6 + y;

    this.stickerDelete.style.left = ax;
    this.stickerDelete.style.top = ay;

    this.stickerArrow.style.transform = `rotate(${angle + 3.14}rad)`;
  }
}
