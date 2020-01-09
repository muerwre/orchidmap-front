import { IRootState } from ".";
import * as ActionCreators from './actions'
import { TABS } from "~/constants/dialogs";
import { USER_ACTIONS } from "./constants";

type UnsafeReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

export interface ActionHandler<T> {
  (state: IRootState, payload: UnsafeReturnType<T>): IRootState;
}

const setUser: ActionHandler<typeof ActionCreators.setUser> = (state, { user }) => ({
  ...state,
  user: {
    ...state.user,
    ...user,
  },
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

const setStarred: ActionHandler<typeof ActionCreators.setStarred> = (state, { is_published = false }) => ({ ...state, is_published });

const mapsSetShift: ActionHandler<typeof ActionCreators.mapsSetShift> = (state, { shift = 0 }) => ({
  ...state,
  routes: {
    ...state.routes,
    shift,
  }
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

  [USER_ACTIONS.SEARCH_SET_TITLE]: searchSetTitle,
  [USER_ACTIONS.SEARCH_SET_DISTANCE]: searchSetDistance,
  [USER_ACTIONS.SEARCH_CHANGE_DISTANCE]: searchSetDistance,
  [USER_ACTIONS.SEARCH_SET_TAB]: searchSetTab,
  [USER_ACTIONS.SEARCH_PUT_ROUTES]: searchPutRoutes,
  [USER_ACTIONS.SEARCH_SET_LOADING]: searchSetLoading,

  [USER_ACTIONS.MAPS_SET_SHIFT]: mapsSetShift,

  [USER_ACTIONS.SET_STARRED]: setStarred,

  [USER_ACTIONS.SET_ROUTE_STARRED]: setRouteStarred,
});