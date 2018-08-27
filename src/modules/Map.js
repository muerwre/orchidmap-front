import { map, tileLayer } from 'leaflet';
import { providers } from '$constants/providers';

import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';

export class Map {
  constructor({ container }) {
    this.map = map(container, { editable: true }).setView([55.0153275, 82.9071235], 13);

    this.tileLayer = tileLayer(providers.dgis, {
      attribution: 'Независимое Велосообщество',
      maxNativeZoom: 18,
      maxZoom: 18,
    });

    this.tileLayer.addTo(this.map);
  }
}
