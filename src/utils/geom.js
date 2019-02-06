export const middleCoord = (l1, l2) => ({
  lat: (l2.lat + ((l1.lat - l2.lat) / 2)),
  lng: (l2.lng + ((l1.lng - l2.lng) / 2))
});

export const deg2rad = deg => ((deg * Math.PI) / 180);
export const rad2deg = rad => ((rad / Math.PI) * 180);

window.rad2deg = rad2deg;

export const findDistance = (t1, n1, t2, n2) => {
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
  // const dm = c * 3961; // great circle distance in miles
  const dk = c * 6373; // great circle distance in km

  // round the results down to the nearest 1/1000
  // const mi = round(dm);
  return (Math.round(dk * 1000) / 1000);
};

export const getLabelDirection = angle => (((angle % Math.PI) >= -(Math.PI / 2) && (angle % Math.PI) <= (Math.PI / 2)) ? 'left' : 'right');
