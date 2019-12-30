import { MAP_ACTIONS } from "./constants";
import { IMapReducer } from ".";
import { mapSet, mapSetProvider, mapSetRoute, mapSetSticker } from "./actions";

const setMap = (
  state: IMapReducer,
  { map }: ReturnType<typeof mapSet>
): IMapReducer => ({
  ...state,
  ...map
});

const setProvider = (
  state: IMapReducer,
  { provider }: ReturnType<typeof mapSetProvider>
): IMapReducer => ({
  ...state,
  provider
});

const setRoute = (
  state: IMapReducer,
  { route }: ReturnType<typeof mapSetRoute>
): IMapReducer => ({
  ...state,
  route
});

const setSticker = (
  state: IMapReducer,
  { sticker, index }: ReturnType<typeof mapSetSticker>
): IMapReducer => ({
  ...state,
  stickers: state.stickers.map((item, i) => (i === index ? sticker : item))
});

const dropSticker = (
  state: IMapReducer,
  { index }: ReturnType<typeof mapSetSticker>
): IMapReducer => ({
  ...state,
  stickers: state.stickers.filter((_, i) => i !== index)
});

export const MAP_HANDLERS = {
  [MAP_ACTIONS.SET_MAP]: setMap,
  [MAP_ACTIONS.SET_PROVIDER]: setProvider,
  [MAP_ACTIONS.SET_ROUTE]: setRoute,
  [MAP_ACTIONS.SET_STICKER]: setSticker,
  [MAP_ACTIONS.DROP_STICKER]: dropSticker,
};
