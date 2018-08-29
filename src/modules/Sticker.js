import { marker } from 'leaflet';
import 'leaflet-editable';

import { DomMarker } from '$utils/DomMarker';

import stickers from '$sprites/stickers.svg';

export class Sticker {
  constructor({
    latlng, deleteSticker, map, lockMapClicks, sticker, angle = 2.2
  }) {
    this.angle = angle;
    this.isDragging = false;
    this.map = map;

    this.deleteSticker = deleteSticker;
    this.lockMapClicks = lockMapClicks;

    this.element = document.createElement('div');
    this.stickerImage = document.createElement('div');
    this.stickerArrow = document.createElement('div');
    this.stickerDelete = document.createElement('div');

    this.element.className = 'sticker-container';
    this.stickerImage.className = 'sticker-label';
    this.stickerArrow.className = 'sticker-arrow';
    this.stickerDelete.className = 'sticker-delete';

    this.stickerImage.innerHTML = this.generateStickerSVG(sticker);

    this.element.appendChild(this.stickerArrow);
    this.element.appendChild(this.stickerImage);
    this.element.appendChild(this.stickerDelete);

    const mark = new DomMarker({
      element: this.element,
      className: 'sticker-container',
    });

    this.sticker = marker(latlng, { icon: mark });

    this.setAngle(angle);

    this.stickerImage.addEventListener('mousedown', this.onDragStart);
    this.stickerImage.addEventListener('mouseup', this.onDragStop);

    this.element.addEventListener('mouseup', this.preventPropagations);
    this.stickerDelete.addEventListener('click', this.onDelete);
  }

  onDelete = () => {
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = e => {
    this.preventPropagations(e);

    this.isDragging = true;
    this.sticker.disableEdit();

    this.lockMapClicks(true);

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

    this.lockMapClicks(false);
  };

  onDrag = e => {
    this.preventPropagations(e);
    this.estimateAngle(e);
  };

  estimateAngle = e => {
    const { x, y } = this.element.getBoundingClientRect();
    const { pageX, pageY } = e;
    this.angle = Math.atan2((y - pageY), (x - pageX));

    this.setAngle(this.angle);
  };

  setAngle = angle => {
    // $(active_sticker.container).css('left',6+x-parseInt(active_sticker.ctrl.css('left'))).css('top',6+y-parseInt(active_sticker.ctrl.css('top')));
    //
    const rad = 44;
    const mrad = 76;
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

  generateStickerSVG = sticker => (
    `
      <svg width="64" height="64">
         <use xlink:href="${stickers}#sticker-${sticker}" x="0" y="0" width="64" height="64" />
      </svg>
    `
  )
}
