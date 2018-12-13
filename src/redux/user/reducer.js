// @flow
import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO } from '$constants/logos';
import { TIPS } from '$constants/tips';
import { DEFAULT_PROVIDER } from '$constants/providers';
import { DIALOGS, TABS } from '$constants/dialogs';

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

const setActiveSticker = (state, { activeSticker }) => ({
  ...state,
  activeSticker: activeSticker || { set: null, sticker: null }
});
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

const setProvider = (state, { provider }) => ({ ...state, provider });

const setDialog = (state, { dialog }) => ({
  ...state,
  dialog,
  // dialog_active: typeof dialog_active !== 'undefined' ? dialog_active : !state.dialog_active,
  // dialog_active,
});

const setDialogActive = (state, { dialog_active }) => ({
  ...state,
  dialog_active: dialog_active || !state.dialog_active,
});

const setReady = (state, { ready = true }) => ({
  ...state,
  ready,
});

const searchSetTitle = (state, { title = '' }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      title,
    }
  }
});

const searchSetDistance = (state, { distance = [0, 9999] }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      distance,
    }
  }
});

const searchSetTab = (state, { tab = TABS[Object.keys(TABS)[0]] }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      tab: Object.keys(TABS).indexOf(tab) >= 0 ? tab : TABS[Object.keys(TABS)[0]],
    }
  }
});

const searchPutRoutes = (state, { list = [], min, max }) => ({
  ...state,
  routes: {
    ...state.routes,
    list,
    filter: {
      ...state.routes.filter,
      distance: (state.routes.filter.min === state.routes.filter.max)
        ? [min, max]
        : state.routes.filter.distance,
      min,
      max,
    }
  }
});

const searchSetLoading = (state, { loading = false }) => ({
  ...state,
  routes: {
    ...state.routes,
    loading,
  }
});

const HANDLERS = ({
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

  [ACTIONS.SET_PROVIDER]: setProvider,

  [ACTIONS.SET_DIALOG]: setDialog,
  [ACTIONS.SET_DIALOG_ACTIVE]: setDialogActive,
  [ACTIONS.SET_READY]: setReady,

  [ACTIONS.SEARCH_SET_TITLE]: searchSetTitle,
  [ACTIONS.SEARCH_SET_DISTANCE]: searchSetDistance,
  [ACTIONS.SEARCH_SET_TAB]: searchSetTab,
  [ACTIONS.SEARCH_PUT_ROUTES]: searchPutRoutes,
  [ACTIONS.SEARCH_SET_LOADING]: searchSetLoading,
}: { [key: String]: Function });

export const INITIAL_STATE = {
  ready: false,
  user: { ...DEFAULT_USER },
  editing: false,
  mode: MODES.NONE,
  logo: DEFAULT_LOGO,
  routerPoints: 0,
  distance: 0,
  estimated: 0,
  activeSticker: { set: null, sticker: null },
  title: '',
  address: '',
  changed: false,
  provider: DEFAULT_PROVIDER,

  save_error: '',
  save_finished: false,
  save_overwriting: false,
  save_processing: false,

  dialog: DIALOGS.NONE,
  dialog_active: false,

  renderer: {
    data: '',
    width: 0,
    height: 0,
    renderer_active: false,
    info: '',
    progress: 0,
  },

  routes: {
    limit: 0,
    loading: false, // <-- maybe delete this
    list: [],
    filter: {
      title: '',
      starred: false,
      distance: [0, 10000],
      author: '',
      tab: '',
      min: 0,
      max: 10000,
    }
  },
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
