import { createReducer } from 'reduxsauce';
import { DEFAULT_USER, IUser } from '$constants/auth';
import { MODES } from '$constants/modes';
import { DEFAULT_LOGO, LOGOS } from '$constants/logos';
import { DEFAULT_PROVIDER, PROVIDERS } from '$constants/providers';
import { DIALOGS, IDialogs, TABS } from '$constants/dialogs';
import { IStickers } from "$constants/stickers";
import { IRoutePoint } from '$utils/gpx';
import { IStickerDump } from '$redux/map/types';
import { USER_HANDLERS } from './handlers';

export interface IRoute {
  version: number,
  title: IRootState['title'],
  owner: number,
  address: IRootState['address'],
  route: IRoutePoint[],
  stickers: IStickerDump[],
  provider: IRootState['provider'],
  is_public: IRootState['is_public'],
  is_published: IRootState['is_published'],
  description: IRootState['description'],
  logo: IRootState['logo'],
  distance: IRootState['distance']
}

export interface IRouteListItem {
  address: string,
  title: string,
  distance: number,
  is_public: boolean,
  is_published: boolean,
  updated_at: string,
}

export interface IRootReducer {
  ready: boolean,
  user: IUser,
  editing: boolean,
  mode: typeof MODES[keyof typeof MODES],
  logo: keyof typeof LOGOS,
  routerPoints: number,
  distance: number,
  description: string,
  estimated: number,
  speed: number,
  activeSticker: { set?: keyof IStickers, sticker?: string },
  title: string,
  address: string,
  address_origin: string,
  changed: boolean,
  provider: keyof typeof PROVIDERS,
  markers_shown: boolean,

  is_published: boolean,
  is_public: boolean,
  is_empty: boolean,
  is_routing: boolean,

  save_error: string,
  save_finished: boolean,
  save_overwriting: boolean,
  save_processing: boolean,
  save_loading: boolean,

  dialog: IDialogs[keyof IDialogs],
  dialog_active: boolean,

  features: {
    routing: boolean,
  },

  renderer: {
    data: string,
    width: number,
    height: number
    renderer_active: boolean,
    info: string,
    progress: number,
  },

  routes: {
    limit: 0,
    loading: boolean,
    list: Array<IRouteListItem>,
    step: number,
    shift: number,
    filter: {
      title: string,
      starred: boolean,
      distance: [number, number],
      author: string,
      tab: string,
      min: number,
      max: number,
    }
  },
}

export type IRootState = Readonly<IRootReducer>;

export const INITIAL_STATE: IRootReducer = {
  ready: false,
  user: { ...DEFAULT_USER },

  mode: MODES.NONE,
  logo: DEFAULT_LOGO,
  routerPoints: 0,
  distance: 0,
  description: '',
  estimated: 0,
  speed: 15,
  activeSticker: { set: null, sticker: null },
  title: '',
  address: '',
  address_origin: '',
  provider: DEFAULT_PROVIDER,

  markers_shown: true,
  changed: false,
  editing: false,

  is_published: false,
  is_public: false,
  is_empty: true,
  is_routing: false,

  save_error: '',
  save_finished: false,
  save_overwriting: false,
  save_processing: false,
  save_loading: false,

  dialog: DIALOGS.NONE,
  dialog_active: false,

  features: {
    routing: false,
  },

  renderer: {
    data: '',
    width: 0,
    height: 0,
    renderer_active: false,
    info: '',
    progress: 0,
  },

  routes: {
    limit: 0,
    loading: false, // <-- maybe delete this
    list: [],
    step: 20,
    shift: 0,
    filter: {
      title: '',
      starred: false,
      distance: [0, 10000],
      author: '',
      tab: '',
      min: 0,
      max: 10000,
    }
  },
};

export const userReducer = createReducer(INITIAL_STATE, USER_HANDLERS);
