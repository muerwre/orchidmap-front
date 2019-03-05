import { Map, Marker, marker } from 'leaflet';
import * as React from 'react';
import { DomMarker } from '$utils/DomMarker';

import { STICKERS } from '$constants/stickers';
import * as ReactDOM from 'react-dom';
import { StickerDesc } from '$components/StickerDesc';
import classnames from 'classnames';
import { getLabelDirection } from '$utils/geom';
import { ILatLng } from "$modules/Stickers";
import { IRootState } from "$redux/user/reducer";
import { Editor, editor } from "$modules/Editor";

const getX = e => (
  e.touches && e.touches.length > 0
    ? { pageX: e.touches[0].pageX, pageY: e.touches[0].pageY }
    : { pageX: e.pageX, pageY: e.pageY }
);


export interface IStickerDump {
  latlng: ILatLng,
  set: IRootState['activeSticker']['set'],
  sticker: IRootState['activeSticker']['sticker'],
  angle?: number,
  text?: string,
}

interface Props {
  latlng: ILatLng;
  map: Map;
  sticker:  IRootState['activeSticker']['sticker'];
  set: IRootState['activeSticker']['set'];
  angle?: number;
  text?: string;
  editor: Editor,

  deleteSticker: (sticker: this) => void;

  triggerOnChange: typeof editor.triggerOnChange;
  lockMapClicks: typeof editor.lockMapClicks;
}

export class Sticker {
  constructor({
    latlng, deleteSticker, map, lockMapClicks, sticker, set, triggerOnChange, angle = 2.2, text = '', editor,
  }: Props) {
    this.text = text;
    this.latlng = latlng;
    this.angle = parseFloat(((angle && (angle % Math.PI)) || 2.2).toFixed(2));
    this.map = map;
    this.sticker = sticker;
    this.set = set;
    this.triggerOnChange = triggerOnChange;
    this.direction = getLabelDirection(this.angle);
    this.deleteSticker = deleteSticker;
    this.lockMapClicks = lockMapClicks;
    this.editor = editor;

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

    this.marker.on('add', this.updateModeOnAdd);

    this.element.addEventListener('mouseup', this.onDragStop);
    this.element.addEventListener('mouseup', this.preventPropagations);

    this.element.addEventListener('touchend', this.onDragStop);
    this.element.addEventListener('touchend', this.preventPropagations);

    this.marker.on('dragend', this.triggerOnChange);

    this.setAngle(this.angle);
  }

  updateModeOnAdd = () => {
    if (this.editor.getEditing()) {
      this.startEditing();
    } else {
      this.stopEditing();
    }
  };

  setText = (text: Props['text']): void => {
    this.text = text;
  };

  onDelete = (): void => {
    if (!this.isDragging) this.deleteSticker(this);
  };

  onDragStart = (e): void => {
    this.preventPropagations(e);
    this.marker.dragging.disable();

    this.isDragging = true;

    this.lockMapClicks(true);

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('touchmove', this.onDrag);

    window.addEventListener('mouseup', this.onDragStop);
    window.addEventListener('touchend', this.onDragStop);
  };

  preventPropagations = (e): void => {
    if (!e || !e.stopPropagation) return;

    e.stopPropagation();
    e.preventDefault();
  };

  onDragStop = (e): void => {
    this.preventPropagations(e);
    this.marker.dragging.enable();

    this.triggerOnChange();
    this.isDragging = false;

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('touchmove', this.onDrag);

    window.removeEventListener('mouseup', this.onDragStop);
    window.removeEventListener('touchend', this.onDragStop);

    this.lockMapClicks(false);
  };

  onDrag = (e: DragEvent): void => {
    this.preventPropagations(e);
    this.estimateAngle(e);
  };

  estimateAngle = (e): void => {
    const { x, y } = this.element.getBoundingClientRect() as DOMRect;
    const { pageX, pageY } = getX(e);

    this.angle = parseFloat(Math.atan2((y - pageY), (x - pageX)).toFixed(2));

    this.setAngle(this.angle);
  };

  setAngle = (angle: Props['angle']): void => {
    const direction = getLabelDirection(angle);

    if (direction !== this.direction) {
      this.direction = direction;
      this.stickerImage.className = `sticker-label ${direction}`;
    }

    const rad = 56;

    const x = ((Math.cos(angle + Math.PI) * rad) - 30);
    const y = ((Math.sin(angle + Math.PI) * rad) - 30);

    this.stickerImage.style.left = String(6 + x);
    this.stickerImage.style.top = String(6 + y);

    this.stickerArrow.style.transform = `rotate(${angle + Math.PI}rad)`;
  };

  dumpData = (): IStickerDump => ({
    angle: this.angle,
    latlng: { ...this.marker.getLatLng() },
    sticker: this.sticker,
    set: this.set,
    text: this.text,
  });

  stopEditing = (): void => {
    this.element.className = 'sticker-container inactive';
  };

  startEditing = (): void => {
    this.element.className = 'sticker-container';
  };

  element: HTMLDivElement = document.createElement('div');
  stickerImage: HTMLDivElement;
  stickerArrow: HTMLDivElement;
  marker: Marker;
  isDragging: boolean = false;
  direction: string;
  editor: Editor;

  text: Props['text'];
  latlng:  Props['latlng'];
  angle: Props['angle'];
  map: Props['map'];
  sticker:  Props['sticker'];
  set: Props['set'];
  triggerOnChange: Props['triggerOnChange'];

  deleteSticker: Props['deleteSticker'];
  lockMapClicks: Props['lockMapClicks'];
}
