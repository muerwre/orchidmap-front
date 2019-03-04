import { LatLng, LatLngLiteral, Point, PointExpression } from "leaflet";

interface ILatLng {
  lat: number,
  lng: number,
}

export const middleCoord = (l1: ILatLng, l2: ILatLng): ILatLng => ({
  lat: (l2.lat + ((l1.lat - l2.lat) / 2)),
  lng: (l2.lng + ((l1.lng - l2.lng) / 2))
});

export const deg2rad = (deg: number): number => ((deg * Math.PI) / 180);
export const rad2deg = (rad: number): number => ((rad / Math.PI) * 180);

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
  const a = (Math.sin(dlat / 2) ** 2) +
    (Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon / 2) ** 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
  const dk = c * 6373; // great circle distance in km

  return (Math.round(dk * 1000) / 1000);
};

export const distKm = (A: LatLngLiteral, B: LatLngLiteral): number => findDistance(A.lat, A.lng, B.lat, B.lng);

export const getLabelDirection = (angle: number): 'left' | 'right' => (
  ((angle % Math.PI) >= -(Math.PI / 2) && (angle % Math.PI) <= (Math.PI / 2)) ? 'left' : 'right'
);

export const getPolyLength = (latlngs: LatLngLiteral[]): number => {
  if (latlngs.length < 2) return 0;

  return latlngs.reduce((dist, item, index) => (
    index < (latlngs.length - 1)
      ? dist + distKm(item, latlngs[index + 1])
      : dist
  ), 0)
};

// if C between A and B
export const pointInArea = (A: LatLng, B: LatLng, C: LatLng, radius: number = 0.001): boolean => (
  C.lng <= Math.max(A.lng + radius, B.lng + radius) &&
  C.lat <= Math.max(A.lat + radius, B.lat + radius) &&
  C.lat >= Math.min(A.lat - radius, B.lat - radius) &&
  C.lng >= Math.min(A.lng - radius, B.lng - radius)
);


export const dist2 = (A: LatLngLiteral, B: LatLngLiteral): number => (((A.lat - B.lat) ** 2) + ((A.lng - B.lng) ** 2));

const distToSegmentSquared = (A: LatLng, B: LatLng, C: LatLng): number => {
  const l2 = dist2(A, B);
  if (l2 == 0) return dist2(C, A);

  const t = Math.max(
    0,
    Math.min(
      1,
      (((C.lat - A.lat) * (B.lat - A.lat) + (C.lng - A.lng) * (B.lng - A.lng)) / l2)
    )
  );

  return dist2(
    C,
    {
      lat: A.lat + t * (B.lat - A.lat),
      lng: A.lng + t * (B.lng - A.lng)
    });
};

export const distToSegment = (A: LatLng, B: LatLng, C: LatLng): number => Math.sqrt(distToSegmentSquared(A, B, C));
// if C between A and B
export const pointBetweenPoints = (A: LatLng, B: LatLng, C: LatLng): boolean => (distToSegment(A, B, C) < 0.01);

export const angleBetweenPoints = (A: Point, B: Point): number => parseFloat(((Math.atan2(B.y - A.y, B.x - A.x))* 180 / Math.PI).toFixed());
export const angleBetweenPointsRad = (A: Point, B: Point): number => ((Math.atan2(B.x - A.x, B.y - A.y)));

export const pointOnDistance = (A: Point, B: Point, shift: number): Point => {
  const c = Math.sqrt((((B.x - A.x) ** 2) + ((B.y - A.y) ** 2)));
  const angle = angleBetweenPointsRad(A, B);

  // console.log({ angle, c, shift });
  const x = Math.floor(B.x - c * Math.sin(angle) * shift);
  const y = Math.floor(B.y - c * Math.cos(angle) * shift);

  // console.log({ x, y });

  return new Point(x, y);
};
