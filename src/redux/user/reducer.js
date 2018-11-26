import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO } from '$constants/logos';

const setUser = (state, { user }) => ({
  ...state,
  user: {
    ...state.user,
    ...user,
  },
});

const setEditing = (state, { editing }) => ({ ...state, editing });
const setMode = (state, { mode }) => ({ ...state, mode });
const setDistance = (state, { distance }) => ({ ...state, distance });

const HANDLERS = {
  [ACTIONS.SET_USER]: setUser,
  [ACTIONS.SET_EDITING]: setEditing,
  [ACTIONS.SET_MODE]: setMode,
  [ACTIONS.SET_DISTANCE]: setDistance,
};

export const INITIAL_STATE = {
  user: { ...DEFAULT_USER },
  editing: false,
  mode: MODES.NONE,
  logo: DEFAULT_LOGO,
  routerPoints: 0,
  distance: 0,
  estimateTime: 0,
  activeSticker: null,
  title: 0,
  address: '',
  changed: false,
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
