import axios, { AxiosPromise } from "axios/index";
import { API } from "$constants/api";
import { IRootState, IRouteListItem, IRoute } from "$redux/user/reducer";
import { IUser } from "$constants/auth";
import { ILatLng } from "$modules/Stickers";
import { IStickerDump } from "$modules/Sticker";
import { CLIENT } from "$config/frontend";
import { LatLngLiteral } from "leaflet";
import {
  resultMiddleware,
  errorMiddleware,
  IResultWithStatus,
  configWithToken
} from "./middleware";

const arrayToObject = (array: any[], key: string): {} =>
  array.reduce((obj, el) => ({ ...obj, [el[key]]: el }), {});

interface IGetRouteList {
  min: number;
  max: number;
  tab: string;
  search: string;
  step: IRootState["routes"]["step"];
  shift: IRootState["routes"]["step"];
  token: IRootState["user"]["token"];
}

interface IGetRouteListResult {
  min: IRootState["routes"]["filter"]["min"];
  max: IRootState["routes"]["filter"]["max"];
  limit: IRootState["routes"]["limit"];
  step: IRootState["routes"]["step"];
  shift: IRootState["routes"]["shift"];
  list: IRootState["routes"]["list"];
}

export const checkUserToken = ({
  id,
  token
}: {
  id: IRootState["user"]["id"];
  token: IRootState["user"]["token"];
}): Promise<IResultWithStatus<{
  user: IUser;
  random_url: string;
  routes: IRouteListItem[];
}>> =>
  axios
    .get(API.CHECK_TOKEN, {
      params: { id, token }
    })
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const getGuestToken = (): Promise<IResultWithStatus<{
  user: IUser;
  random_url: string;
}>> =>
  axios
    .get(API.GET_GUEST)
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const getStoredMap = ({
  name
}: {
  name: IRootState["address"];
}): Promise<IResultWithStatus<{
  route: IRoute;
  error?: string;
  random_url: string;
}>> =>
  axios
    .get(API.GET_MAP, {
      params: { name }
    })
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const postMap = ({
  title,
  address,
  route,
  stickers,
  force,
  logo,
  distance,
  provider,
  is_public,
  description,
  token
}: Partial<IRoute> & {
  force: boolean;
  token: string;
}): Promise<IResultWithStatus<{
  route: IRoute;
  error?: string;
  code?: string;
}>> =>
  axios
    .post(
      API.POST_MAP,
      {
        route: {
          title,
          address,
          route,
          stickers,
          logo,
          distance,
          provider,
          is_public,
          description
        },
        force
      },
      configWithToken(token)
    )
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const checkIframeToken = ({
  viewer_id,
  auth_key
}: {
  viewer_id: string;
  auth_key: string;
}) =>
  axios
    .get(API.IFRAME_LOGIN_VK, {
      params: { viewer_id, auth_key }
    })
    .then(
      result => result && result.data && result.data.success && result.data.user
    )
    .catch(() => false);

    
export const getRouteList = ({
  search,
  min,
  max,
  tab,
  token,
  step,
  shift
}: IGetRouteList): Promise<IResultWithStatus<{
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
}>> =>
  axios
    .get(
      API.GET_ROUTE_LIST(tab),
      configWithToken(token, {
        params: {
          search,
          min,
          max,
          token,
          step,
          shift
        }
      })
    )
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const checkOSRMService = (bounds: LatLngLiteral[]): Promise<boolean> =>
  CLIENT &&
  CLIENT.OSRM_URL &&
  axios
    .get(CLIENT.OSRM_TEST_URL(bounds))
    .then(() => true)
    .catch(() => false);

export const dropRoute = ({
  address,
  token
}: {
  address: string;
  token: string;
}): Promise<any> =>
  axios
    .delete(API.DROP_ROUTE, configWithToken(token, { data: { address } }))
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const modifyRoute = ({
  address,
  token,
  title,
  is_public
}: {
  address: string;
  token: string;
  title: string;
  is_public: boolean;
}): Promise<IResultWithStatus<{
  route: IRoute;
}>> =>
  axios
    .patch(
      API.MODIFY_ROUTE,
      { address, token, is_public, title },
      configWithToken(token)
    )
    .then(resultMiddleware)
    .catch(errorMiddleware);

export const sendRouteStarred = ({
  token,
  address,
  is_published
}: {
  token: string;
  address: string;
  is_published: boolean;
}): Promise<IResultWithStatus<{ route: IRoute }>> =>
  axios
    .post(API.SET_STARRED, { address, is_published }, configWithToken(token))
    .then(resultMiddleware)
    .catch(errorMiddleware);
