import * as React from "react";
import { Map, marker, Marker } from "leaflet";
import { IStickerDump, Sticker as StickerComponent } from "$modules/Sticker";
import { STICKERS } from "$constants/stickers";
import { StickerDesc } from "$components/StickerDesc";
import classNames from "classnames";
import { DomMarker } from "$utils/DomMarker";
import { createPortal } from "react-dom";

interface IProps {
  map: Map;
  sticker: IStickerDump;
}

const preventPropagation = (e): void => {
  if (!e || !e.stopPropagation) return;

  e.stopPropagation();
  e.preventDefault();
};

const getX = e =>
  e.touches && e.touches.length > 0
    ? { pageX: e.touches[0].pageX, pageY: e.touches[0].pageY }
    : { pageX: e.pageX, pageY: e.pageY };

const Sticker: React.FC<IProps> = ({ map, sticker }) => {
  const [layer, setLayer] = React.useState<Marker>(null);
  const [dragging, setDragging] = React.useState(false);

  const stickerArrow = React.useRef(null);
  const stickerImage = React.useRef(null);

  const onDragStart = React.useCallback(() => {
    layer.dragging.disable();
    map.dragging.disable();

    setDragging(true);
  }, [setDragging, layer, map]);

  const onDragStop = React.useCallback(() => {
    layer.dragging.enable();
    map.dragging.enable();

    setDragging(false);
  }, [setDragging, layer, map]);

  const onDrag = React.useCallback(event => {
    // event.stopPrapagation();
    // console.log("drag")
  }, []);

  const onDelete = console.log;
  const setText = console.log;

  const direction = React.useMemo(() => "left", [sticker.angle]);

  const element = React.useMemo(() => document.createElement("div"), []);

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseUp", onDragStop);
    }

    return () => document.removeEventListener("mousemove", onDrag);
  }, [dragging, onDrag]);

  React.useEffect(() => {
    if (!map) return;

    const icon = new DomMarker({
      element,
      className: "sticker-container"
    });

    const item = marker(sticker.latlng, { icon, draggable: true }).addTo(map);

    setLayer(item);

    return () => item.removeFrom(map);
  }, [element, map, sticker]);

  return createPortal(
    <React.Fragment>
      <div className="sticker-arrow" ref={stickerArrow} />
      <div
        className={classNames(`sticker-label ${direction}`, {})}
        ref={stickerImage}
      >
        <StickerDesc value={sticker.text} onChange={setText} />

        <div
          className="sticker-image"
          style={{
            backgroundImage: `url('${STICKERS[sticker.set].url}`,
            backgroundPosition: `${-STICKERS[sticker.set].layers[
              sticker.sticker
            ].off * 72} 50%`
          }}
          onMouseDown={onDragStart}
          onMouseUp={onDragStop}
          onTouchStart={onDragStart}
          onTouchEnd={onDragStop}
        />

        <div
          className="sticker-delete"
          onMouseDown={onDelete}
          onTouchStart={onDelete}
        />
      </div>
    </React.Fragment>,
    element
  );
};

export { Sticker };
