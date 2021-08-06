export const API = {
  GET_GUEST: `/api/auth/`,
  CHECK_TOKEN: `/api/auth/`,
  IFRAME_LOGIN_VK: `/api/auth/vk`,
  GET_MAP: `/api/route/`,
  POST_MAP: `/api/route/`,
  GET_ROUTE_LIST: tab => `/api/route/list/${tab}`,

  DROP_ROUTE: `/api/route/`,
  MODIFY_ROUTE: `/api/route/`,
  SET_STARRED: `/api/route/publish`,
};

export const API_RETRY_INTERVAL = 10;
