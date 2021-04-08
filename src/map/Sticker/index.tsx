import React, { useCallback, useEffect, useRef, useState } from 'react';
import { marker, Marker } from 'leaflet';
import { IStickerDump } from '~/redux/map/types';
import { STICKERS } from '~/constants/stickers';
import { StickerDesc } from '~/components/StickerDesc';
import classNames from 'classnames';
import { DomMarker } from '~/utils/map/DomMarker';
import { createPortal } from 'react-dom';
import { MainMap } from '~/constants/map';
import { getAdaptiveScale } from '~/utils/dom';

interface IProps {
  sticker: IStickerDump;
  onDragStart?: () => void;
  index: number;
  is_editing: boolean;
  zoom: number;

  mapSetSticker: (index: number, sticker: IStickerDump) => void;
  mapDropSticker: (index: number) => void;
}

export const getLabelDirection = (angle: number): 'left' | 'right' =>
  angle % Math.PI >= -(Math.PI / 2) && angle % Math.PI <= Math.PI / 2 ? 'left' : 'right';

const getX = e =>
  e.touches && e.touches.length > 0
    ? { pageX: e.touches[0].pageX, pageY: e.touches[0].pageY }
    : { pageX: e.pageX, pageY: e.pageY };

const Sticker: React.FC<IProps> = ({
  sticker,
  index,
  is_editing,
  zoom,
  mapSetSticker,
  mapDropSticker,
}) => {
  const [text, setText] = useState(sticker.text);
  const [layer, setLayer] = React.useState<Marker>(null);
  const [dragging, setDragging] = React.useState(false);
  const wrapper = useRef(null);

  let angle = useRef(sticker.angle);

  const element = React.useMemo(() => document.createElement('div'), []);

  const stickerArrow = React.useRef(null);
  const stickerImage = React.useRef(null);

  const onChange = React.useCallback(state => mapSetSticker(index, state), [mapSetSticker, index]);
  const onDelete = React.useCallback(state => mapDropSticker(index), [mapSetSticker, index]);

  const updateAngle = useCallback(
    ang => {
      if (!stickerImage.current || !stickerArrow.current) return;

      const x = Math.cos(ang + Math.PI) * 56 - 30;
      const y = Math.sin(ang + Math.PI) * 56 - 30;

      stickerImage.current.style.left = String(6 + x);
      stickerImage.current.style.top = String(6 + y);

      stickerArrow.current.style.transform = `rotate(${ang + Math.PI}rad)`;
    },
    [stickerArrow, stickerImage, angle]
  );

  const onDragStart = React.useCallback(() => {
    layer.dragging.disable();
    MainMap.dragging.disable();
    MainMap.disableClicks();

    setDragging(true);
  }, [setDragging, layer, MainMap]);

  const onDragStop = React.useCallback(
    event => {
      event.stopPropagation();
      event.preventDefault();

      if (!layer) return;

      setDragging(false);
      onChange({
        ...sticker,
        angle: angle.current,
      });

      layer.dragging.enable();
      MainMap.dragging.enable();

      setTimeout(MainMap.enableClicks, 100);
    },
    [setDragging, layer, MainMap, sticker, angle]
  );

  const onMoveStarted = React.useCallback(() => {
    MainMap.disableClicks();
  }, [onChange, sticker, MainMap]);

  const onMoveFinished = React.useCallback(
    event => {
      const target = event.target as Marker;

      onChange({
        ...sticker,
        latlng: target.getLatLng(),
      });

      MainMap.enableClicks();
    },
    [onChange, sticker]
  );

  const onDrag = React.useCallback(
    event => {
      if (!element) return;

      const { x, y } = element.getBoundingClientRect() as DOMRect;
      const { pageX, pageY } = getX(event);
      angle.current = parseFloat(Math.atan2(y - pageY, x - pageX).toFixed(2));
      updateAngle(angle.current);
    },
    [element, updateAngle, angle]
  );

  const onTextChange = React.useCallback(text => setText(text), [sticker, onChange]);

  const onTextBlur = React.useCallback(() => {
    onChange({
      ...sticker,
      text,
    });
  }, [text, onChange, sticker]);

  const direction = React.useMemo(() => getLabelDirection(sticker.angle), [sticker.angle]);

  useEffect(() => {
    updateAngle(sticker.angle);
    angle.current = sticker.angle;
  }, [sticker.angle]);

  useEffect(() => {
    if (!layer) return;
    layer.setLatLng(sticker.latlng);
  }, [layer, sticker.latlng]);

  useEffect(() => {
    if (!layer) return;
    setText(sticker.text);
  }, [layer, sticker.text]);

  useEffect(() => {
    if (!wrapper || !wrapper.current) return;

    const scale = getAdaptiveScale(zoom) // adaptive zoom :-)

    wrapper.current.style.transform = `scale(${scale}) perspective(1px)`
  }, [zoom, wrapper]);

  // Attaches onMoveFinished event to item
  React.useEffect(() => {
    if (!layer) return;

    layer.addEventListener('dragstart', onMoveStarted);
    layer.addEventListener('dragend', onMoveFinished);

    return () => {
      layer.removeEventListener('dragstart', onMoveStarted);
      layer.removeEventListener('dragend', onMoveFinished);
    };
  }, [layer, onMoveFinished, onMoveStarted]);

  // Attaches and detaches handlers when user starts dragging
  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDragStop);
    }

    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onDragStop);
    };
  }, [dragging, onDrag, onDragStop]);

  // Initial leaflet marker creation, when element (dom element div) is ready
  React.useEffect(() => {
    const icon = new DomMarker({
      element,
      className: 'sticker-container',
    });

    const item = marker(sticker.latlng, { icon, draggable: true });

    setLayer(item);

    return () => {
      item.remove();
    };
  }, [sticker.latlng, element]);

  useEffect(() => {
    if (!layer) return;

    layer.addTo(MainMap.stickerLayer);

    return () => MainMap.stickerLayer.removeLayer(layer);
  }, [layer]);

  React.useEffect(() => {
    element.className = is_editing ? 'sticker-container' : 'sticker-container inactive';
  }, [element, is_editing, layer]);


  return createPortal(
    <div ref={wrapper} className="sticker-wrapper">
      <div className="sticker-arrow" ref={stickerArrow} />
      <div className={classNames(`sticker-label ${direction}`)} ref={stickerImage}>
        <StickerDesc value={text} onChange={onTextChange} onBlur={onTextBlur} />

        <div
          className="sticker-image"
          style={{
            backgroundImage: `url('${STICKERS[sticker.set].url}`,
            backgroundPosition: `${-STICKERS[sticker.set].layers[sticker.sticker].off * 72} 50%`,
          }}
          onMouseDown={onDragStart}
          onMouseUp={onDragStop}
          onTouchStart={onDragStart}
          onTouchEnd={onDragStop}
        />

        <div className="sticker-delete" onMouseDown={onDelete} onTouchStart={onDelete} />
      </div>
    </div>,
    element
  );
};

export { Sticker };
