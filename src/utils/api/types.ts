import { IRoute } from '~/redux/map/types';

export interface PostMapResponse {
  route: IRoute;
  error?: string;
  code?: string;
}

export type PostMapRequest = Partial<IRoute> & {
  force: boolean;
}
