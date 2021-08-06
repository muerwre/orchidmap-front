import { API } from '~/constants/api';
import { IRootState } from '~/redux/user';
import { IUser } from '~/constants/auth';
import { CLIENT } from '~/config/frontend';
import { LatLngLiteral } from 'leaflet';
import { IRoute } from '~/redux/map/types';
import { INominatimResult } from '~/redux/types';
import { api } from './instance';
import { postMapInterceptor } from '~/utils/api/interceptors';
import {
  CheckTokenRequest,
  CheckTokenResult,
  GetGuestTokenResult, GetRouteListRequest, GetRouteListResponse, GetStoredMapRequest, GetStoredMapResult,
  PostMapRequest,
  PostMapResponse,
} from '~/utils/api/types';

export const checkUserToken = ({
  id,
  token,
}: CheckTokenRequest) =>
  api
    .get<CheckTokenResult>(API.CHECK_TOKEN, {
      params: { id, token },
    });

export const getGuestToken = () =>
  api
    .get<GetGuestTokenResult>(API.GET_GUEST);

export const getStoredMap = ({
  name,
}: GetStoredMapRequest) =>
  api
    .get<GetStoredMapResult>(API.GET_MAP, {
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
}: PostMapRequest) =>
  api
    .post<PostMapResponse>(
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
    ).catch(postMapInterceptor);

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
}: GetRouteListRequest) =>
  api
    .get<GetRouteListResponse>(
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
