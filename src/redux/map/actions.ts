import { MAP_ACTIONS } from "./constants";
import { IMapReducer } from "./";
import { IStickerDump } from "$modules/Sticker";

export const mapSet = (map: Partial<IMapReducer>) => ({
  type: MAP_ACTIONS.SET_MAP,
  map
});

export const mapSetProvider = (provider: IMapReducer['provider']) => ({
  type: MAP_ACTIONS.SET_PROVIDER,
  provider
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

export const mapDropSticker = (index: number) => ({
  type: MAP_ACTIONS.DROP_STICKER,
  index,
});
