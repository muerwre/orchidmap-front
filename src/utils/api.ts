import axios, { AxiosPromise } from 'axios/index';
import { API } from '$constants/api';
import { IRootState } from "$redux/user/reducer";
import { IUser } from "$constants/auth";
import { ILatLng } from "$modules/Stickers";
import { IStickerDump } from "$modules/Sticker";

const arrayToObject = (array: any[], key: string): {} => array.reduce((obj, el) => ({ ...obj, [el[key]]: el }), {});

interface IPostMap {
  title: IRootState['title'],
  address: IRootState['address'],
  route: Array<ILatLng>,
  stickers: Array<IStickerDump>,
  id: IRootState['user']['id'],
  token: IRootState['user']['token'],
  force: boolean,
  logo: IRootState['logo'],
  distance: IRootState['distance'],
  provider: IRootState['provider'],
  is_public: IRootState['is_public'],
}

interface IGetRouteList {
  title: IRootState['title'],
  distance: IRootState['distance'],
  author: IRootState['routes']['filter']['author'],
  step: IRootState['routes']['step'],
  shift: IRootState['routes']['step'],
  starred: IRootState['routes']['filter']['starred'],
  id: IRootState['user']['id'],
  token: IRootState['user']['token'],
}

interface IGetRouteListResult {
  min: IRootState['routes']['filter']['min'],
  max: IRootState['routes']['filter']['max'],
  limit: IRootState['routes']['limit'],
  step: IRootState['routes']['step'],
  shift: IRootState['routes']['shift'],
  list: IRootState['routes']['list'],
}

export const checkUserToken = (
  { id, token }:
  { id: IRootState['user']['id'], token: IRootState['user']['token']}
):AxiosPromise<IUser> => axios.get(API.CHECK_TOKEN, {
  params: { id, token }
}).then(result => (result && result.data && {
  ...result.data,
  id,
  token,
  routes: (result.data.routes && result.data.routes.length > 0 && arrayToObject(result.data.routes, '_id')) || {},
})).catch(() => null);

export const getGuestToken = ():AxiosPromise<any> => axios.get(API.GET_GUEST).then(result => (result && result.data));

export const getStoredMap = (
  { name }: { name: IRootState['address'] }
) => axios.get(API.GET_MAP, {
  params: { name }
})
  .then(result => (
    result && result.data && result.data.success && result.data
  ));

export const postMap = ({
  title, address, route, stickers, id, token, force, logo, distance, provider, is_public,
}: IPostMap) => axios.post(API.POST_MAP, {
  title,
  address,
  route,
  stickers,
  id,
  token,
  force,
  logo,
  distance,
  provider,
  is_public,
}).then(result => (result && result.data && result.data));

export const checkIframeToken = (
  { viewer_id, auth_key }:
  { viewer_id: string, auth_key: string }
) => axios.get(API.IFRAME_LOGIN_VK, {
  params: { viewer_id, auth_key }
}).then(result => (result && result.data && result.data.success && result.data.user)).catch(() => (false));

export const getRouteList = ({
  title, distance, author, starred, id, token, step, shift,
}: IGetRouteList): AxiosPromise<IGetRouteListResult> => axios.get(API.GET_ROUTE_LIST, {
  params: {
    title, distance, author, starred, id, token, step, shift
  }
}).then(result => (result && result.data && result.data.success && result.data))
  .catch(() => ({ list: [], min: 0, max: 0, limit: 0, step: 20, shift: 20 }));