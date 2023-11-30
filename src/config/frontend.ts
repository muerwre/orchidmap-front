import { DEFAULT_PROVIDER, PROVIDERS } from '~/constants/providers';
import { LatLngLiteral } from 'leaflet';

const PUBLIC_PATH = process.env.REACT_APP_PUBLIC_PATH || '';
const API_ADDR = process.env.REACT_APP_API_ADDR || '';
const OSRM_URL = process.env.REACT_APP_OSRM_URL || '';
const OSRM_PROFILE = process.env.REACT_APP_OSRM_PROFILE || 'bike';
const OSRM_TEST_URL = ([south_west, north_east]: LatLngLiteral[]) =>
  `${OSRM_URL}/${OSRM_PROFILE}/${Object.values(south_west).join(',')};${Object.values(
    north_east
  ).join(',')}`;

export const CLIENT = {
  OSRM_URL,
  API_ADDR,
  OSRM_TEST_URL,
  OSRM_PROFILE,
  STROKE_WIDTH: 5,
  PUBLIC_PATH,
  NOMINATIM_TEST_URL: '',
  NOMINATIM_URL: '',
};

export const COLORS = {
  PATH_COLOR: ['#ff7700', '#ff3344'],
};

export const PROVIDER = PROVIDERS[DEFAULT_PROVIDER];

export const MOBILE_BREAKPOINT = 768;
