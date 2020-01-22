import { createReducer } from '~/utils/reducer';
import { DIALOGS } from '~/constants/dialogs';
import { MODES } from '~/constants/modes';
import { EDITOR_HANDLERS } from './handlers';
import { ILatLng } from '../map/types';
import { INominatimResult } from '~/redux/types';
import { IMapReducer } from '../map';
import { DRAWING_DIRECTIONS } from './constants';

export interface IEditorHistoryItem {
  route: IMapReducer['route'];
  stickers: IMapReducer['stickers'];
}

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

  dialog: typeof DIALOGS[keyof typeof DIALOGS];
  dialog_active: boolean;

  routerPoints: number;
  distance: number;
  estimated: number;
  speed: number;
  activeSticker: { set?: string; sticker?: string };
  is_empty: boolean;
  is_published: boolean;
  is_routing: boolean;
  drawing_direction: typeof DRAWING_DIRECTIONS[keyof typeof DRAWING_DIRECTIONS];

  features: {
    routing: boolean;
    nominatim: boolean;
  };

  nominatim: {
    search: string;
    loading: boolean;
    list: INominatimResult[];
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

  history: {
    records: IEditorHistoryItem[];
    position: number;
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
  drawing_direction: DRAWING_DIRECTIONS.FORWARDS,

  is_published: false,
  is_empty: true,
  is_routing: false,

  router: {
    waypoints: [],
    points: [],
  },

  features: {
    routing: false,
    nominatim: false,
  },

  nominatim: {
    search: '',
    loading: false,
    list: [],
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

  history: {
    records: [{ route: [], stickers: [] }],
    position: 0,
  },
};

export const editor = createReducer(EDITOR_INITIAL_STATE, EDITOR_HANDLERS);
