import { createReducer } from 'reduxsauce';
import { ACTIONS, EMPTY_USER } from '$redux/user/constants';
import { DEFAULT_USER } from '$constants/auth';

const setUser = (state, { user }) => ({
  ...state,
  ...user,
});

const setEditing = (state, { editing }) => ({
  ...state,
  editing,
});


const HANDLERS = {
  [ACTIONS.SET_USER]: setUser,
  [ACTIONS.SET_EDITING]: setEditing,
};

export const INITIAL_STATE = {
  ...DEFAULT_USER
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
