import { ACTIONS } from '$redux/user/constants';

export const setUser = user => ({ type: ACTIONS.SET_USER, user });
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

export const showRenderer = () => ({ type: ACTIONS.SHOW_RENDERER });
export const hideRenderer = () => ({ type: ACTIONS.HIDE_RENDERER });
export const setRenderer = payload => ({ type: ACTIONS.SET_RENDERER, payload });
export const takeAShot = () => ({ type: ACTIONS.TAKE_A_SHOT });
export const cropAShot = payload => ({ type: ACTIONS.CROP_A_SHOT, ...payload });

export const setProvider = provider => ({ type: ACTIONS.SET_PROVIDER, provider });

export const setDialog = dialog => ({ type: ACTIONS.SET_DIALOG, dialog });
export const setDialogActive = dialog_active => ({ type: ACTIONS.SET_DIALOG_ACTIVE, dialog_active });

export const locationChanged = location => ({ type: ACTIONS.LOCATION_CHANGED, location });
export const setReady = ready => ({ type: ACTIONS.SET_READY, ready });

export const gotVkUser = user => ({ type: ACTIONS.GOT_VK_USER, user });
export const keyPressed = ({ key }) => ({ type: ACTIONS.KEY_PRESSED, key });
