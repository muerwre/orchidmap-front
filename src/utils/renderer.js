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

window.tileToLatLng = tileToLatLng;

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
  const northEastTileCoords = tileToLatLng(northEastTile);

  // console.log({ southWestTileCoords, northEastTileCoords });

  const rsw = map.latLngToContainerPoint(southWestTileCoords);
  const msw = map.latLngToContainerPoint(southWest);

  const tileTransformTranslate = map.latLngToLayerPoint(southWestTileCoords);
  const msw2 = map.latLngToLayerPoint(southWest);

  console.log({ rsw, msw, tileTransformTranslate, msw2, });
  // console.log({x: rsw.x-msw.x, y: h+rsw.y-msw.y, orig_x: sw.x, orig_y: sw.y})
  // console.log('going from '+sw.x+','+sw.y+' to '+ne.x+','+ne.y+' shift '+(rsw.x-msw.x)+','+(h+rsw.y-msw.y));
  // console.log('original shift: '+map.latLngToContainerPoint(original_shift))
  const data = {
    minX,
    maxX,
    minY,
    maxY,

    // shiftX: (rsw.x - msw.x),
    // shiftY: (height + (rsw.y - msw.y)),

    shiftX: tileTransformTranslate.x - msw2.x,
    shiftY: window.innerHeight + (tileTransformTranslate.y - msw2.y),
    // shiftY: 815,


    size: 256,
    width,
    height,

    zoom,
    // provider: current_map_style
  };

  console.log('DATA IS', data);

  return data;
};
