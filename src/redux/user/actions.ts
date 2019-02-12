import { ACTIONS } from '$redux/user/constants';
import { IUser } from "$constants/auth";

export const setUser = (user: IUser) => ({ type: ACTIONS.SET_USER, user });
export const userLogout = () => ({ type: ACTIONS.USER_LOGOUT });

export const setEditing = editing => ({ type: ACTIONS.SET_EDITING, editing });
export const setMode = mode => ({ type: ACTIONS.SET_MODE, mode });
export const setDistance = distance => ({ type: ACTIONS.SET_DISTANCE, distance });
export const setChanged = changed => ({ type: ACTIONS.SET_CHANGED, changed });
export const setRouterPoints = routerPoints => ({ type: ACTIONS.SET_ROUTER_POINTS, routerPoints });
export const setActiveSticker = activeSticker => ({ type: ACTIONS.SET_ACTIVE_STICKER, activeSticker });
export const setLogo = logo => ({ type: ACTIONS.SET_LOGO, logo });
export const setTitle = title => ({ type: ACTIONS.SET_TITLE, title });
export const setAddress = address => ({ type: ACTIONS.SET_ADDRESS, address });
export const setAddressOrigin = address_origin => ({ type: ACTIONS.SET_ADDRESS_ORIGIN, address_origin });
export const setPublic = is_public => ({ type: ACTIONS.SET_PUBLIC, is_public });
export const setSpeed = speed => ({ type: ACTIONS.SET_SPEED, speed });

export const startEditing = () => ({ type: ACTIONS.START_EDITING });
export const stopEditing = () => ({ type: ACTIONS.STOP_EDITING });

export const routerCancel = () => ({ type: ACTIONS.ROUTER_CANCEL });
export const routerSubmit = () => ({ type: ACTIONS.ROUTER_SUBMIT });

export const clearPoly = () => ({ type: ACTIONS.CLEAR_POLY });
export const clearStickers = () => ({ type: ACTIONS.CLEAR_STICKERS });
export const clearAll = () => ({ type: ACTIONS.CLEAR_ALL });
export const clearCancel = () => ({ type: ACTIONS.CLEAR_CANCEL });

export const sendSaveRequest = payload => ({ type: ACTIONS.SEND_SAVE_REQUEST, ...payload });
export const resetSaveDialog = () => ({ type: ACTIONS.RESET_SAVE_DIALOG });

export const setSaveSuccess = payload => ({ type: ACTIONS.SET_SAVE_SUCCESS, ...payload });
export const setSaveError = save_error => ({ type: ACTIONS.SET_SAVE_ERROR, save_error });
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
export const searchSetTab = tab => ({ type: ACTIONS.SEARCH_SET_TAB, tab });
export const searchSetLoading = loading => ({ type: ACTIONS.SEARCH_SET_LOADING, loading });

export const searchPutRoutes = payload => ({ type: ACTIONS.SEARCH_PUT_ROUTES, ...payload });

export const setMarkersShown = markers_shown => ({ type: ACTIONS.SET_MARKERS_SHOWN, markers_shown });