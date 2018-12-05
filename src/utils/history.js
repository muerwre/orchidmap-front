import { history } from '$redux/store';

export const getPath = () => (window.location && window.location.pathname);
export const pushPath = url => history.push(url);

export const getUrlData = (url = getPath()) => {
  const [, path, mode] = url.split('/');
  const { host } = window.location;

  return { path, mode, host };
};
