import { createReducer } from 'reduxsauce';
import { MAP_HANDLERS } from './handlers';

export interface IMapReducer {

}

export const MAP_INITIAL_STATE = {

}
export const map = createReducer(MAP_INITIAL_STATE, MAP_HANDLERS)