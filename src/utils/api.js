import axios from 'axios/index';

import { API } from '$constants/api';

const report = console.warn;

export const checkUserToken = ({
  callback, fallback, id, token
}) => (
  axios.get(API.GET_GUEST, {
    params: { action: 'check_token', id, token }
  })
    .then(result => (result && result.data))
    .then(data => ({ ...data, id, token }))
    .then(callback)
    .catch(fallback)
);
export const getGuestToken = ({ callback }) => (
  axios.get(API.GET_GUEST, {
    params: { action: 'gen_guest_token' }
  })
    .then(result => (result && result.data))
    .then(callback)
    .catch(report)
);

export const getMergedImage = ({ placement, callback }) => (
  axios.get(API.COMPOSE, {
    params: { placement }
  })
    .then(callback)
    .catch(report)
);
