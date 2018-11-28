import { editor } from '$modules/Editor';

const { map } = editor.map;
map.addEventListener('mousedown', ({ latlng }) => console.log('CLICK', latlng));

const latLngToTile = latlng => {
  const zoom = map.getZoom();
  const xtile = parseInt(Math.floor((latlng.lng + 180) / 360 * (1 << zoom)));
  const ytile = parseInt(Math.floor((1 - Math.log(Math.tan(latlng.lat * Math.PI / 180) + 1 / Math.cos(latlng.lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom)));

  return { x: xtile, y: ytile, z: zoom };
};

const tileToLatLng = point => {
  const z = map.getZoom();
  const lng = (point.x / Math.pow(2, z) * 360 - 180);
  const n = Math.PI - 2 * Math.PI * point.y / Math.pow(2, z);
  const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

  return { lat, lng };
};

export const getTilePlacement = () => {
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
    shiftY: window.innerHeight + (tileTransformTranslate.y - msw2.y),
    size: 256,
    width,
    height,
    zoom,
  };
};
