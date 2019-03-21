import { CLIENT } from '$config/frontend';

export const API: { [x: string]: string } = {
  GET_GUEST: `${CLIENT.API_ADDR}/auth`,
  CHECK_TOKEN: `${CLIENT.API_ADDR}/auth`,
  IFRAME_LOGIN_VK: `${CLIENT.API_ADDR}/auth/iframe/vk`,
  GET_MAP: `${CLIENT.API_ADDR}/route`,
  POST_MAP: `${CLIENT.API_ADDR}/route`,
  GET_ROUTE_LIST: `${CLIENT.API_ADDR}/route/list`,

  DROP_ROUTE: `${CLIENT.API_ADDR}/route`,
  MODIFY_ROUTE: `${CLIENT.API_ADDR}/route/modify`,
  SET_STARRED: `${CLIENT.API_ADDR}/route/star`,
};
