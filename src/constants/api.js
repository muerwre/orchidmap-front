import { CLIENT } from '$config/frontend';

export const API = {
  GET_GUEST: `${CLIENT.API_ADDR}/auth`,
  CHECK_TOKEN: `${CLIENT.API_ADDR}/auth`,
  GET_MAP: `${CLIENT.API_ADDR}/route`,
  POST_MAP: `${CLIENT.API_ADDR}/route`,
  VK_IFRAME_AUTH: `${CLIENT.API_ADDR}/auth/social/vk_iframe`,
};
