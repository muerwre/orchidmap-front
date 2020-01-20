import { MOBILE_BREAKPOINT } from '~/config/frontend';
import { LatLngLiteral } from 'leaflet';

export const isMobile = (): boolean => window.innerWidth <= MOBILE_BREAKPOINT;

export const getLocation = (callback: (pos: LatLngLiteral) => void) => {
  window.navigator.geolocation.getCurrentPosition(position => {
    console.log('getting pos');

    if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude)
      return callback(null);

    const { latitude: lat, longitude: lng } = position.coords;

    callback({ lat, lng });
    return;
  });
};

export const watchLocation = (callback: (pos: LatLngLiteral) => void): number => {
  return window.navigator.geolocation.watchPosition(
    position => {
      console.log('Watch?');

      if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude)
        return callback(null);

      const { latitude: lat, longitude: lng } = position.coords;

      callback({ lat, lng });
      return;
    },
    () => callback(null),
    {
      timeout: 30,
    }
  );
};
