import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO } from '$constants/logos';

const getEstimated = distance => {
  const time = (distance && (distance / 15)) || 0;
  return (time && parseFloat(time.toFixed(1)));
};

const setUser = (state, { user }) => ({
  ...state,
  user: {
    ...state.user,
    ...user,
  },
});

const setEditing = (state, { editing }) => ({ ...state, editing });
const setChanged = (state, { changed }) => ({ ...state, changed });
const setMode = (state, { mode }) => ({ ...state, mode });
const setDistance = (state, { distance }) => ({
  ...state,
  distance,
  estimated: getEstimated(distance),
});

const setRouterPoints = (state, { routerPoints }) => ({ ...state, routerPoints });

const setActiveSticker = (state, { activeSticker }) => ({ ...state, activeSticker });
const setLogo = (state, { logo }) => ({ ...state, logo });
const setTitle = (state, { title }) => ({ ...state, title });
const setAddress = (state, { address }) => ({ ...state, address });

const HANDLERS = {
  [ACTIONS.SET_USER]: setUser,
  [ACTIONS.SET_EDITING]: setEditing,
  [ACTIONS.SET_CHANGED]: setChanged,
  [ACTIONS.SET_MODE]: setMode,
  [ACTIONS.SET_DISTANCE]: setDistance,
  [ACTIONS.SET_ROUTER_POINTS]: setRouterPoints,
  [ACTIONS.SET_ACTIVE_STICKER]: setActiveSticker,
  [ACTIONS.SET_LOGO]: setLogo,
  [ACTIONS.SET_TITLE]: setTitle,
  [ACTIONS.SET_ADDRESS]: setAddress,
};

export const INITIAL_STATE = {
  user: { ...DEFAULT_USER },
  editing: false,
  mode: MODES.NONE,
  logo: DEFAULT_LOGO,
  routerPoints: 0,
  distance: 0,
  estimated: 0,
  activeSticker: null,
  title: 0,
  address: '',
  changed: false,
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
