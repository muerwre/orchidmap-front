import { Map, LineUtil } from 'leaflet';
import { ILatLng } from "~/redux/map/types";

export const simplify = ({ map, latlngs }: { map: Map, latlngs: ILatLng[] }): ILatLng[] => {
  const zoom = 12;
  const mul = 0.7; // 0 - not simplifying, 1 - very rude.
  const points = latlngs.map(({ lat, lng }) => map.project({ lat, lng }, zoom));
  return LineUtil.simplify(points, mul).map(item => map.unproject(item, zoom));
};
