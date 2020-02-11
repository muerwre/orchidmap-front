import { Map, LineUtil, LatLng } from 'leaflet';
import { MainMap } from '~/constants/map';

export const simplify = (latlngs: LatLng[]): LatLng[] => {
  const zoom = 12;
  const mul = 0.7; // 0 - not simplifying, 1 - very rude.
  const points = latlngs.map(({ lat, lng }) => MainMap.project({ lat, lng }, zoom));
  return LineUtil.simplify(points, mul).map(item => MainMap.unproject(item, zoom));
};
