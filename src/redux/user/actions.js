import { ACTIONS } from '$redux/user/constants';

export const setUser = user => ({ type: ACTIONS.SET_USER, user });
export const setEditing = editing => ({ type: ACTIONS.SET_EDITING, editing });
export const setMode = mode => ({ type: ACTIONS.SET_MODE, mode });
export const setDistance = distance => ({ type: ACTIONS.SET_DISTANCE, distance });
export const setChanged = changed => ({ type: ACTIONS.SET_CHANGED, changed });
