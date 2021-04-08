import { REHYDRATE, RehydrateAction } from 'redux-persist';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  checkIframeToken,
  checkUserToken,
  dropRoute,
  getGuestToken,
  getRouteList,
  modifyRoute,
  sendRouteStarred,
} from '~/utils/api';
import * as ActionCreators from '~/redux/user/actions';
import {
  mapsSetShift,
  searchChangeDistance,
  searchPutRoutes,
  searchSetLoading,
  searchSetTab,
  searchSetTitle,
  setRouteStarred,
  setUser,
  userLogin,
} from '~/redux/user/actions';

import { parseQuery, pushLoaderState, pushNetworkInitError } from '~/utils/history';
import { USER_ACTIONS } from '~/redux/user/constants';
import { DEFAULT_USER } from '~/constants/auth';

import { DIALOGS, TABS } from '~/constants/dialogs';
import { Unwrap } from '~/utils/middleware';
import { selectUser, selectUserUser } from './selectors';
import { mapInitSaga } from '~/redux/map/sagas';
import { editorSetDialog, editorSetDialogActive } from '../editor/actions';
import { selectEditor } from '../editor/selectors';

function* generateGuestSaga() {
  try {
    const {
      data: { user, random_url },
    }: Unwrap<typeof getGuestToken> = yield call(getGuestToken);

    yield put(setUser({ ...user, random_url }));

    return { ...user, random_url };
  } catch(e) {
    console.log(e)
  }
}

function* authCheckSaga({ key }: RehydrateAction) {
  try {
    if (key !== 'user') return;

    pushLoaderState(70);

    const { id, token }: ReturnType<typeof selectUserUser> = yield select(selectUserUser);
    const { ready }: ReturnType<typeof selectEditor> = yield select(selectEditor);

    if (window.location.search || true) {
      const { viewer_id, auth_key } = yield parseQuery(window.location.search);

      if (viewer_id && auth_key && id !== `vk:${viewer_id}`) {
        const user = yield call(checkIframeToken, { viewer_id, auth_key });

        if (user) {
          yield put(setUser(user));

          pushLoaderState(99);

          return yield call(mapInitSaga);
        }
      }
    }

    if (id && token) {
      const {
        data: { user, random_url },
      }: Unwrap<typeof checkUserToken> = yield call(checkUserToken, {
        id,
      });

      if (user) {
        yield put(setUser({ ...user, random_url }));

        pushLoaderState(99);

        return yield call(mapInitSaga);
      } else if (!ready) {
        pushNetworkInitError();
        return;
      }
    }

    yield call(generateGuestSaga);

    pushLoaderState(80);

    return yield call(mapInitSaga);
  } catch (e) {
    console.log(e);
  }
}

function* gotVkUserSaga({ user: u }: ReturnType<typeof ActionCreators.gotVkUser>) {
  const {
    data: { user, random_url },
  }: Unwrap<typeof checkUserToken> = yield call(checkUserToken, u);

  yield put(setUser({ ...user, random_url }));
  yield put(userLogin());
}

function* searchGetRoutes() {
  try {
    const {
      routes: {
        step,
        shift,
        filter: { title, distance, tab },
      },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const result: Unwrap<typeof getRouteList> = yield getRouteList({
      search: title,
      min: distance[0],
      max: distance[1],
      step,
      shift,
      tab,
    });

    return result;
  } catch (e) {
    console.log(e);
  }
}

export function* searchSetSagaWorker() {
  try {
    const {
      routes: { filter },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const {
      data: {
        routes,
        limits: { min, max, count: limit },
        filter: { shift, step },
      },
    }: Unwrap<typeof getRouteList> = yield call(searchGetRoutes);

    yield put(searchPutRoutes({ list: routes, min, max, limit, shift, step }));

    // change distange range if needed and load additional data
    if (
      (filter.min > min && filter.distance[0] <= filter.min) ||
      (filter.max < max && filter.distance[1] >= filter.max)
    ) {
      yield put(
        searchChangeDistance([
          filter.min > min && filter.distance[0] <= filter.min ? min : filter.distance[0],
          filter.max < max && filter.distance[1] >= filter.max ? max : filter.distance[1],
        ]),
      );
    }

    return yield put(searchSetLoading(false));
  } catch (e) {
    console.log(e);
  }
}

function* searchSetSaga() {
  yield put(searchSetLoading(true));
  yield put(mapsSetShift(0));
  yield delay(300);
  yield call(searchSetSagaWorker);
}

function* openMapDialogSaga({ tab }: ReturnType<typeof ActionCreators.openMapDialog>) {
  try {
    const {
      routes: {
        filter: { tab: current },
      },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const { dialog_active }: ReturnType<typeof selectEditor> = yield select(selectEditor);

    if (dialog_active && tab === current) {
      return yield put(editorSetDialogActive(false));
    }

    if (tab !== current) {
      yield put(searchSetTab(tab));
    }

    yield put(editorSetDialog(DIALOGS.MAP_LIST));
    yield put(editorSetDialogActive(true));

    return tab;
  } catch (e) {
    console.log(e);
  }
}

function* searchSetTabSaga() {
  yield put(searchChangeDistance([0, 10000]));
  yield put(searchPutRoutes({ list: [], min: 0, max: 10000, step: 20, shift: 0 }));

  yield put(searchSetTitle(''));
}

function* userLogoutSaga() {
  yield put(setUser(DEFAULT_USER));
  yield call(generateGuestSaga);
}

function* setUserSaga() {
  const { dialog_active }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  if (dialog_active) yield call(searchSetSagaWorker);

  return true;
}

function* mapsLoadMoreSaga() {
  try {
    const {
      routes: { limit, list, shift, step, loading, filter },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    if (loading || list.length >= limit || limit === 0) return;

    yield delay(50);

    yield put(searchSetLoading(true));
    yield put(mapsSetShift(shift + step));

    const {
      data: {
        limits: { min, max, count },
        filter: { shift: resp_shift, step: resp_step },
        routes,
      },
    }: Unwrap<typeof getRouteList> = yield call(searchGetRoutes);

    if (
      (filter.min > min && filter.distance[0] <= filter.min) ||
      (filter.max < max && filter.distance[1] >= filter.max)
    ) {
      yield put(
        searchChangeDistance([
          filter.min > min && filter.distance[0] <= filter.min ? min : filter.distance[0],
          filter.max < max && filter.distance[1] >= filter.max ? max : filter.distance[1],
        ]),
      );
    }

    yield put(
      searchPutRoutes({
        min,
        max,
        limit: count,
        shift: resp_shift,
        step: resp_step,
        list: [...list, ...routes],
      }),
    );
    yield put(searchSetLoading(false));
  } catch (e) {
    console.log(e);
  }
}

function* dropRouteSaga({ address }: ReturnType<typeof ActionCreators.dropRoute>) {
  try {
    const {
      routes: {
        list,
        step,
        shift,
        limit,
        filter: { min, max },
      },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const index = list.findIndex(el => el.address === address);

    if (index >= 0) {
      yield put(
        searchPutRoutes({
          list: list.filter(el => el.address !== address),
          min,
          max,
          step,
          shift: shift > 0 ? shift - 1 : 0,
          limit: limit > 0 ? limit - 1 : limit,
        }),
      );
    }

    return yield call(dropRoute, { address });
  } catch (e) {
    console.log(e);
  }
}

function* modifyRouteSaga({
  address,
  title,
  is_public,
}: ReturnType<typeof ActionCreators.modifyRoute>) {
  try {
    const {
      routes: {
        list,
        step,
        shift,
        limit,
        filter: { min, max },
      },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const index = list.findIndex(el => el.address === address);

    if (index >= 0) {
      yield put(
        searchPutRoutes({
          list: list.map(el => (el.address !== address ? el : { ...el, title, is_public })),
          min,
          max,
          step,
          shift: shift > 0 ? shift - 1 : 0,
          limit: limit > 0 ? limit - 1 : limit,
        }),
      );
    }

    return yield call(modifyRoute, { address, title, is_public });
  } catch (e) {
    console.log(e);
  }
}

function* toggleRouteStarredSaga({
  address,
}: ReturnType<typeof ActionCreators.toggleRouteStarred>) {
  try {
    const {
      routes: { list },
    }: ReturnType<typeof selectUser> = yield select(selectUser);

    const route = list.find(el => el.address === address);

    yield put(setRouteStarred(address, !route?.is_published));

    const result = yield sendRouteStarred({
      address,
      is_published: !route?.is_published,
    });

    if (!result) return yield put(setRouteStarred(address, !!route?.is_published));
  } catch (e) {
    console.log(e);
  }
}

export function* updateUserRoutes() {
  yield put(searchSetTab(TABS.MY));
}

export function* userSaga() {
  yield takeEvery(REHYDRATE, authCheckSaga);

  yield takeEvery(USER_ACTIONS.USER_LOGOUT, userLogoutSaga);
  yield takeLatest(USER_ACTIONS.GOT_VK_USER, gotVkUserSaga);

  yield takeLatest(
    [USER_ACTIONS.SEARCH_SET_TITLE, USER_ACTIONS.SEARCH_SET_DISTANCE],
    searchSetSaga,
  );

  yield takeLatest(USER_ACTIONS.OPEN_MAP_DIALOG, openMapDialogSaga);
  yield takeLatest(USER_ACTIONS.SEARCH_SET_TAB, searchSetTabSaga);
  yield takeLatest(USER_ACTIONS.SET_USER, setUserSaga);

  yield takeLatest(USER_ACTIONS.MAPS_LOAD_MORE, mapsLoadMoreSaga);

  yield takeLatest(USER_ACTIONS.DROP_ROUTE, dropRouteSaga);
  yield takeLatest(USER_ACTIONS.MODIFY_ROUTE, modifyRouteSaga);
  yield takeLatest(USER_ACTIONS.TOGGLE_ROUTE_STARRED, toggleRouteStarredSaga);

  yield takeLatest([USER_ACTIONS.USER_LOGIN, USER_ACTIONS.USER_LOGOUT], updateUserRoutes);
}
