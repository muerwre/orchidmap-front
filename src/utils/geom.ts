import { LatLng, LatLngLiteral, point, Point, PointExpression } from 'leaflet';

interface ILatLng {
  lat: number;
  lng: number;
}

export const middleCoord = (l1: ILatLng, l2: ILatLng): ILatLng => ({
  lat: l2.lat + (l1.lat - l2.lat) / 2,
  lng: l2.lng + (l1.lng - l2.lng) / 2,
});

export const middleCoordPx = (p1: Point, p2: Point): Point =>
  point({
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  });

export const deg2rad = (deg: number): number => (deg * Math.PI) / 180;
export const rad2deg = (rad: number): number => (rad / Math.PI) * 180;

export const findDistancePx = (p1: Point, p2: Point): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

export const findDistance = (t1: number, n1: number, t2: number, n2: number): number => {
  // convert coordinates to radians
  const lat1 = deg2rad(t1);
  const lon1 = deg2rad(n1);
  const lat2 = deg2rad(t2);
  const lon2 = deg2rad(n2);

  // find the differences between the coordinates
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  // here's the heavy lifting
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
  const dk = c * 6373; // great circle distance in km

  return Math.round(dk * 1000) / 1000;
};

// probably faster one
export const findDistanceHaversine = (t1: number, n1: number, t2: number, n2: number): number => {
  const R = 6371; // km
  const dLat = ((t2 - t1) * Math.PI) / 180;
  var dLon = ((n2 - n1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((t1 * Math.PI) / 180) *
      Math.cos((t2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
};

export const distKm = (A: LatLngLiteral, B: LatLngLiteral): number =>
  findDistance(A.lat, A.lng, B.lat, B.lng);

export const distKmHaversine = (A: LatLngLiteral, B: LatLngLiteral): number =>
  findDistanceHaversine(A.lat, A.lng, B.lat, B.lng);

export const getLabelDirection = (angle: number): 'left' | 'right' =>
  angle % Math.PI >= -(Math.PI / 2) && angle % Math.PI <= Math.PI / 2 ? 'left' : 'right';

export const getPolyLength = (latlngs: LatLngLiteral[]): number => {
  if (latlngs.length < 2) return 0;

  return latlngs.reduce(
    (dist, item, index) =>
      index < latlngs.length - 1 ? dist + distKmHaversine(item, latlngs[index + 1]) : dist,
    0
  );
};

// if C between A and B
export const pointInArea = (A: LatLng, B: LatLng, C: LatLng, radius: number = 0.001): boolean =>
  C.lng <= Math.max(A.lng + radius, B.lng + radius) &&
  C.lat <= Math.max(A.lat + radius, B.lat + radius) &&
  C.lat >= Math.min(A.lat - radius, B.lat - radius) &&
  C.lng >= Math.min(A.lng - radius, B.lng - radius);

export const dist2 = (A: LatLngLiteral, B: LatLngLiteral): number =>
  (A.lat - B.lat) ** 2 + (A.lng - B.lng) ** 2;

const distToSegmentSquared = (A: LatLng, B: LatLng, C: LatLng): number => {
  const l2 = dist2(A, B);
  if (l2 == 0) return dist2(C, A);

  const t = Math.max(
    0,
    Math.min(1, ((C.lat - A.lat) * (B.lat - A.lat) + (C.lng - A.lng) * (B.lng - A.lng)) / l2)
  );

  return dist2(C, {
    lat: A.lat + t * (B.lat - A.lat),
    lng: A.lng + t * (B.lng - A.lng),
  });
};

export const distToSegment = (A: LatLng, B: LatLng, C: LatLng): number =>
  Math.sqrt(distToSegmentSquared(A, B, C));

export const pointBetweenPoints = (A: LatLng, B: LatLng, C: LatLng): boolean =>
  distToSegment(A, B, C) < 0.01;

export const angleBetweenPoints = (A: Point, B: Point): number =>
  parseFloat(((Math.atan2(B.y - A.y, B.x - A.x) * 180) / Math.PI).toFixed());
export const angleBetweenPointsRad = (A: Point, B: Point): number =>
  Math.atan2(B.x - A.x, B.y - A.y);

export const allwaysPositiveAngleDeg = (angle: number): number =>
  angle >= -90 && angle <= 90 ? angle : 180 + angle;

export const nearestInt = (value: number, parts: number): number => value - (value % parts);
