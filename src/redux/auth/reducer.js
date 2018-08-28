import { createReducer } from 'reduxsauce';
import { AUTH_ACTIONS, EMPTY_USER } from '$redux/auth/constants';

const HANDLERS = {

};

export const INITIAL_STATE = {
  ...EMPTY_USER
};

export const authReducer = createReducer(INITIAL_STATE, HANDLERS);
