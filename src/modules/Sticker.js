import { marker } from 'leaflet';
import * as React from 'react';
import { DomMarker } from '$utils/DomMarker';

import { STICKERS } from '$constants/stickers';
import ReactDOM from 'react-dom';
import { StickerDesc } from '$components/StickerDesc';
import classnames from 'classnames';
import { getLabelDirection } from '$utils/geom';

const getX = e => (
  e.touches && e.touches.length > 0
    ? { pageX: e.touches[0].pageX, pageY: e.touches[0].pageY }
    : { pageX: e.pageX, pageY: e.pageY }
);

export class Sticker {
  constructor({
    latlng, deleteSticker, map, lockMapClicks, sticker, set, triggerOnChange, angle = 2.2, text = '',
  }) {
    this.text = text;
    this.latlng = latlng;
    this.angle = parseFloat(((angle && (angle % Math.PI)) || 2.2).toFixed(2));
    this.isDragging = false;
    this.map = map;
    this.sticker = sticker;
    this.set = set;
    // this.editable = true;
    this.triggerOnChange = triggerOnChange;
    this.direction = getLabelDirection(this.angle);
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
          className={classnames(`sticker-label ${this.direction}`, {})}
          ref={el => { this.stickerImage = el; }}
        >
          <StickerDesc value={this.text} onChange={this.setText} />
          <div
            className="sticker-image"
            style={{
              backgroundImage: `url('${STICKERS[set].url}`,
              backgroundPosition: `${-STICKERS[set].layers[sticker].off * 72} 50%`,
            }}
            onMouseDown={this.onDragStart}
            onMouseUp={this.onDragStop}
            onTouchStart={this.onDragStart}
            onTouchEnd={this.onDragStop}
          />
          <div
            className="sticker-delete"
            onMouseDown={this.onDelete}
            onTouchStart={this.onDelete}
          />
        </div>
      </React.Fragment>,
      this.element
    );

    const mark = new DomMarker({
      element: this.element,
      className: 'sticker-container',
    });

    this.marker = marker(latlng, { icon: mark, draggable: true });

    this.element.addEventListener('mouseup', this.onDragStop);
    this.element.addEventListener('mouseup', this.preventPropagations);

    this.element.addEventListener('touchend', this.onDragStop);
    this.element.addEventListener('touchend', this.preventPropagations);

    this.marker.addEventListener('dragend', this.triggerOnChange);

    this.setAngle(this.angle);
    this.triggerOnChange();
  }

  setText = text => {
    this.text = text;
  };

  onDelete = () => {
    this.triggerOnChange();
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = e => {
    console.log('drag started');
    this.preventPropagations(e);
    this.marker.dragging.disable();

    this.isDragging = true;

    this.lockMapClicks(true);

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.onDragStop);
    window.addEventListener('touchmove', this.onDrag);
    window.addEventListener('touchend', this.onDragStop);

    // this.marker.disableEdit();
  };

  preventPropagations = e => {
    if (!e || !e.stopPropagation) return;

    e.stopPropagation();
    e.preventDefault();
  };

  onDragStop = e => {
    this.preventPropagations(e);
    this.marker.dragging.enable();

    this.triggerOnChange();
    this.isDragging = false;

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onDragStop);

    window.removeEventListener('touchmove', this.onDrag);
    window.removeEventListener('touchend', this.onDragStop);

    this.lockMapClicks(false);
  };

  onDrag = e => {
    this.preventPropagations(e);
    this.estimateAngle(e);
  };

  estimateAngle = e => {
    const { x, y } = this.element.getBoundingClientRect();
    const { pageX, pageY } = getX(e);
    this.angle = parseFloat(Math.atan2((y - pageY), (x - pageX)).toFixed(2));

    this.setAngle(this.angle);
  };

  setAngle = angle => {
    const direction = getLabelDirection(angle);

    if (direction !== this.direction) {
      this.direction = direction;
      this.stickerImage.className = `sticker-label ${direction}`;
    }

    const rad = 56;

    const x = ((Math.cos(angle + Math.PI) * rad) - 30);
    const y = ((Math.sin(angle + Math.PI) * rad) - 30);

    this.stickerImage.style.left = 6 + x;
    this.stickerImage.style.top = 6 + y;

    this.stickerArrow.style.transform = `rotate(${angle + Math.PI}rad)`;
  };

  dumpData = () => ({
    angle: this.angle,
    latlng: { ...this.marker.getLatLng() },
    sticker: this.sticker,
    set: this.set,
    text: this.text,
  });

  stopEditing = () => {
    this.element.className = 'sticker-container inactive';
  };

  startEditing = () => {
    this.element.className = 'sticker-container';
  };
}
