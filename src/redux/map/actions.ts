import { MAP_ACTIONS } from './constants';
import { IMapReducer } from './';
import { IStickerDump } from '~/redux/map/types';
import { ILatLng } from './types';

export const mapSet = (map: Partial<IMapReducer>) => ({
  type: MAP_ACTIONS.SET_MAP,
  map,
});

export const mapSetProvider = (provider: IMapReducer['provider']) => ({
  type: MAP_ACTIONS.SET_PROVIDER,
  provider,
});

export const mapSetRoute = (route: IMapReducer['route']) => ({
  type: MAP_ACTIONS.SET_ROUTE,
  route,
});

export const mapSetSticker = (index: number, sticker: IStickerDump) => ({
  type: MAP_ACTIONS.SET_STICKER,
  index,
  sticker,
});

export const mapAddSticker = (sticker: IStickerDump) => ({
  type: MAP_ACTIONS.ADD_STICKER,
  sticker,
});

export const mapDropSticker = (index: number) => ({
  type: MAP_ACTIONS.DROP_STICKER,
  index,
});

export const mapClicked = (latlng: ILatLng) => ({
  type: MAP_ACTIONS.MAP_CLICKED,
  latlng,
});

export const mapSetTitle = (title: string) => ({
  type: MAP_ACTIONS.SET_TITLE,
  title,
});

export const mapSetDescription = (description: string) => ({
  type: MAP_ACTIONS.SET_DESCRIPTION,
  description,
});

export const mapSetAddress = (address: string) => ({
  type: MAP_ACTIONS.SET_ADDRESS,
  address,
});

export const mapSetOwner = (owner: IMapReducer['owner']) => ({
  type: MAP_ACTIONS.SET_DESCRIPTION,
  owner,
});

export const mapSetPublic = (is_public: IMapReducer['is_public']) => ({
  type: MAP_ACTIONS.SET_PUBLIC,
  is_public,
});

export const mapSetLogo = (logo: IMapReducer['logo']) => ({
  type: MAP_ACTIONS.SET_LOGO,
  logo,
});
