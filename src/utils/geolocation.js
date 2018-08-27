export const getUserLocation = callback => {
  if (!navigator || !navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(callback);
};
