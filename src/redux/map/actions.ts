import { MAP_ACTIONS } from "./constants";
import { IMapReducer } from "./";

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
