import { CLIENT } from '$config/frontend';

export const API = {
  GET_GUEST: `${CLIENT.API_ADDR}/auth`,
  CHECK_TOKEN: `${CLIENT.API_ADDR}/auth`,
  IFRAME_LOGIN_VK: `${CLIENT.API_ADDR}/auth/iframe/vk`,
  GET_MAP: `${CLIENT.API_ADDR}/route`,
  POST_MAP: `${CLIENT.API_ADDR}/route`,
};
