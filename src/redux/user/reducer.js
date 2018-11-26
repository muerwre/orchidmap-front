import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';
import { MODES } from '$constants/modes';

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
  distance: 0,
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
