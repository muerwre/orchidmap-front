import { ACTIONS } from '$redux/user/constants';
import { IUser } from "$constants/auth";
import { IRootState } from "$redux/user";

export const setUser = (user: IUser) => ({ type: ACTIONS.SET_USER, user });
export const userLogout = () => ({ type: ACTIONS.USER_LOGOUT });

export const setEditing = (editing: IRootState['editing']) => ({ type: ACTIONS.SET_EDITING, editing });
export const setMode = (mode: IRootState['mode']) => ({ type: ACTIONS.SET_MODE, mode });
export const setDistance = (distance: IRootState['distance']) => ({ type: ACTIONS.SET_DISTANCE, distance });
export const setChanged = (changed: IRootState['changed']) => ({ type: ACTIONS.SET_CHANGED, changed });
export const setRouterPoints = routerPoints => ({ type: ACTIONS.SET_ROUTER_POINTS, routerPoints });
export const setActiveSticker = activeSticker => ({ type: ACTIONS.SET_ACTIVE_STICKER, activeSticker });
export const setLogo = logo => ({ type: ACTIONS.SET_LOGO, logo });
export const setTitle = title => ({ type: ACTIONS.SET_TITLE, title });
export const setDescription = description => ({ type: ACTIONS.SET_DESCRIPTION, description });
export const setAddress = address => ({ type: ACTIONS.SET_ADDRESS, address });
export const setAddressOrigin = address_origin => ({ type: ACTIONS.SET_ADDRESS_ORIGIN, address_origin });
export const setPublic = is_public => ({ type: ACTIONS.SET_PUBLIC, is_public });
export const setStarred = is_published => ({ type: ACTIONS.SET_STARRED, is_published });
export const setSpeed = speed => ({ type: ACTIONS.SET_SPEED, speed });

export const startEditing = () => ({ type: ACTIONS.START_EDITING });
export const stopEditing = () => ({ type: ACTIONS.STOP_EDITING });

export const routerCancel = () => ({ type: ACTIONS.ROUTER_CANCEL });
export const routerSubmit = () => ({ type: ACTIONS.ROUTER_SUBMIT });

export const clearPoly = () => ({ type: ACTIONS.CLEAR_POLY });
export const clearStickers = () => ({ type: ACTIONS.CLEAR_STICKERS });
export const clearAll = () => ({ type: ACTIONS.CLEAR_ALL });
export const clearCancel = () => ({ type: ACTIONS.CLEAR_CANCEL });

export const sendSaveRequest = (payload: {
  title: IRootState['title'],
  address: IRootState['address'],
  is_public: IRootState['is_public'],
  description: IRootState['description'],
  force: boolean,
}) => ({
  type: ACTIONS.SEND_SAVE_REQUEST,
  ...payload,
});

export const resetSaveDialog = () => ({ type: ACTIONS.RESET_SAVE_DIALOG });

export const setSaveLoading = (save_loading: IRootState['save_loading']) => ({ type: ACTIONS.SET_SAVE_LOADING, save_loading });

export const setSaveSuccess = (payload: {
  address: IRootState['address'],
  title: IRootState['address'],
  is_public: IRootState['is_public'],
  description: IRootState['description'],

  save_error: string,
}) => ({ type: ACTIONS.SET_SAVE_SUCCESS, ...payload });

export const setSaveError = (save_error: IRootState['save_error']) => ({ type: ACTIONS.SET_SAVE_ERROR, save_error });
export const setSaveOverwrite = () => ({ type: ACTIONS.SET_SAVE_OVERWRITE });

export const hideRenderer = () => ({ type: ACTIONS.HIDE_RENDERER });
export const setRenderer = payload => ({ type: ACTIONS.SET_RENDERER, payload });
export const takeAShot = () => ({ type: ACTIONS.TAKE_A_SHOT });
export const cropAShot = payload => ({ type: ACTIONS.CROP_A_SHOT, ...payload });

export const setProvider = provider => ({ type: ACTIONS.SET_PROVIDER, provider });
export const changeProvider = provider => ({ type: ACTIONS.CHANGE_PROVIDER, provider });

export const setDialog = dialog => ({ type: ACTIONS.SET_DIALOG, dialog });
export const setDialogActive = dialog_active => ({ type: ACTIONS.SET_DIALOG_ACTIVE, dialog_active });
export const openMapDialog = tab => ({ type: ACTIONS.OPEN_MAP_DIALOG, tab });

export const locationChanged = location => ({ type: ACTIONS.LOCATION_CHANGED, location });
export const setReady = ready => ({ type: ACTIONS.SET_READY, ready });

export const gotVkUser = user => ({ type: ACTIONS.GOT_VK_USER, user });
export const keyPressed = ({ key, target: { tagName } }) => ({ type: ACTIONS.KEY_PRESSED, key, target: tagName });

export const searchSetTitle = title => ({ type: ACTIONS.SEARCH_SET_TITLE, title });
export const searchSetDistance = distance => ({ type: ACTIONS.SEARCH_SET_DISTANCE, distance });
export const searchChangeDistance = distance => ({ type: ACTIONS.SEARCH_CHANGE_DISTANCE, distance });
export const searchSetTab = tab => ({ type: ACTIONS.SEARCH_SET_TAB, tab });
export const searchSetLoading = loading => ({ type: ACTIONS.SEARCH_SET_LOADING, loading });

export const searchPutRoutes = payload => ({ type: ACTIONS.SEARCH_PUT_ROUTES, ...payload });

export const setMarkersShown = markers_shown => ({ type: ACTIONS.SET_MARKERS_SHOWN, markers_shown });
export const getGPXTrack = () => ({ type: ACTIONS.GET_GPX_TRACK });
export const setIsEmpty = is_empty => ({ type: ACTIONS.SET_IS_EMPTY, is_empty });

export const mapsLoadMore = () => ({ type: ACTIONS.MAPS_LOAD_MORE });
export const mapsSetShift = (shift: number) => ({ type: ACTIONS.MAPS_SET_SHIFT, shift });

export const setFeature = (features: { [x: string]: boolean }) => ({ type: ACTIONS.SET_FEATURE, features });
export const setIsRouting = (is_routing: boolean) => ({ type: ACTIONS.SET_IS_ROUTING, is_routing });

export const dropRoute = (address: string) => ({ type: ACTIONS.DROP_ROUTE, address });
export const modifyRoute = (address: string, { title, is_public }: { title: string, is_public: boolean }) => ({
  type: ACTIONS.MODIFY_ROUTE,  address,  title,  is_public
});
export const toggleRouteStarred = (address: string) => ({ type: ACTIONS.TOGGLE_ROUTE_STARRED, address });
export const setRouteStarred = (address: string, is_published: boolean) => ({ type: ACTIONS.SET_ROUTE_STARRED, address, is_published });
