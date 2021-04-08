import { API } from '~/constants/api';
import { IRootState, IRouteListItem } from '~/redux/user';
import { IUser } from '~/constants/auth';
import { CLIENT } from '~/config/frontend';
import { LatLngLiteral } from 'leaflet';
import { IRoute } from '~/redux/map/types';
import { INominatimResult } from '~/redux/types';
import { api } from './instance';

interface IGetRouteList {
  min: number;
  max: number;
  tab: string;
  search: string;
  step: IRootState['routes']['step'];
  shift: IRootState['routes']['step'];
}

export const checkUserToken = ({
  id,
}: {
  id: IRootState['user']['id'];
}) =>
  api
    .get<{
      user: IUser;
      random_url: string;
      routes: IRouteListItem[];
    }>(API.CHECK_TOKEN, {
      params: { id },
    });

export const getGuestToken = () =>
  api
    .get<{
      user: IUser;
      random_url: string;
    }>(API.GET_GUEST);

export const getStoredMap = ({
  name,
}: {
  name: IRoute['address'];
}) =>
  api
    .get<{
      route: IRoute;
      error?: string;
      random_url: string;
    }>(API.GET_MAP, {
      params: { name },
    });

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
}: Partial<IRoute> & {
  force: boolean;
}) =>
  api
    .post<{
      route: IRoute;
      error?: string;
      code?: string;
    }>(
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
          description,
        },
        force,
      },
    );

export const checkIframeToken = ({
  viewer_id,
  auth_key,
}: {
  viewer_id: string;
  auth_key: string;
}) =>
  api
    .get<{
      success: boolean,
      user: IUser,
    }>(API.IFRAME_LOGIN_VK, {
      params: { viewer_id, auth_key },
    })
    .then(result => !!result.data.success && !!result.data.user)
    .catch(() => false);

export const getRouteList = ({
  search,
  min,
  max,
  tab,
  step,
  shift,
}: IGetRouteList) =>
  api
    .get<{
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
    }>(
      API.GET_ROUTE_LIST(tab),
      {
        params: {
          search,
          min,
          max,
          step,
          shift,
        },
      },
    );

export const checkOSRMService = (bounds: LatLngLiteral[]) =>
  !!CLIENT &&
  !!CLIENT.OSRM_URL &&
  api
    .get<boolean>(CLIENT.OSRM_TEST_URL(bounds))
    .then(() => true)
    .catch(() => false);

export const checkNominatimService = () =>
  !!CLIENT &&
  !!CLIENT.NOMINATIM_TEST_URL &&
  api
    .get<boolean>(CLIENT.NOMINATIM_TEST_URL)
    .then(() => true)
    .catch(() => false);

export const searchNominatim = (query: string) =>
  CLIENT &&
  CLIENT.NOMINATIM_URL &&
  api
    .get(`${CLIENT.NOMINATIM_URL} ${query}`, {
      params: {
        format: 'json',
        country_code: 'ru',
        'accept-language': 'ru_RU',
        dedupe: 1,
      },
    })
    .then(
      data =>
        data &&
        data.data &&
        data.data.map(
          (item): INominatimResult => ({
            id: item.place_id,
            latlng: {
              lat: item.lat,
              lng: item.lon,
            },
            title: item.display_name,
          }),
        ),
    )
    .catch(() => []);

export const dropRoute = ({ address }: { address: string }) =>
  api
    .delete(API.DROP_ROUTE, { data: { address } });

export const modifyRoute = ({
  address,
  title,
  is_public,
}: {
  address: string;
  title: string;
  is_public: boolean;
}) =>
  api
    .patch<{
      route: IRoute;
    }>(API.MODIFY_ROUTE, { address, is_public, title });

export const sendRouteStarred = ({
  address,
  is_published,
}: {
  address: string;
  is_published: boolean;
}) =>
  api
    .post<{ route: IRoute }>(API.SET_STARRED, { address, is_published });
