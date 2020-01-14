import { MAP_ACTIONS } from './constants';
import { IMapReducer } from '.';
import {
  mapSet,
  mapSetProvider,
  mapSetRoute,
  mapSetSticker,
  mapAddSticker,
  mapSetTitle,
  mapSetAddress,
  mapSetDescription,
  mapSetOwner,
  mapSetPublic,
  mapSetLogo,
  mapSetAddressOrigin,
  mapSetStickers,
} from './actions';

const setMap = (state: IMapReducer, { map }: ReturnType<typeof mapSet>): IMapReducer => ({
  ...state,
  ...map,
});

const setProvider = (
  state: IMapReducer,
  { provider }: ReturnType<typeof mapSetProvider>
): IMapReducer => ({
  ...state,
  provider,
});

const setRoute = (state: IMapReducer, { route }: ReturnType<typeof mapSetRoute>): IMapReducer => ({
  ...state,
  route,
});

const setStickers = (
  state: IMapReducer,
  { stickers }: ReturnType<typeof mapSetStickers>
): IMapReducer => ({
  ...state,
  stickers,
});

const setSticker = (
  state: IMapReducer,
  { sticker, index }: ReturnType<typeof mapSetSticker>
): IMapReducer => ({
  ...state,
  stickers: state.stickers.map((item, i) => (i === index ? sticker : item)),
});

const dropSticker = (
  state: IMapReducer,
  { index }: ReturnType<typeof mapSetSticker>
): IMapReducer => ({
  ...state,
  stickers: state.stickers.filter((_, i) => i !== index),
});

const addSticker = (
  state: IMapReducer,
  { sticker }: ReturnType<typeof mapAddSticker>
): IMapReducer => ({
  ...state,
  stickers: [...state.stickers, sticker],
});

const setTitle = (state: IMapReducer, { title }: ReturnType<typeof mapSetTitle>): IMapReducer => ({
  ...state,
  title,
});

const setAddress = (state: IMapReducer, { address }: ReturnType<typeof mapSetAddress>): IMapReducer => ({
  ...state,
  address,
});

const setDescription = (state: IMapReducer, { description }: ReturnType<typeof mapSetDescription>): IMapReducer => ({
  ...state,
  description,
});

const setOwner = (state: IMapReducer, { owner }: ReturnType<typeof mapSetOwner>): IMapReducer => ({
  ...state,
  owner,
});

const setPublic = (state: IMapReducer, { is_public }: ReturnType<typeof mapSetPublic>): IMapReducer => ({
  ...state,
  is_public,
});

const setLogo = (state: IMapReducer, { logo }: ReturnType<typeof mapSetLogo>): IMapReducer => ({
  ...state,
  logo,
});

const setAddressOrigin = (state, { address_origin }: ReturnType<typeof mapSetAddressOrigin>): IMapReducer => ({
  ...state,
  address_origin
});

export const MAP_HANDLERS = {
  [MAP_ACTIONS.SET_MAP]: setMap,
  [MAP_ACTIONS.SET_PROVIDER]: setProvider,
  [MAP_ACTIONS.SET_ROUTE]: setRoute,
  [MAP_ACTIONS.SET_STICKER]: setSticker,
  [MAP_ACTIONS.SET_STICKERS]: setStickers,
  [MAP_ACTIONS.DROP_STICKER]: dropSticker,
  [MAP_ACTIONS.ADD_STICKER]: addSticker,
  [MAP_ACTIONS.SET_TITLE]: setTitle,
  [MAP_ACTIONS.SET_ADDRESS]: setAddress,
  [MAP_ACTIONS.SET_DESCRIPTION]: setDescription,
  [MAP_ACTIONS.SET_OWNER]: setOwner,
  [MAP_ACTIONS.SET_PUBLIC]: setPublic,
  [MAP_ACTIONS.SET_LOGO]: setLogo,
  [MAP_ACTIONS.SET_ADDRESS_ORIGIN]: setAddressOrigin,
};
