import { history } from '$redux/store';

export const getPath = () => (window.location && window.location.pathname);
export const pushPath = url => {
  return history.push(url);
};

export const getUrlData = (url = getPath()) => {
  const [, path, mode] = url.split('/');
  const { host, hash } = window.location;

  return {
    path, mode, host, hash
  };
};

// Parses query string
export const parseQuery = (queryString: string) => {
  let params = {};
  const queries = decodeURIComponent(queryString)
    .substring(queryString.substr(0, 1) === '?' ? 1 : 0)
    .split('&');
  for (let i = 0, l = queries.length; i < l; i += 1) {
    const temp = queries[i].split('=');
    params = { ...params, [temp[0]]: temp[1] };
  }
  return params;
};

export const pushLoaderState = state => {
  document.getElementById('loader-bar').style.width = `${state}%`;
};

export const pushNetworkInitError = state => {
  document.getElementById('loader-error').style.opacity = 1;
};
