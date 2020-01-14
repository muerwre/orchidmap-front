import { USER_ACTIONS } from '~/redux/user/constants';
import { IUser } from "~/constants/auth";

export const setUser = (user: IUser) => ({ type: USER_ACTIONS.SET_USER, user });
export const userLogout = () => ({ type: USER_ACTIONS.USER_LOGOUT });
export const userLogin = () => ({ type: USER_ACTIONS.USER_LOGIN });

export const setStarred = is_published => ({ type: USER_ACTIONS.SET_STARRED, is_published });
export const openMapDialog = tab => ({ type: USER_ACTIONS.OPEN_MAP_DIALOG, tab });
export const gotVkUser = user => ({ type: USER_ACTIONS.GOT_VK_USER, user });
export const searchSetTitle = title => ({ type: USER_ACTIONS.SEARCH_SET_TITLE, title });
export const searchSetDistance = distance => ({ type: USER_ACTIONS.SEARCH_SET_DISTANCE, distance });
export const searchChangeDistance = distance => ({ type: USER_ACTIONS.SEARCH_CHANGE_DISTANCE, distance });
export const searchSetTab = tab => ({ type: USER_ACTIONS.SEARCH_SET_TAB, tab });
export const searchSetLoading = loading => ({ type: USER_ACTIONS.SEARCH_SET_LOADING, loading });

export const searchPutRoutes = payload => ({ type: USER_ACTIONS.SEARCH_PUT_ROUTES, ...payload });
export const mapsLoadMore = () => ({ type: USER_ACTIONS.MAPS_LOAD_MORE });
export const mapsSetShift = (shift: number) => ({ type: USER_ACTIONS.MAPS_SET_SHIFT, shift });

export const dropRoute = (address: string) => ({ type: USER_ACTIONS.DROP_ROUTE, address });
export const modifyRoute = (address: string, { title, is_public }: { title: string, is_public: boolean }) => ({
  type: USER_ACTIONS.MODIFY_ROUTE,  address,  title,  is_public
});
export const toggleRouteStarred = (address: string) => ({ type: USER_ACTIONS.TOGGLE_ROUTE_STARRED, address });
export const setRouteStarred = (address: string, is_published: boolean) => ({ type: USER_ACTIONS.SET_ROUTE_STARRED, address, is_published });
