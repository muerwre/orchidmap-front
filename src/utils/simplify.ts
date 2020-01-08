import { Map, LineUtil } from 'leaflet';
import { ILatLng } from "$redux/map/types";

export const simplify = ({ map, latlngs }: { map: Map, latlngs: ILatLng[] }): ILatLng[] => {
  const points = [];
  const target = [];
  const zoom = 12;
  const mul = 0.7; // 0 - not simplifying, 1 - very rude.
  // its better to estimate mul value by route length

  for (let i = 0; i < latlngs.length; i += 1) {
    points.push(map.project({ lat: latlngs[i].lat, lng: latlngs[i].lng }, zoom));
  }

  const simplified = LineUtil.simplify(points, mul);

  // for (let i = 0; i < simplified.length; i += 1) {
  //   target.push(map.unproject(simplified[i], zoom));
  // }
  //
  // return target;
  return simplified.map(item => map.unproject(item, zoom));
};
