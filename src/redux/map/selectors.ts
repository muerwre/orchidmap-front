import { IState } from "~/redux/store";

export const selectMap = (state: IState) => state.map;
export const selectMapProvider = (state: IState) => state.map.provider;
export const selectMapLogo = (state: IState) => state.map.logo;
export const selectMapRoute= (state: IState) => state.map.route;
export const selectMapStickers = (state: IState) => state.map.stickers;