import { ACTIONS } from '$redux/user/constants';

export const setUser = user => ({ type: ACTIONS.SET_USER, user });
export const setEditing = editing => ({ type: ACTIONS.SET_EDITING, editing });
