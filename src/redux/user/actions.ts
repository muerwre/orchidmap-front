import { USER_ACTIONS } from '~/redux/user/constants';
import { IUser } from "~/constants/auth";
import { IRootState } from "~/redux/user";
import { IRoute } from '~/redux/map/types';

export const setUser = (user: IUser) => ({ type: USER_ACTIONS.SET_USER, user });
export const userLogout = () => ({ type: USER_ACTIONS.USER_LOGOUT });

export const setEditing = (editing: IRootState['editing']) => ({ type: USER_ACTIONS.SET_EDITING, editing });
export const setMode = (mode: IRootState['mode']) => ({ type: USER_ACTIONS.SET_MODE, mode });
export const setDistance = (distance: IRootState['distance']) => ({ type: USER_ACTIONS.SET_DISTANCE, distance });
export const setChanged = (changed: IRootState['changed']) => ({ type: USER_ACTIONS.SET_CHANGED, changed });
export const setRouterPoints = routerPoints => ({ type: USER_ACTIONS.SET_ROUTER_POINTS, routerPoints });
export const setActiveSticker = activeSticker => ({ type: USER_ACTIONS.SET_ACTIVE_STICKER, activeSticker });
// export const setLogo = logo => ({ type: USER_ACTIONS.SET_LOGO, logo });
// export const setTitle = title => ({ type: USER_ACTIONS.SET_TITLE, title });
// export const setDescription = description => ({ type: USER_ACTIONS.SET_DESCRIPTION, description });
// export const setAddress = address => ({ type: USER_ACTIONS.SET_ADDRESS, address });
export const setAddressOrigin = address_origin => ({ type: USER_ACTIONS.SET_ADDRESS_ORIGIN, address_origin });
// export const setPublic = is_public => ({ type: USER_ACTIONS.SET_PUBLIC, is_public });
export const setStarred = is_published => ({ type: USER_ACTIONS.SET_STARRED, is_published });
export const setSpeed = speed => ({ type: USER_ACTIONS.SET_SPEED, speed });

export const startEditing = () => ({ type: USER_ACTIONS.START_EDITING });
export const stopEditing = () => ({ type: USER_ACTIONS.STOP_EDITING });

export const routerCancel = () => ({ type: USER_ACTIONS.ROUTER_CANCEL });
export const routerSubmit = () => ({ type: USER_ACTIONS.ROUTER_SUBMIT });

export const clearPoly = () => ({ type: USER_ACTIONS.CLEAR_POLY });
export const clearStickers = () => ({ type: USER_ACTIONS.CLEAR_STICKERS });
export const clearAll = () => ({ type: USER_ACTIONS.CLEAR_ALL });
export const clearCancel = () => ({ type: USER_ACTIONS.CLEAR_CANCEL });

export const sendSaveRequest = (payload: {
  title: IRoute['title'],
  address: IRoute['address'],
  is_public: IRoute['is_public'],
  description: IRoute['description'],
  force: boolean,
}) => ({
  type: USER_ACTIONS.SEND_SAVE_REQUEST,
  ...payload,
});

export const resetSaveDialog = () => ({ type: USER_ACTIONS.RESET_SAVE_DIALOG });

export const setSaveLoading = (save_loading: IRootState['save_loading']) => ({ type: USER_ACTIONS.SET_SAVE_LOADING, save_loading });

export const setSaveSuccess = (payload: {
  address: IRoute['address'],
  title: IRoute['address'],
  is_public: IRoute['is_public'],
  description: IRoute['description'],

  save_error: string,
}) => ({ type: USER_ACTIONS.SET_SAVE_SUCCESS, ...payload });

export const setSaveError = (save_error: IRootState['save_error']) => ({ type: USER_ACTIONS.SET_SAVE_ERROR, save_error });
export const setSaveOverwrite = () => ({ type: USER_ACTIONS.SET_SAVE_OVERWRITE });

export const hideRenderer = () => ({ type: USER_ACTIONS.HIDE_RENDERER });
export const setRenderer = payload => ({ type: USER_ACTIONS.SET_RENDERER, payload });
export const takeAShot = () => ({ type: USER_ACTIONS.TAKE_A_SHOT });
export const cropAShot = payload => ({ type: USER_ACTIONS.CROP_A_SHOT, ...payload });

// export const setProvider = provider => ({ type: USER_ACTIONS.SET_PROVIDER, provider });
// export const changeProvider = provider => ({ type: USER_ACTIONS.CHANGE_PROVIDER, provider });

export const setDialog = dialog => ({ type: USER_ACTIONS.SET_DIALOG, dialog });
export const setDialogActive = dialog_active => ({ type: USER_ACTIONS.SET_DIALOG_ACTIVE, dialog_active });
export const openMapDialog = tab => ({ type: USER_ACTIONS.OPEN_MAP_DIALOG, tab });

export const locationChanged = location => ({ type: USER_ACTIONS.LOCATION_CHANGED, location });
export const setReady = ready => ({ type: USER_ACTIONS.SET_READY, ready });

export const gotVkUser = user => ({ type: USER_ACTIONS.GOT_VK_USER, user });
export const keyPressed = ({ key, target: { tagName } }) => ({ type: USER_ACTIONS.KEY_PRESSED, key, target: tagName });

export const searchSetTitle = title => ({ type: USER_ACTIONS.SEARCH_SET_TITLE, title });
export const searchSetDistance = distance => ({ type: USER_ACTIONS.SEARCH_SET_DISTANCE, distance });
export const searchChangeDistance = distance => ({ type: USER_ACTIONS.SEARCH_CHANGE_DISTANCE, distance });
export const searchSetTab = tab => ({ type: USER_ACTIONS.SEARCH_SET_TAB, tab });
export const searchSetLoading = loading => ({ type: USER_ACTIONS.SEARCH_SET_LOADING, loading });

export const searchPutRoutes = payload => ({ type: USER_ACTIONS.SEARCH_PUT_ROUTES, ...payload });

export const setMarkersShown = markers_shown => ({ type: USER_ACTIONS.SET_MARKERS_SHOWN, markers_shown });
export const getGPXTrack = () => ({ type: USER_ACTIONS.GET_GPX_TRACK });
export const setIsEmpty = is_empty => ({ type: USER_ACTIONS.SET_IS_EMPTY, is_empty });

export const mapsLoadMore = () => ({ type: USER_ACTIONS.MAPS_LOAD_MORE });
export const mapsSetShift = (shift: number) => ({ type: USER_ACTIONS.MAPS_SET_SHIFT, shift });

export const setFeature = (features: { [x: string]: boolean }) => ({ type: USER_ACTIONS.SET_FEATURE, features });
export const setIsRouting = (is_routing: boolean) => ({ type: USER_ACTIONS.SET_IS_ROUTING, is_routing });

export const dropRoute = (address: string) => ({ type: USER_ACTIONS.DROP_ROUTE, address });
export const modifyRoute = (address: string, { title, is_public }: { title: string, is_public: boolean }) => ({
  type: USER_ACTIONS.MODIFY_ROUTE,  address,  title,  is_public
});
export const toggleRouteStarred = (address: string) => ({ type: USER_ACTIONS.TOGGLE_ROUTE_STARRED, address });
export const setRouteStarred = (address: string, is_published: boolean) => ({ type: USER_ACTIONS.SET_ROUTE_STARRED, address, is_published });
