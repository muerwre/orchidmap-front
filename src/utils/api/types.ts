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
