import { Map } from 'leaflet';

export class MapContainer extends Map {
  disableClicks = () => {
    this.clickable = false;
  };

  enableClicks = () => {
    this.clickable = true;
  };

  public clickable = true;
}

export const MainMap = new MapContainer(document.getElementById('canvas')).setView(
  [55.0153275, 82.9071235],
  13
);
