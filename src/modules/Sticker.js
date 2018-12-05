import { marker } from 'leaflet';
import 'leaflet-editable';
import React from 'react';
import { DomMarker } from '$utils/DomMarker';

import { STICKERS } from '$constants/stickers';
import ReactDOM from 'react-dom';

export class Sticker {
  constructor({
    latlng, deleteSticker, map, lockMapClicks, sticker, triggerOnChange, angle = 2.2
  }) {
    this.latlng = latlng;
    this.angle = angle;
    this.isDragging = false;
    this.map = map;
    this.sticker = sticker;
    this.editable = true;
    this.triggerOnChange = triggerOnChange;

    this.deleteSticker = deleteSticker;
    this.lockMapClicks = lockMapClicks;

    this.element = document.createElement('div');
    ReactDOM.render(
      <React.Fragment>
        <div
          className="sticker-arrow"
          ref={el => { this.stickerArrow = el; }}
        />
        <div
          className="sticker-label"
          ref={el => { this.stickerImage = el; }}
          onMouseDown={this.onDragStart}
          onMouseUp={this.onDragStop}
        >
          {this.generateStickerSVG(sticker)}
          <div
            className="sticker-delete"
            onMouseDown={this.onDelete}
          />
        </div>
      </React.Fragment>,
      this.element
    );

    // this.stickerImage = document.createElement('div');
    // this.stickerArrow = document.createElement('div');
    // this.stickerDelete = document.createElement('div');

    // this.element.className = 'sticker-container';

    // this.stickerImage.className = 'sticker-label';
    // this.stickerArrow.className = 'sticker-arrow';
    // this.stickerDelete.className = 'sticker-delete';

    // this.stickerImage.innerHTML = this.generateStickerSVG(sticker);

    // this.element.appendChild(this.stickerArrow);
    // this.element.appendChild(this.stickerImage);
    // this.stickerImage.appendChild(this.stickerDelete);

    const mark = new DomMarker({
      element: this.element,
      className: 'sticker-container',
    });

    this.marker = marker(latlng, { icon: mark });

    //

    // this.stickerImage.addEventListener('mousedown', this.onDragStart);
    // this.stickerImage.addEventListener('mouseup', this.onDragStop);
    this.element.addEventListener('mouseup', this.onDragStop);
    this.element.addEventListener('mouseup', this.preventPropagations);
    // this.stickerDelete.addEventListener('mousedown', this.onDelete);
    this.marker.addEventListener('dragend', this.triggerOnChange);

    this.setAngle(angle);
    this.triggerOnChange();
  }

  onDelete = () => {
    this.triggerOnChange();
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = e => {
    console.log('drag start');
    this.preventPropagations(e);

    this.isDragging = true;
    this.marker.disableEdit();

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

    this.triggerOnChange();
    this.isDragging = false;
    this.marker.enableEdit();

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
    const rad = 56;
    const mrad = 76;
    const x = ((Math.cos(angle + 3.14) * rad) - 30);
    const y = ((Math.sin(angle + 3.14) * rad) - 30);

    const ax = ((Math.cos(angle + 3.4) * mrad) - 12);
    const ay = ((Math.sin(angle + 3.4) * mrad) - 12);

    this.stickerImage.style.left = 6 + x;
    this.stickerImage.style.top = 6 + y;

    // this.stickerDelete.style.left = ax;
    // this.stickerDelete.style.top = ay;

    this.stickerArrow.style.transform = `rotate(${angle + 3.14}rad)`;
  };

  generateStickerSVG = ({ set, sticker }) => (
    <div
      className="sticker-image"
      style={{
          backgroundImage: `url('${STICKERS[set].url}`,
          backgroundPosition: `${-STICKERS[set].layers[sticker].off * 72} 50%`,
        }}
    />
  );

  dumpData = () => ({
    angle: this.angle,
    latlng: { ...this.marker.getLatLng() },
    sticker: this.sticker,
  });

  stopEditing = () => {
    this.element.className = 'sticker-container inactive';
  };

  startEditing = () => {
    this.element.className = 'sticker-container';
  };
}
