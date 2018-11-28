import { map, tileLayer } from 'leaflet';
// import { Map as map } from 'leaflet/src/map/Map';
// import { TileLayer as tileLayer } from 'leaflet/src/layer/tile/TileLayer';

import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import { PROVIDER } from '$config';

export class Map {
  constructor({ container }) {
    this.map = map(container, { editable: true }).setView([55.0153275, 82.9071235], 13);

    this.tileLayer = tileLayer(PROVIDER, {
      attribution: 'Независимое Велосообщество',
      maxNativeZoom: 18,
      maxZoom: 18,
    });

    this.tileLayer.addTo(this.map);
  }
}
