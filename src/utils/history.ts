import { history } from '$redux/store';

interface IUrlData {
  path: string,
  mode: 'edit' | '',
  host: string,
  hash: string,
  protocol: 'http' | 'https',
}

export const getPath = (): string => (window.location && window.location.pathname);
export const pushPath = (url: string): string => history.push(url);
export const replacePath = (url: string): string => history.replace(url);

export const getUrlData = (url = getPath()) => {
  const [, path, mode] = url.split('/');
  const { host, hash, protocol } = window.location;

  return {
    path, mode, host, hash, protocol,
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

export const pushNetworkInitError = () => {
  document.getElementById('loader-error').style.opacity = String(1);
};

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
