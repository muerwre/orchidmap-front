import { MOBILE_BREAKPOINT } from '~/config/frontend';
import { LatLngLiteral } from 'leaflet';

export const isMobile = (): boolean => window.innerWidth <= MOBILE_BREAKPOINT;

export const getLocation = (callback: (pos: LatLngLiteral | undefined) => void) => {
  window.navigator.geolocation.getCurrentPosition(position => {
    if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude)
      return callback(undefined);

    const { latitude: lat, longitude: lng } = position.coords;

    callback({ lat, lng });
    return;
  });
};

export const watchLocation = (callback: (pos: LatLngLiteral | undefined) => void): number => {
  return window.navigator.geolocation.watchPosition(
    position => {
      if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude)
        return callback(undefined);

      const { latitude: lat, longitude: lng } = position.coords;

      callback({ lat, lng });
      return;
    },
    () => callback(undefined),
    {
      timeout: 30,
    }
  );
};
