import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';

const API_ADDR = 'https://HOSTNAME.org:3000';
const OSRM_URL = 'https://HOSTNAME.org:5001/route/v1';

export const CLIENT = {
  OSRM_URL,
  API_ADDR,
  STROKE_WIDTH: 5,
};

export const COLORS = {
  PATH_COLOR: ['#ff7700', '#ff3344'],
};

export const PROVIDER = PROVIDERS[DEFAULT_PROVIDER];

export const MOBILE_BREAKPOINT = 768;
