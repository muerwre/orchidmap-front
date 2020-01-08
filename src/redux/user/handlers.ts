import { IRootState } from ".";
import * as ActionCreators from './actions'
import { TIPS } from "~/constants/tips";
import { TABS } from "~/constants/dialogs";
import { USER_ACTIONS } from "./constants";

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

// const setLogo: ActionHandler<typeof ActionCreators.setLogo> = (state, { logo }) => ({
//   ...state,
//   logo
// });

// const setTitle: ActionHandler<typeof ActionCreators.setTitle> = (state, { title }) => ({
//   ...state,
//   title
// });

// const setDescription: ActionHandler<typeof ActionCreators.setDescription> = (state, { description }) => ({
//   ...state,
//   description
// });

// const setAddress: ActionHandler<typeof ActionCreators.setAddress> = (state, { address }) => ({
//   ...state,
//   address
// });

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
  ...state,
  save_overwriting: false,
  save_finished: true,
  save_processing: false,
  save_error,
});

const resetSaveDialog: ActionHandler<typeof ActionCreators.resetSaveDialog> = (state) => ({
  ...state, save_overwriting: false, save_finished: false, save_processing: false, save_error: '',
});

const hideRenderer: ActionHandler<typeof ActionCreators.hideRenderer> = (state) => ({
  ...state,
  renderer: { ...state.renderer, renderer_active: false }
});

const setRenderer: ActionHandler<typeof ActionCreators.setRenderer> = (state, { payload }) => ({
  ...state,
  renderer: { ...state.renderer, ...payload }
});

// const setProvider: ActionHandler<typeof ActionCreators.setProvider> = (state, { provider }) => ({ ...state, provider });

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
      tab: Object.values(TABS).indexOf(tab) >= 0 ? tab : TABS[Object.values(TABS)[0]],
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

// const setPublic: ActionHandler<typeof ActionCreators.setPublic> = (state, { is_public = false }) => ({ ...state, is_public });
const setStarred: ActionHandler<typeof ActionCreators.setStarred> = (state, { is_published = false }) => ({ ...state, is_published });

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

const setFeature: ActionHandler<typeof ActionCreators.setFeature> = (state, { features }) => ({
  ...state,
  features: {
    ...state.features,
    ...features,
  }
});

const setIsRouting: ActionHandler<typeof ActionCreators.setIsRouting> = (state, { is_routing }) => ({
  ...state,
  is_routing,
});

const setRouteStarred: ActionHandler<typeof ActionCreators.setRouteStarred> = (state, { address, is_published }) => ({
  ...state,
  routes: {
    ...state.routes,
    list: (
      state.routes.list
        .map(el => el.address === address ? { ...el, is_published } : el)
        .filter(el => (
          (state.routes.filter.tab === TABS.STARRED && el.is_published) ||
          (state.routes.filter.tab === TABS.PENDING && !el.is_published)
        ))
    )
  }
});

export const USER_HANDLERS = ({
  [USER_ACTIONS.SET_USER]: setUser,
  [USER_ACTIONS.SET_EDITING]: setEditing,
  [USER_ACTIONS.SET_CHANGED]: setChanged,
  [USER_ACTIONS.SET_MODE]: setMode,
  [USER_ACTIONS.SET_DISTANCE]: setDistance,
  [USER_ACTIONS.SET_ROUTER_POINTS]: setRouterPoints,
  [USER_ACTIONS.SET_ACTIVE_STICKER]: setActiveSticker,
  // [USER_ACTIONS.SET_LOGO]: setLogo,
  // [USER_ACTIONS.SET_TITLE]: setTitle,
  // [USER_ACTIONS.SET_DESCRIPTION]: setDescription,
  // [USER_ACTIONS.SET_ADDRESS]: setAddress,
  [USER_ACTIONS.SET_ADDRESS_ORIGIN]: setAddressOrigin,

  [USER_ACTIONS.SET_SAVE_ERROR]: setSaveError,
  [USER_ACTIONS.SET_SAVE_LOADING]: setSaveLoading,
  [USER_ACTIONS.SET_SAVE_OVERWRITE]: setSaveOverwrite,
  [USER_ACTIONS.SET_SAVE_SUCCESS]: setSaveSuccess,
  [USER_ACTIONS.SEND_SAVE_REQUEST]: sendSaveRequest,
  [USER_ACTIONS.RESET_SAVE_DIALOG]: resetSaveDialog,

  [USER_ACTIONS.HIDE_RENDERER]: hideRenderer,
  [USER_ACTIONS.SET_RENDERER]: setRenderer,

  // [USER_ACTIONS.SET_PROVIDER]: setProvider,

  [USER_ACTIONS.SET_DIALOG]: setDialog,
  [USER_ACTIONS.SET_DIALOG_ACTIVE]: setDialogActive,
  [USER_ACTIONS.SET_READY]: setReady,

  [USER_ACTIONS.SEARCH_SET_TITLE]: searchSetTitle,
  [USER_ACTIONS.SEARCH_SET_DISTANCE]: searchSetDistance,
  [USER_ACTIONS.SEARCH_CHANGE_DISTANCE]: searchSetDistance,
  [USER_ACTIONS.SEARCH_SET_TAB]: searchSetTab,
  [USER_ACTIONS.SEARCH_PUT_ROUTES]: searchPutRoutes,
  [USER_ACTIONS.SEARCH_SET_LOADING]: searchSetLoading,
  // [USER_ACTIONS.SET_PUBLIC]: setPublic,
  [USER_ACTIONS.SET_STARRED]: setStarred,
  [USER_ACTIONS.SET_SPEED]: setSpeed,

  [USER_ACTIONS.SET_MARKERS_SHOWN]: setMarkersShown,
  [USER_ACTIONS.SET_IS_EMPTY]: setIsEmpty,
  [USER_ACTIONS.MAPS_SET_SHIFT]: mapsSetShift,

  [USER_ACTIONS.SET_FEATURE]: setFeature,
  [USER_ACTIONS.SET_IS_ROUTING]: setIsRouting,

  [USER_ACTIONS.SET_ROUTE_STARRED]: setRouteStarred,
});