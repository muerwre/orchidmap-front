import { createReducer } from 'reduxsauce';
import { MAP_HANDLERS } from './handlers';
import { DEFAULT_PROVIDER } from '$constants/providers';
import { IMapRoute } from './types';

export interface IMapReducer {
  provider: string;
  route: IMapRoute;
}

export const MAP_INITIAL_STATE = {
  provider: DEFAULT_PROVIDER,
}

export const map = createReducer(MAP_INITIAL_STATE, MAP_HANDLERS)