import L from 'leaflet';
import { providers } from '$constants/providers';

import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';

export class Map {
  constructor({ container }) {
    this.map = L.map(container, { editable: true }).setView([55.0153275, 82.9071235], 13);

    this.tileLayer = L.tileLayer(providers.default, {
      attribution: 'Независимое Велосообщество',
      maxNativeZoom: 18,
      maxZoom: 18,
    });

    this.tileLayer.addTo(this.map);
  }
}
