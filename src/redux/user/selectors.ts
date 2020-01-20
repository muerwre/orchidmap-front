import { IState } from '~/redux/store'

export const selectUser = (state: IState) => state.user;
export const selectUserUser = (state: IState) => state.user.user;
export const selectUserLocation = (state: IState) => state.user.location;