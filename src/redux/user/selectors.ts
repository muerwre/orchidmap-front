import { IState } from '$redux/store'

export const selectUserEditing = (state: IState) => state.user.editing;