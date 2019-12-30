import { IState } from "$redux/store";

export const selectMapProvider = (state: IState) => state.map.provider;
export const selectMapRoute= (state: IState) => state.map.route;
export const selectMapStickers = (state: IState) => state.map.stickers;