import { IRoute } from '~/redux/map/types';
import { IUser } from '~/constants/auth';
import { IRootState, IRouteListItem } from '~/redux/user';

export interface PostMapResponse {
  route: IRoute;
  error?: string;
  code?: string;
}

export type PostMapRequest = Partial<IRoute> & {
  force: boolean;
}

export interface CheckTokenResult {
  user: IUser;
  random_url: string;
  routes: IRouteListItem[];
}

export interface CheckTokenRequest {
  id: IRootState['user']['id'];
  token: string,
}

export interface GetGuestTokenResult {
  user: IUser;
  random_url: string;
}

export interface GetStoredMapResult {
  route: IRoute;
  error?: string;
  random_url: string;
}

export interface GetStoredMapRequest {
  name: IRoute['address'];
}

export interface GetRouteListRequest {
  min: number;
  max: number;
  tab: string;
  search: string;
  step: IRootState['routes']['step'];
  shift: IRootState['routes']['step'];
}

export interface GetRouteListResponse {
  routes: IRoute[];
  limits: {
    min: number;
    max: number;
    count: number;
  };
  filter: {
    min: number;
    max: number;
    shift: number;
    step: number;
  };
}
