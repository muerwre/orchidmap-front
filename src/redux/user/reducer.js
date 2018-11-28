import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO } from '$constants/logos';
import { TIPS } from '$constants/tips';

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

const sendSaveRequest = state => ({ ...state, save_processing: true, });
const setSaveError = (state, { save_error }) => ({
  ...state, save_error, save_finished: false, save_processing: false
});

const setSaveOverwrite = state => ({
  ...state,
  save_overwriting: true,
  save_finished: false,
  save_processing: false,
  save_error: TIPS.SAVE_OVERWRITE,
});

const setSaveSuccess = (state, { save_error }) => ({
  ...state, save_overwriting: false, save_finished: true, save_processing: false, save_error
});

const resetSaveDialog = state => ({
  ...state, save_overwriting: false, save_finished: false, save_processing: false, save_error: '',
});

const showRenderer = state => ({
  ...state,
  renderer: { ...state.renderer, renderer_active: true }
});

const hideRenderer = state => ({
  ...state,
  renderer: { ...state.renderer, renderer_active: false }
});

const setRenderer = (state, { payload }) => ({
  ...state,
  renderer: { ...state.renderer, ...payload }
});

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

  [ACTIONS.SET_SAVE_ERROR]: setSaveError,
  [ACTIONS.SET_SAVE_OVERWRITE]: setSaveOverwrite,
  [ACTIONS.SET_SAVE_SUCCESS]: setSaveSuccess,
  [ACTIONS.SEND_SAVE_REQUEST]: sendSaveRequest,
  [ACTIONS.RESET_SAVE_DIALOG]: resetSaveDialog,

  [ACTIONS.SHOW_RENDERER]: showRenderer,
  [ACTIONS.HIDE_RENDERER]: hideRenderer,
  [ACTIONS.SET_RENDERER]: setRenderer,
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
  title: '',
  address: '',
  changed: false,

  save_error: '',
  save_finished: false,
  save_overwriting: false,
  save_processing: false,

  renderer: {
    data: '',
    width: 0,
    height: 0,
    renderer_active: false,
  }
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
