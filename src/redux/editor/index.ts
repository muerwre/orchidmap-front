import { createReducer } from '~/utils/reducer';
import { IDialogs } from '~/constants/dialogs';
import { MODES } from '~/constants/modes';
import { EDITOR_HANDLERS } from './handlers';
import { ILatLng } from '../map/types';

export interface IEditorState {
  changed: boolean;
  editing: boolean;
  ready: boolean;
  markers_shown: boolean;

  router: {
    points: ILatLng[]; 
    waypoints: ILatLng[];
  };

  mode: typeof MODES[keyof typeof MODES];

  dialog: IDialogs[keyof IDialogs];
  dialog_active: boolean;

  routerPoints: number;
  distance: number;
  estimated: number;
  speed: number;
  activeSticker: { set?: string; sticker?: string };
  is_empty: boolean;
  is_published: boolean;
  is_routing: boolean;

  features: {
    routing: boolean;
  };

  renderer: {
    data: string;
    width: number;
    height: number;
    renderer_active: boolean;
    info: string;
    progress: number;
  };

  save: {
    error: string;
    finished: boolean;
    overwriting: boolean;
    processing: boolean;
    loading: boolean;
  };
}

export const EDITOR_INITIAL_STATE = {
  changed: false,
  editing: false,
  ready: false,
  markers_shown: false,

  mode: MODES.NONE,
  dialog: null,
  dialog_active: false,

  routerPoints: 0,
  distance: 0,
  estimated: 0,
  speed: 15,
  activeSticker: { set: null, sticker: null },
  router: {
    waypoints: [],
    points: [],
  },
  is_published: false,
  is_empty: true,
  is_routing: false,

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

  save: {
    error: null,
    finished: false,
    overwriting: false,
    processing: false,
    loading: false,
  },
};

export const editor = createReducer(EDITOR_INITIAL_STATE, EDITOR_HANDLERS);
