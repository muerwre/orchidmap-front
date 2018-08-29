export const getPath = () => (window.location && window.location.pathname &&
  window.location.pathname.replace(/^\//, ''));
