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

export const getLabelDirection = (angle: number): 'left' | 'right' => (
  ((angle % Math.PI) >= -(Math.PI / 2) && (angle % Math.PI) <= (Math.PI / 2)) ? 'left' : 'right'
);