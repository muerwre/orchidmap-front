import { IState } from '$redux/store'

export const selectUser = (state: IState) => state.user;
export const selectUserUser = (state: IState) => state.user.user;
export const selectUserEditing = (state: IState) => state.user.editing;
export const selectUserMode = (state: IState) => state.user.mode;
export const selectUserActiveSticker = (state: IState) => state.user.activeSticker;