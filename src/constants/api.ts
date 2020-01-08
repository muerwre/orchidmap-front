import { CLIENT } from '~/config/frontend';

export const API = {
  GET_GUEST: `${CLIENT.API_ADDR}/api/auth/`,
  CHECK_TOKEN: `${CLIENT.API_ADDR}/api/auth/`,
  IFRAME_LOGIN_VK: `${CLIENT.API_ADDR}/api/auth/vk`,
  GET_MAP: `${CLIENT.API_ADDR}/api/route/`,
  POST_MAP: `${CLIENT.API_ADDR}/api/route/`,
  GET_ROUTE_LIST: tab => `${CLIENT.API_ADDR}/api/route/list/${tab}`,

  DROP_ROUTE: `${CLIENT.API_ADDR}/api/route/`,
  MODIFY_ROUTE: `${CLIENT.API_ADDR}/api/route/`,
  SET_STARRED: `${CLIENT.API_ADDR}/api/route/publish`,
};

export const API_RETRY_INTERVAL = 10;
