import axios from 'axios';

export class Shotter {
  constructor({ map }) {
    this.tiles = [];
    this.tilesLoaded = 0;
    this.map = map;
  }

  latLngToTile = latlng => {
    const z = this.map.getZoom();
    const x = parseInt(Math.floor(((latlng.lng + 180) / 360) * (1 << z)), 10);
    const y = parseInt(Math.floor((1 - (Math.log(Math.tan((latlng.lat * Math.PI) / 180)
      + 1 / Math.cos((latlng.lat * Math.PI) / 180)) / Math.PI)) / 2 * (1 << z)), 10);
    return { x, y, z };
  };

  tileToLatLng = point => {
    const z = this.map.getZoom();
    const lng = (((point.x / (2 ** z)) * 360) - 180);

    const n = Math.PI - ((2 * Math.PI * point.y) / (2 ** z));
    const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

    return { lat, lng };
  };

  getTilePlacement() {
    const { innerHeight, innerWidth } = window;
    const { _southWest, _northEast } = this.map.getBounds();

    const sw = this.latLngToTile(_southWest);
    const ne = this.latLngToTile(_northEast);

    const zsw = this.tileToLatLng(sw);
    const zne = this.tileToLatLng(ne);

    const rsw = this.map.latLngToContainerPoint(zsw);
    const msw = this.map.latLngToContainerPoint(_southWest);

    return {
      min_x: sw.x,
      min_y: ne.y,
      max_x: ne.x,
      max_y: sw.y,
      sh_x: (rsw.x - msw.x),
      sh_y: ((innerHeight + rsw.y) - msw.y),
      size: 256,
      width: innerWidth,
      height: innerHeight,
      zoom: this.map.getZoom(),
      provider: 'dgis',
    };
  }

  makeShot = () => {
    // console.log('shot', this.getTilePlacement());
    const placement = this.getTilePlacement();

    axios.get('http://alpha-map.vault48.org/engine/composerOrchid.php', {
      params: { placement, mode: 'test' }
    })
      .then(console.log)
      .catch(console.warn);
  }
}
