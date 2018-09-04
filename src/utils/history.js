export const getPath = () => (window.location && window.location.pathname &&
  window.location.pathname.replace(/^\//, ''));

export const pushPath = url => window.history.pushState(url, 'Редактирование маршрута', url);

export const getUrlData = () => {
  const url = getPath();

  const [path, mode] = url.split('/');
  const { host } = window.location;

  return { path, mode, host };
};
