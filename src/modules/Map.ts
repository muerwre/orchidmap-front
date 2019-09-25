import { Map as MapInterface, map, tileLayer, TileLayer } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { PROVIDER } from '$config/frontend';
import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';

import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

interface Props {
  container: string;
}

export class Map {
  constructor({ container }: Props) {
    MapInterface.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    
    // Added gesture handling, but i don't like how it works
    // @ts-ignore
    this.map = map(container, { gestureHandling: true }).setView([55.0153275, 82.9071235], 13);
    // todo: change coords?

    this.tileLayer.addTo(this.map);
  }

  map: MapInterface;
  tileLayer: TileLayer = tileLayer(PROVIDER.url, {
    attribution: 'Независимое Велосообщество',
    maxNativeZoom: 18,
    maxZoom: 18
  });

  setProvider = (provider: string): void => {
    const { url } =
      (provider && PROVIDERS[provider] && PROVIDERS[provider]) || PROVIDERS[DEFAULT_PROVIDER];

    this.tileLayer.setUrl(url);
  };
}
