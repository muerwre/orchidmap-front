import { map, tileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import { PROVIDER } from '$config/frontend';
import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';

export class Map {
  constructor({ container }) {
    this.map = map(container, { editable: true }).setView([55.0153275, 82.9071235], 13);

    this.tileLayer = tileLayer(PROVIDER.url, {
      attribution: 'Независимое Велосообщество',
      maxNativeZoom: 18,
      maxZoom: 18,
    });

    this.tileLayer.addTo(this.map);
  }

  setProvider = provider => {
    const { url } = (provider && PROVIDERS[provider] && PROVIDERS[provider]) || PROVIDERS[DEFAULT_PROVIDER];

    this.tileLayer.setUrl(url);
  }
}
