import axios from 'axios/index';

import { API } from '$constants/api';

const report = console.warn;

export const checkUserToken = ({ id, token }) => axios.get(API.CHECK_TOKEN, {
  params: {
    id,
    token,
    action: 'check_token',
  }
}).then(result => (result && result.data && { ...result.data, id, token }))

export const getGuestToken = () => axios.get(API.GET_GUEST, {
  params: {
    action: 'gen_guest_token'
  }
}).then(result => (result && result.data));

export const getMergedImage = ({ placement, callback }) => (
  axios.get(API.COMPOSE, {
    params: { placement }
  })
    .then(callback)
    .catch(report)
);

export const getStoredMap = ({ name }) => axios.get(API.GET_MAP, {
  params: {
    name,
    action: 'load'
  }
}).then(result => (result && result.data && result.data.data && result.data.owner && { ...result.data.data, owner: result.data.owner }));

export const postMap = ({ title, address, route, stickers, id, token }) => axios.post(API.POST_MAP, {
  action: 'store',
  title,
  address,
  route,
  stickers,
  id,
  token,
}).then(result => (result && result.data && result.data.data && result.data.owner && { ...result.data.data, owner: result.data.owner }));
