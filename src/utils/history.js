import { history } from '$redux/store';

export const getPath = () => (window.location && window.location.pathname);
export const pushPath = url => history.push(url);
export const replacePath = url => history.replace(url);

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
  document.getElementById('loader-error').style.opacity = 1;
};

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
