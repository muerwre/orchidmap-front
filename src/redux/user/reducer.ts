import { createReducer } from 'reduxsauce';
import { ACTIONS } from '$redux/user/constants';
import { DEFAULT_USER, IUser } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO, LOGOS } from '$constants/logos';
import { TIPS } from '$constants/tips';
import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';
import { DIALOGS, IDialogs, TABS } from '$constants/dialogs';
import * as ActionCreators from '$redux/user/actions';
import { IStickers } from "$constants/stickers";

export interface IRouteListItem {
  _id: string,
  title: string,
  distance: number,
  is_public: boolean,
  updated_at: string,
}

export interface IRootReducer {
  ready: boolean,
  user: IUser,
  editing: boolean,
  mode: keyof typeof MODES,
  logo: keyof typeof LOGOS,
  routerPoints: number,
  distance: number,
  estimated: number,
  speed: number,
  activeSticker: { set?: keyof IStickers, sticker?: string },
  title: string,
  address: string,
  address_origin: string,
  changed: boolean,
  provider: keyof typeof PROVIDERS,
  is_public: boolean,
  markers_shown: boolean,
  is_empty: boolean,

  save_error: string,
  save_finished: boolean,
  save_overwriting: boolean,
  save_processing: boolean,
  save_loading: boolean,

  dialog: IDialogs[keyof IDialogs],
  dialog_active: boolean,

  renderer: {
    data: string,
    width: number,
    height: number
    renderer_active: boolean,
    info: string,
    progress: number,
  },

  routes: {
    limit: 0,
    loading: boolean,
    list: Array<IRouteListItem>,
    step: number,
    shift: number,
    filter: {
      title: string,
      starred: boolean,
      distance: [number, number],
      author: string,
      tab: string,
      min: number,
      max: number,
    }
  },
}

export type IRootState = Readonly<IRootReducer>;
type UnsafeReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

export interface ActionHandler<T> {
  (state: IRootState, payload: UnsafeReturnType<T>): IRootState;
}

const getEstimated = (distance: number, speed: number = 15): number => {
  const time = (distance && (distance / speed)) || 0;
  return (time && parseFloat(time.toFixed(1)));
};

const setUser: ActionHandler<typeof ActionCreators.setUser> = (state, { user }) => ({
  ...state,
  user: {
    ...state.user,
    ...user,
  },
});

const setEditing: ActionHandler<typeof ActionCreators.setEditing> = (state, { editing }) => ({
  ...state, editing
});

const setChanged: ActionHandler<typeof ActionCreators.setChanged> = (state, { changed }) => ({
  ...state,
  changed
});

const setMode: ActionHandler<typeof ActionCreators.setMode> = (state, { mode }) => ({
  ...state,
  mode
});

const setDistance: ActionHandler<typeof ActionCreators.setDistance> = (state, { distance }) => ({
  ...state,
  distance,
  estimated: getEstimated(distance, state.speed),
});

const setRouterPoints: ActionHandler<typeof ActionCreators.setRouterPoints> = (state, { routerPoints }) => ({
  ...state,
  routerPoints,
});

const setActiveSticker: ActionHandler<typeof ActionCreators.setActiveSticker> = (state, { activeSticker }) => ({
  ...state,
  activeSticker: activeSticker || { set: null, sticker: null }
});

const setLogo: ActionHandler<typeof ActionCreators.setLogo> = (state, { logo }) => ({
  ...state,
  logo
});

const setTitle: ActionHandler<typeof ActionCreators.setTitle> = (state, { title }) => ({
  ...state,
  title
});

const setAddress: ActionHandler<typeof ActionCreators.setAddress> = (state, { address }) => ({
  ...state,
  address
});

const setAddressOrigin: ActionHandler<typeof ActionCreators.setAddressOrigin> = (state, { address_origin }) => ({
  ...state,
  address_origin
});

const sendSaveRequest: ActionHandler<typeof ActionCreators.sendSaveRequest> = (state) => ({
  ...state,
  save_processing: true,
});

const setSaveError: ActionHandler<typeof ActionCreators.setSaveError> = (state, { save_error }) => ({
  ...state, save_error, save_finished: false, save_processing: false
});

const setSaveLoading: ActionHandler<typeof ActionCreators.setSaveLoading> = (state, { save_loading }) => ({
  ...state, save_loading
});

const setSaveOverwrite: ActionHandler<typeof ActionCreators.setSaveOverwrite> = (state) => ({
  ...state,
  save_overwriting: true,
  save_finished: false,
  save_processing: false,
  save_error: TIPS.SAVE_OVERWRITE,
});

const setSaveSuccess: ActionHandler<typeof ActionCreators.setSaveSuccess> = (state, { save_error }) => ({
  ...state, save_overwriting: false, save_finished: true, save_processing: false, save_error
});

const resetSaveDialog: ActionHandler<typeof ActionCreators.resetSaveDialog> = (state) => ({
  ...state, save_overwriting: false, save_finished: false, save_processing: false, save_error: '',
});
//
// const showRenderer: ActionHandler<typeof ActionCreators.showRenderer> = (state) => ({
//   ...state,
//   renderer: {
//     ...state.renderer,
//     renderer_active: true
//   }
// });

const hideRenderer: ActionHandler<typeof ActionCreators.hideRenderer> = (state) => ({
  ...state,
  renderer: { ...state.renderer, renderer_active: false }
});

const setRenderer: ActionHandler<typeof ActionCreators.setRenderer> = (state, { payload }) => ({
  ...state,
  renderer: { ...state.renderer, ...payload }
});

const setProvider: ActionHandler<typeof ActionCreators.setProvider> = (state, { provider }) => ({ ...state, provider });

const setDialog: ActionHandler<typeof ActionCreators.setDialog> = (state, { dialog }) => ({
  ...state,
  dialog,
});

const setDialogActive: ActionHandler<typeof ActionCreators.setDialogActive> = (state, { dialog_active }) => ({
  ...state,
  dialog_active: dialog_active || !state.dialog_active,
});

const setReady: ActionHandler<typeof ActionCreators.setReady> = (state, { ready = true }) => ({
  ...state,
  ready,
});

const searchSetTitle: ActionHandler<typeof ActionCreators.searchSetTitle> = (state, { title = '' }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      title,
      distance: [0, 10000],
    }
  }
});

const searchSetDistance: ActionHandler<typeof ActionCreators.searchSetDistance> = (state, { distance = [0, 9999] }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      distance,
    }
  }
});

const searchSetTab: ActionHandler<typeof ActionCreators.searchSetTab> = (state, { tab = TABS[Object.keys(TABS)[0]] }) => ({
  ...state,
  routes: {
    ...state.routes,
    filter: {
      ...state.routes.filter,
      tab: Object.keys(TABS).indexOf(tab) >= 0 ? tab : TABS[Object.keys(TABS)[0]],
    }
  }
});

const searchPutRoutes: ActionHandler<typeof ActionCreators.searchPutRoutes> = (state, { list = [], min, max, limit, step, shift }) => ({
  ...state,
  routes: {
    ...state.routes,
    list,
    limit,
    step,
    shift,
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

const searchSetLoading: ActionHandler<typeof ActionCreators.searchSetLoading> = (state, { loading = false }) => ({
  ...state,
  routes: {
    ...state.routes,
    loading,
  }
});

const setPublic: ActionHandler<typeof ActionCreators.setPublic> = (state, { is_public = false }) => ({ ...state, is_public });
const setSpeed: ActionHandler<typeof ActionCreators.setSpeed> = (state, { speed = 15 }) => ({
  ...state,
  speed,
  estimated: getEstimated(state.distance, speed),
});

const setMarkersShown: ActionHandler<typeof ActionCreators.setMarkersShown> = (state, { markers_shown = true }) => ({ ...state, markers_shown });
const setIsEmpty: ActionHandler<typeof ActionCreators.setIsEmpty> = (state, { is_empty = true }) => ({ ...state, is_empty });
const mapsSetShift: ActionHandler<typeof ActionCreators.mapsSetShift> = (state, { shift = 0 }) => ({
  ...state,
  routes: {
    ...state.routes,
    shift,
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
  [ACTIONS.SET_ADDRESS_ORIGIN]: setAddressOrigin,

  [ACTIONS.SET_SAVE_ERROR]: setSaveError,
  [ACTIONS.SET_SAVE_LOADING]: setSaveLoading,
  [ACTIONS.SET_SAVE_OVERWRITE]: setSaveOverwrite,
  [ACTIONS.SET_SAVE_SUCCESS]: setSaveSuccess,
  [ACTIONS.SEND_SAVE_REQUEST]: sendSaveRequest,
  [ACTIONS.RESET_SAVE_DIALOG]: resetSaveDialog,

  [ACTIONS.HIDE_RENDERER]: hideRenderer,
  [ACTIONS.SET_RENDERER]: setRenderer,

  [ACTIONS.SET_PROVIDER]: setProvider,

  [ACTIONS.SET_DIALOG]: setDialog,
  [ACTIONS.SET_DIALOG_ACTIVE]: setDialogActive,
  [ACTIONS.SET_READY]: setReady,

  [ACTIONS.SEARCH_SET_TITLE]: searchSetTitle,
  [ACTIONS.SEARCH_SET_DISTANCE]: searchSetDistance,
  [ACTIONS.SEARCH_CHANGE_DISTANCE]: searchSetDistance,
  [ACTIONS.SEARCH_SET_TAB]: searchSetTab,
  [ACTIONS.SEARCH_PUT_ROUTES]: searchPutRoutes,
  [ACTIONS.SEARCH_SET_LOADING]: searchSetLoading,
  [ACTIONS.SET_PUBLIC]: setPublic,
  [ACTIONS.SET_SPEED]: setSpeed,

  [ACTIONS.SET_MARKERS_SHOWN]: setMarkersShown,
  [ACTIONS.SET_IS_EMPTY]: setIsEmpty,
  [ACTIONS.MAPS_SET_SHIFT]: mapsSetShift,

});

export const INITIAL_STATE: IRootReducer = {
  ready: false,
  user: { ...DEFAULT_USER },
  editing: false,
  mode: MODES.NONE,
  logo: DEFAULT_LOGO,
  routerPoints: 0,
  distance: 0,
  estimated: 0,
  speed: 15,
  activeSticker: { set: null, sticker: null },
  title: '',
  address: '',
  address_origin: '',
  changed: false,
  provider: DEFAULT_PROVIDER,
  is_public: false,
  markers_shown: true,
  is_empty: true,

  save_error: '',
  save_finished: false,
  save_overwriting: false,
  save_processing: false,
  save_loading: false,

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
    step: 20,
    shift: 0,
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
