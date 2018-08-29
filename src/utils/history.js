export const getPath = () => (window.location && window.location.pathname &&
  window.location.pathname.replace(/^\//, ''));

export const replacePath = url => window.history.replaceState(url, 'Редактирование маршрута', url);

export const getUrlData = () => {
  const url = getPath();

  const [path, mode] = url.split('/');

  return { path, mode };
};
