import { createReducer } from 'reduxsauce';
import { MAP_HANDLERS } from './handlers';
import { DEFAULT_PROVIDER } from '$constants/providers';
import { IMapRoute } from './types';
import { IStickerDump } from '$modules/Sticker';

export interface IMapReducer {
  provider: string;
  route: IMapRoute;
  stickers: IStickerDump[]
}

export const MAP_INITIAL_STATE = {
  provider: DEFAULT_PROVIDER,
  route: [],
  stickers: [],
}

export const map = createReducer(MAP_INITIAL_STATE, MAP_HANDLERS)