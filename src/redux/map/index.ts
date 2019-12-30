import { createReducer } from 'reduxsauce';
import { MAP_HANDLERS } from './handlers';
import { DEFAULT_PROVIDER } from '$constants/providers';
import { IMapRoute } from './types';
import { IStickerDump } from '$modules/Sticker';
import { DEFAULT_LOGO } from '$constants/logos';

export interface IMapReducer {
  provider: string;
  route: IMapRoute;
  stickers: IStickerDump[];
  title: string;
  logo: string;
  address: string;
  description: string;
  owner: { id: string };
  is_public: boolean;
}

export const MAP_INITIAL_STATE: IMapReducer = {
  provider: DEFAULT_PROVIDER,
  logo: DEFAULT_LOGO,
  route: [],
  stickers: [],
  title: '',
  address: '',
  description: '',
  owner: { id: null },
  is_public: false,
}

export const map = createReducer(MAP_INITIAL_STATE, MAP_HANDLERS)