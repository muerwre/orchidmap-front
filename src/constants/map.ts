import { Map, LayerGroup, Layer, FeatureGroup } from 'leaflet';

export class MapContainer extends Map {
  constructor(props) {
    super(props);
    this.routeLayer.addTo(this);
    this.stickerLayer.addTo(this);
  }

  disableClicks = () => {
    this.clickable = false;
  };

  enableClicks = () => {
    this.clickable = true;
  };

  getVisibleBounds = () => {
    const layers = [this.routeLayer, this.stickerLayer];
    for (let i = 0; i < layers.length; i += 1) {
      const bounds = layers[i].getBounds();
      if (Object.keys(bounds).length == 2) return bounds;
    }
  };

  public clickable = true;

  public routeLayer = new FeatureGroup();
  public stickerLayer = new FeatureGroup();
}

export const MainMap = new MapContainer(document.getElementById('canvas')).setView(
  [55.0153275, 82.9071235],
  13
);
