import createReducer from 'reduxsauce/lib/createReducer';
import { DEFAULT_USER, IUser } from '~/constants/auth';
import { USER_HANDLERS } from './handlers';

export interface IRouteListItem {
  address: string,
  title: string,
  distance: number,
  is_public: boolean,
  is_published: boolean,
  updated_at: string,
}

export interface IRootReducer {
  // ready: boolean,
  user: IUser,

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
  user: { ...DEFAULT_USER },

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
