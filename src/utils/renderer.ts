// import { editor } from '$modules/Editor';
import { COLORS, CLIENT } from '$config/frontend';
import * as saveAs from 'file-saver';
import { replaceProviderUrl } from '$constants/providers';
import { STICKERS } from '$constants/stickers';
import { ILatLng } from '$modules/Stickers';
import { IStickerDump } from '$modules/Sticker';
import { IRootState } from '$redux/user';
import {
  angleBetweenPoints,
  angleBetweenPointsRad,
  findDistancePx,
  middleCoordPx,
} from '$utils/geom';
import { Point } from 'leaflet';
import { MainMap } from '$containers/map/Map';

export interface ITilePlacement {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  shiftX: number;
  shiftY: number;
  size: number;
  width: number;
  height: number;
  zoom: number;
}

export interface IStickerPlacement extends IStickerDump {
  x: number;
  y: number;
}

const latLngToTile = (latlng: {
  lat: number;
  lng: number;
}): { x: number; y: number; z: number } => {
  const map = MainMap;
  const zoom = map.getZoom();
  const xtile = Number(Math.floor(((latlng.lng + 180) / 360) * (1 << zoom)));
  const ytile = Number(
    Math.floor(
      ((1 -
        Math.log(
          Math.tan((latlng.lat * Math.PI) / 180) + 1 / Math.cos((latlng.lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        (1 << zoom)
    )
  );

  return { x: xtile, y: ytile, z: zoom };
};

const tileToLatLng = (point: { x: number; y: number }): ILatLng => {
  const map = MainMap;
  const z = map.getZoom();
  const lng = (point.x / Math.pow(2, z)) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * point.y) / Math.pow(2, z);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
};

export const getTilePlacement = (): ITilePlacement => {
  const map = MainMap;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // map corners
  const southWest = map.getBounds().getSouthWest();
  const northEast = map.getBounds().getNorthEast();

  // map corner's tile files [x, y, z] to fetch from server
  const southWestTile = latLngToTile(southWest);
  const northEastTile = latLngToTile(northEast);

  // filling tile file ranges
  const { x: minX, y: maxY, z: zoom } = southWestTile;
  const { x: maxX, y: minY } = northEastTile;

  // actual coords of file's corners (they're shifted from view)
  const southWestTileCoords = tileToLatLng(southWestTile);

  const tileTransformTranslate = map.latLngToLayerPoint(southWestTileCoords);
  const msw2 = map.latLngToLayerPoint(southWest);

  return {
    minX,
    maxX,
    minY,
    maxY,
    shiftX: tileTransformTranslate.x - msw2.x,
    shiftY: (maxY - minY) * 256 - (window.innerHeight + (tileTransformTranslate.y - msw2.y)),
    size: 256,
    width,
    height,
    zoom,
  };
};

export const getPolyPlacement = (latlngs: ILatLng[]): Point[] =>
  latlngs.length === 0
    ? []
    : latlngs.map(latlng => (MainMap.latLngToContainerPoint(latlng)));

export const getStickersPlacement = (stickers: IStickerDump[]): IStickerPlacement[] =>
  stickers.length === 0
    ? []
    : stickers.map(sticker => ({
        ...sticker,
        ...MainMap.latLngToContainerPoint(sticker.latlng),
      }));

const getImageSource = (coords: { x: number; y: number; zoom: number }, provider: string): string =>
  replaceProviderUrl(provider, coords);

export const imageFetcher = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);

    img.src = source;
  });

export const fetchImages = (
  ctx: CanvasRenderingContext2D,
  geometry: ITilePlacement,
  provider,
): Promise<{ x: number; y: number; image: HTMLImageElement }[]> => {
  const { minX, maxX, minY, maxY, zoom } = geometry;

  const images = [];
  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      images.push({ x, y, source: getImageSource({ x, y, zoom }, provider) });
    }
  }

  return Promise.all(
    images.map(({ x, y, source }) => imageFetcher(source).then(image => ({ x, y, image })))
  );
};

export const composeImages = ({
  images,
  geometry,
  ctx,
}: {
  images: [];
  geometry: ITilePlacement;
  ctx: CanvasRenderingContext2D;
}): void => {
  const { minX, minY, shiftX, shiftY, size } = geometry;

  images.map(({ x, y, image }) => {
    const posX = (x - minX) * size + shiftX;
    const posY = (y - minY) * size - shiftY;

    return ctx.drawImage(image, posX, posY, 256, 256);
  });
};

export const composePoly = ({
  points,
  ctx,
}: {
  points: Point[];
  ctx: CanvasRenderingContext2D;
}): void => {
  if (points.length === 0) return;

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  ctx.strokeStyle = 'red';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = CLIENT.STROKE_WIDTH + 0.5;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);

    // gradient bounds
    if (points[i].x < minX) minX = points[i].x;
    if (points[i].x > maxX) maxX = points[i].x;
    if (points[i].y < minY) minY = points[i].y;
    if (points[i].y > maxY) maxY = points[i].y;
  }

  const gradient = ctx.createLinearGradient(minX, minY, minX, maxY);
  gradient.addColorStop(0, COLORS.PATH_COLOR[0]);
  gradient.addColorStop(1, COLORS.PATH_COLOR[1]);

  ctx.strokeStyle = gradient;
  ctx.stroke();
  ctx.closePath();
};

export const composeArrows = async ({
  points,
  ctx,
}: {
  points: Point[];
  ctx: CanvasRenderingContext2D;
}): Promise<boolean[]> => {
  const image = await imageFetcher(require('$sprites/arrow.svg'));

  const distances = points.map(
    (point, i) => (points[i + 1] && findDistancePx(points[i], points[i + 1])) || 0
  );

  // we want to annotate at least 5 arrows
  const min_arrows = distances.length >= 5 ? 5 : distances.length - 1;
  const min_distance = distances.sort((a, b) => b - a)[min_arrows];

  return points.map((point, i) => {
    if (!points[i + 1]) return false;

    const distance = findDistancePx(points[i], points[i + 1]);
    const angle = angleBetweenPointsRad(points[i], points[i + 1]);

    if (distance < min_distance && distance < 100) return false;

    const middle = middleCoordPx(points[i], points[i + 1]);

    ctx.save();
    ctx.translate(middle.x, middle.y);
    ctx.rotate(Math.PI * 0.5 - angle);
    ctx.translate(-middle.x, -middle.y);

    ctx.moveTo(middle.x, middle.y);

    ctx.drawImage(image, middle.x - 24, middle.y - 24, 48, 48);

    ctx.restore();

    return true;
  });
};

const measureText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  lineHeight: number
): { width: number; height: number } =>
  text.split('\n').reduce(
    (obj, line) => ({
      width: Math.max(ctx.measureText(line).width, obj.width),
      height: obj.height + lineHeight,
    }),
    { width: 0, height: 0 }
  );

const measureDistText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  height: number
): { width: number; height: number } => ({
  width: ctx.measureText(text).width,
  height,
});

const composeStickerArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI * 0.75);
  ctx.translate(-x, -y);
  ctx.fillStyle = '#ff3344';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 38, y + 20);
  ctx.lineTo(x + 38, y + 38);
  ctx.lineTo(x + 20, y + 38);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

const measureRect = (x: number, y: number, width: number, height: number, reversed: boolean) => ({
  rectX: reversed ? x - width - 36 - 10 : x,
  rectY: y - 7 - height / 2,
  rectW: width + 36 + 10,
  rectH: height + 20,
  textX: reversed ? x - width - 36 : x + 36,
});

const measureDistRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  reversed: boolean
) => ({
  rectX: reversed ? x - width - 12 : x - 8,
  rectY: y - 2 - height / 2,
  rectW: reversed ? width + 22 : width + 20,
  rectH: height + 4,
  textX: reversed ? x - width - 8 : x + 8,
});

export const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  rad: number = 5
): void => {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y + rad);
  ctx.lineTo(x, y + height - rad);

  ctx.lineTo(x + rad, y + height - rad);
  ctx.lineTo(x + rad, y + height);
  ctx.lineTo(x + width - rad, y + height);
  ctx.lineTo(x + width - rad, y + height - rad);
  ctx.lineTo(x + width, y + height - rad);
  ctx.lineTo(x + width, y + rad);
  ctx.lineTo(x + width - rad, y + rad);
  ctx.lineTo(x + width - rad, y);
  ctx.lineTo(x + rad, y);
  ctx.lineTo(x + rad, y + rad);

  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + rad, y + rad, rad, 0, 360);
  ctx.arc(x + width - rad, y + height - rad, rad, 0, 360);
  ctx.arc(x + width - rad, y + rad, rad, 0, 360);
  ctx.arc(x + rad, y + height - rad, rad, 0, 360);
  ctx.closePath();

  ctx.fill();
};

const composeStickerText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  text: string
): void => {
  const rad = 56;
  const tX = Math.cos(angle + Math.PI) * rad - 30 + x + 28;
  const tY = Math.sin(angle + Math.PI) * rad - 30 + y + 29;

  ctx.font = '12px "Helvetica Neue", Arial';
  const lines = text.split('\n');
  const { width, height } = measureText(ctx, text, 16);

  const { rectX, rectY, rectW, rectH, textX } = measureRect(
    tX,
    tY,
    width,
    height,
    angle > -(Math.PI / 2) && angle < Math.PI / 2
  );
  // rectangle
  // ctx.fillStyle = '#222222';
  // ctx.beginPath();
  // ctx.rect(
  //   rectX,
  //   rectY,
  //   rectW,
  //   rectH,
  // );
  // ctx.closePath();
  // ctx.fill();
  roundedRect(ctx, rectX, rectY, rectW, rectH, '#222222', 2);

  // text
  ctx.fillStyle = 'white';
  lines.map((line, i) => ctx.fillText(line, textX, rectY + 6 + 16 * (i + 1)));
};

export const composeDistMark = ({
  ctx,
  points,
  distance,
}: {
  ctx: CanvasRenderingContext2D;
  points: Point[];
  distance: number;
}): void => {
  if (points.length <= 1) return;

  ctx.font = 'bold 12px "Helvetica Neue", Arial';

  const angle = angleBetweenPoints(points[points.length - 2], points[points.length - 1]);
  const dist = parseFloat(distance.toFixed(1));
  const { x, y } = points[points.length - 1];
  const { width, height } = measureDistText(ctx, String(dist), 16);
  const { rectX, rectY, rectW, rectH, textX } = measureDistRect(
    x,
    y,
    width,
    height,
    !(angle > -90 && angle < 90)
  );

  roundedRect(ctx, rectX, rectY, rectW, rectH, '#ff3344', 2);

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 360);
  ctx.closePath();
  ctx.fill();

  ctx.fillText(String(dist), textX, rectY + 14);
};

const composeStickerImage = async (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  set: IRootState['activeSticker']['set'],
  sticker: IRootState['activeSticker']['sticker']
): Promise<void> => {
  const rad = 56;
  const tX = Math.cos(angle + Math.PI) * rad - 30 + (x - 8);
  const tY = Math.sin(angle + Math.PI) * rad - 30 + (y - 4);
  const offsetX = STICKERS[set].layers[sticker].off * 72;

  return imageFetcher(STICKERS[set].url).then(image =>
    ctx.drawImage(image, offsetX, 0, 72, 72, tX, tY, 72, 72)
  );
};

export const composeStickers = async ({
  stickers,
  ctx,
}: {
  stickers: IStickerPlacement[];
  ctx: CanvasRenderingContext2D;
}): Promise<void> => {
  if (!stickers || stickers.length < 0) return;

  stickers.map(({ x, y, angle, text }) => {
    composeStickerArrow(ctx, x, y, angle);

    if (text) composeStickerText(ctx, x, y, angle, text);
  });

  await Promise.all(
    stickers.map(({ x, y, angle, set, sticker }) =>
      composeStickerImage(ctx, x, y, angle, set, sticker)
    )
  );
};

export const downloadCanvas = (canvas: HTMLCanvasElement, title: IRootState['title']): void =>
  canvas.toBlob(blob => saveAs(blob, title));
