import { ACTIONS } from '$redux/user/constants';

export const setUser = user => ({ type: ACTIONS.SET_USER, user });
export const userLogout = user => ({ type: ACTIONS.USER_LOGOUT });


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
