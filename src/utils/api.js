import axios from 'axios/index';

import { API } from '$constants/api';

const report = console.warn;

export const checkUserToken = ({ id, token }) => axios.get(API.CHECK_TOKEN, {
  params: { id, token }
}).then(result => (result && result.data && { ...result.data, id, token }));

export const getGuestToken = () => axios.get(API.GET_GUEST).then(result => (result && result.data));

export const getMergedImage = ({ placement, callback }) => (
  axios.get(API.COMPOSE, {
    params: { placement }
  })
    .then(callback)
    .catch(report)
);

export const getStoredMap = ({ name }) => axios.get(API.GET_MAP, {
  params: { name }
}).then(result => (result && result.data));

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
