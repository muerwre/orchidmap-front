import { LatLngLiteral } from 'leaflet';

export interface INominatimResult {
  id: number;
  title: string;
  latlng: LatLngLiteral;
};