import { MAP_ACTIONS } from "./constants";
import { IMapReducer } from ".";
import { mapSet, mapSetProvider, mapSetRoute } from "./actions";

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

export const MAP_HANDLERS = {
  [MAP_ACTIONS.SET_MAP]: setMap,
  [MAP_ACTIONS.SET_PROVIDER]: setProvider,
  [MAP_ACTIONS.SET_ROUTE]: setRoute
};
