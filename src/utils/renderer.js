import { editor } from '$modules/Editor';
import { COLORS, CLIENT } from '$config/frontend';
import saveAs from 'file-saver';
import { replaceProviderUrl } from '$constants/providers';

const latLngToTile = latlng => {
  const { map } = editor.map;
  const zoom = map.getZoom();
  const xtile = parseInt(Math.floor((latlng.lng + 180) / 360 * (1 << zoom)));
  const ytile = parseInt(Math.floor((1 - Math.log(Math.tan(latlng.lat * Math.PI / 180) + 1 / Math.cos(latlng.lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom)));

  return { x: xtile, y: ytile, z: zoom };
};

const tileToLatLng = point => {
  const { map } = editor.map;
  const z = map.getZoom();
  const lng = (point.x / Math.pow(2, z) * 360 - 180);
  const n = Math.PI - 2 * Math.PI * point.y / Math.pow(2, z);
  const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

  return { lat, lng };
};

export const getTilePlacement = () => {
  const { map } = editor.map;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // map corners
  const { _southWest: southWest, _northEast: northEast } = map.getBounds();

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
    // shiftY: window.innerHeight + (tileTransformTranslate.y - msw2.y),
    shiftY: ((maxY - minY) * 256) - (window.innerHeight + (tileTransformTranslate.y - msw2.y)),
    size: 256,
    width,
    height,
    zoom,
  };
};

export const getPolyPlacement = () => (
  (!editor.poly.poly || !editor.poly.poly.getLatLngs() || editor.poly.poly.getLatLngs().length <= 0)
    ? []
    : editor.poly.poly.getLatLngs().map((latlng) => ({ ...editor.map.map.latLngToContainerPoint(latlng) }))
);

const getImageSource = coords => replaceProviderUrl(editor.provider, coords);

export const imageFetcher = source => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => reject(img);

  img.src = source;
});

export const fetchImages = (ctx, geometry) => {
  const {
    minX, maxX, minY, maxY, zoom
  } = geometry;

  const images = [];
  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      images.push({ x, y, source: getImageSource({ x, y, zoom }) });
    }
  }

  return Promise.all(images.map(({ x, y, source }) => (
    imageFetcher(source).then(image => ({ x, y, image }))
  )));
};

export const composeImages = ({ images, geometry, ctx }) => {
  const {
    minX, minY, shiftX, shiftY, size
  } = geometry;

  images.map(({ x, y, image }) => {
    const posX = ((x - minX) * size) + shiftX;
    const posY = ((y - minY) * size) - shiftY;

    return ctx.drawImage(image, posX, posY, 256, 256);
  });

  return images;
};

export const composePoly = ({ points, ctx }) => {
  if (editor.poly.isEmpty) return;

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

  return true;
};

export const downloadCanvas = (canvas, title) => canvas.toBlob(blob => saveAs(blob, title));

