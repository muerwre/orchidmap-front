import axios from 'axios/index';

import { API } from '$constants/api';

const arrayToObject = (array, key) => array.reduce((obj, el) => ({ ...obj, [el[key]]: el }), {});

export const checkUserToken = ({ id, token }) => axios.get(API.CHECK_TOKEN, {
  params: { id, token }
}).then(result => (result && result.data && {
  ...result.data,
  id,
  token,
  routes: (result.data.routes && result.data.routes.length > 0 && arrayToObject(result.data.routes, '_id')) || {},
}));

export const getGuestToken = () => axios.get(API.GET_GUEST).then(result => (result && result.data));

export const getStoredMap = ({ name }) => axios.get(API.GET_MAP, {
  params: { name }
}).then(result => (result && result.data && result.data.success && result.data));

export const postMap = ({
  title, address, route, stickers, id, token, force, logo, distance,
}) => axios.post(API.POST_MAP, {
  title,
  address,
  route,
  stickers,
  id,
  token,
  force,
  logo,
  distance,
}).then(result => (result && result.data && result.data));

