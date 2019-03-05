import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';
import { LatLngLiteral } from 'leaflet';

const API_ADDR = 'https://HOSTNAME.org:3000';
const OSRM_URL = 'https://HOSTNAME.org:5001/route/v1';
const OSRM_PROFILE = 'bike';
const OSRM_TEST_URL = ([south_west, north_east]: [LatLngLiteral, LatLngLiteral]) => (
  `${OSRM_URL}/${OSRM_PROFILE}/${Object.values(south_west).join(',')};${Object.values(north_east).join(',')}`
);

export const CLIENT = {
  OSRM_URL,
  API_ADDR,
  OSRM_TEST_URL,
  OSRM_PROFILE,
  STROKE_WIDTH: 5,
};

export const COLORS = {
  PATH_COLOR: ['#ff7700', '#ff3344'],
};

export const PROVIDER = PROVIDERS[DEFAULT_PROVIDER];

export const MOBILE_BREAKPOINT = 768;
