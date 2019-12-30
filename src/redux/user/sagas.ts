import { REHYDRATE, RehydrateAction } from 'redux-persist';
import { delay, SagaIterator } from 'redux-saga';
import {
  takeLatest,
  select,
  call,
  put,
  takeEvery,
  race,
} from 'redux-saga/effects';
import {
  checkIframeToken,
  checkOSRMService,
  checkUserToken,
  dropRoute,
  getGuestToken,
  getRouteList,
  modifyRoute,
  sendRouteStarred,
} from '$utils/api';
import {
  hideRenderer,
  searchPutRoutes,
  searchSetLoading,
  setChanged,
  setDialogActive,
  setEditing,
  setMode,
  setReady,
  setRenderer,
  searchSetTab,
  setUser,
  setDialog,
  setAddressOrigin,
  mapsSetShift,
  searchChangeDistance,
  clearAll,
  setFeature,
  searchSetTitle,
  setRouteStarred,
} from '$redux/user/actions';

import {
  getUrlData,
  parseQuery,
  pushLoaderState,
  pushNetworkInitError,
  pushPath,
} from '$utils/history';
import { USER_ACTIONS } from '$redux/user/constants';
import { MODES } from '$constants/modes';
import { DEFAULT_USER } from '$constants/auth';
import {
  composeArrows,
  composeDistMark,
  composeImages,
  composePoly,
  composeStickers,
  downloadCanvas,
  fetchImages,
  getPolyPlacement,
  getStickersPlacement,
  getTilePlacement,
  imageFetcher,
} from '$utils/renderer';
import { LOGOS } from '$constants/logos';
import { DIALOGS, TABS } from '$constants/dialogs';

import * as ActionCreators from '$redux/user/actions';
import { downloadGPXTrack, getGPXString } from '$utils/gpx';
import { Unwrap } from '$utils/middleware';
import { IState } from '$redux/store';
import { selectUser, selectUserUser } from './selectors';
import { mapInitSaga, loadMapSaga, replaceAddressIfItsBusy } from '$redux/map/sagas';
import { LatLng } from 'leaflet';
import { selectMap } from '$redux/map/selectors';

// const getUser = (state: IState) => state.user.user;
// const selectUser = (state: IState) => state.user;

const hideLoader = () => {
  document.getElementById('loader').style.opacity = String(0);
  document.getElementById('loader').style.pointerEvents = 'none';

  return true;
};

function* generateGuestSaga() {
  const {
    data: { user, random_url },
  }: Unwrap<typeof getGuestToken> = yield call(getGuestToken);

  yield put(setUser({ ...user, random_url }));

  return { ...user, random_url };
}

function* startEditingSaga() {
  const { path } = getUrlData();
  yield pushPath(`/${path}/edit`);
}

function* stopEditingSaga() {
  const { changed, editing, mode, address_origin } = yield select(selectUser);
  const { path } = getUrlData();

  if (!editing) return;
  if (changed && mode !== MODES.CONFIRM_CANCEL) {
    yield put(setMode(MODES.CONFIRM_CANCEL));
    return;
  }

  // TODO: cancel editing?
  // yield editor.cancelEditing();
  yield put(setMode(MODES.NONE));
  yield put(setChanged(false));
  // TODO: dont close editor if theres no initial data
  // yield put(setEditing(editor.hasEmptyHistory)); // don't close editor if no previous map

  yield pushPath(`/${address_origin || path}/`);
}

function* checkOSRMServiceSaga() {
  const routing = yield call(checkOSRMService, [new LatLng(1,1), new LatLng(2,2)]);

  yield put(setFeature({ routing }));
}

export function* setReadySaga() {
  yield put(setReady(true));
  hideLoader();

  yield call(checkOSRMServiceSaga);
  yield put(searchSetTab(TABS.MY));
}

function* authCheckSaga({ key }: RehydrateAction) {
  if (key !== 'user') return;

  pushLoaderState(70);

  const { id, token } = yield select(selectUserUser);
  const { ready } = yield select(selectUser);

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
      token,
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
}

// function* setModeSaga({ mode }: ReturnType<typeof ActionCreators.setMode>) {
  // return yield editor.changeMode(mode);
  // console.log('change', mode);
// }

// function* setLogoSaga({ logo }: { type: string; logo: string }) {
//   const { mode } = yield select(selectUser);
//   editor.logo = logo;

//   yield put(setChanged(true));

//   if (mode === MODES.LOGO) {
//     yield put(setMode(MODES.NONE));
//   }
// }

// function* routerCancelSaga() {
//   yield call(editor.router.cancelDrawing);
//   yield put(setMode(MODES.NONE));

//   return true;
// }

// function* routerSubmitSaga() {
//   yield call(editor.router.submitDrawing);
//   yield put(setMode(MODES.NONE));

//   return true;
// }


function* getRenderData() {
  yield put(setRenderer({ info: 'Загрузка тайлов', progress: 0.1 }));

  const { route, stickers, provider }: ReturnType<typeof selectMap> = yield select(selectMap);

  const canvas = <HTMLCanvasElement>document.getElementById('renderer');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const geometry = getTilePlacement();
  const points = getPolyPlacement(route);
  const sticker_points = getStickersPlacement(stickers);
  // TODO: get distance:
  const distance = 0;
  // const distance = editor.poly.poly.distance;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const images = yield fetchImages(ctx, geometry, provider);

  yield put(setRenderer({ info: 'Отрисовка', progress: 0.5 }));

  yield composeImages({ geometry, images, ctx });
  yield composePoly({ points, ctx });
  yield composeArrows({ points, ctx });
  yield composeDistMark({ ctx, points, distance });
  yield composeStickers({ stickers: sticker_points, ctx });

  yield put(setRenderer({ info: 'Готово', progress: 1 }));

  return yield canvas.toDataURL('image/jpeg');
}

function* takeAShotSaga() {
  const worker = call(getRenderData);

  const { result, timeout } = yield race({
    result: worker,
    timeout: delay(500),
  });

  if (timeout) yield put(setMode(MODES.SHOT_PREFETCH));

  const data = yield result || worker;

  yield put(setMode(MODES.NONE));
  yield put(
    setRenderer({
      data,
      renderer_active: true,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  );
}

function* getCropData({ x, y, width, height }) {
  const {
    logo,
    renderer: { data },
  } = yield select(selectUser);
  const canvas = <HTMLCanvasElement>document.getElementById('renderer');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = yield imageFetcher(data);

  ctx.drawImage(image, -x, -y);

  if (logo && LOGOS[logo][1]) {
    const logoImage = yield imageFetcher(LOGOS[logo][1]);
    ctx.drawImage(logoImage, width - logoImage.width, height - logoImage.height);
  }

  return yield canvas.toDataURL('image/jpeg');
}

function* cropAShotSaga(params) {
  const { title, address } = yield select(selectUser);
  yield call(getCropData, params);
  const canvas = document.getElementById('renderer') as HTMLCanvasElement;

  downloadCanvas(canvas, (title || address).replace(/\./gi, ' '));

  return yield put(hideRenderer());
}

function* locationChangeSaga({ location }: ReturnType<typeof ActionCreators.locationChanged>) {
  const {
    address,
    ready,
    user: { id, random_url },
  } = yield select(selectUser);

  const { owner }: ReturnType<typeof selectMap> = yield select(selectMap)

  if (!ready) return;

  const { path, mode } = getUrlData(location);

  if (address !== path) {
    const map = yield call(loadMapSaga, path);

    if (map && map.route && map.route.owner && mode === 'edit' && map.route.owner !== id) {
      return yield call(replaceAddressIfItsBusy, map.random_url, map.address);
    }
  } else if (mode === 'edit' && owner.id !== id) {
    return yield call(replaceAddressIfItsBusy, random_url, address);
  } else {
    yield put(setAddressOrigin(''));
  }

  if (mode !== 'edit') {
    yield put(setEditing(false));
    // editor.stopEditing();
  } else {
    yield put(setEditing(true));
    // editor.startEditing();
  }
}

function* gotVkUserSaga({ user: u }: ReturnType<typeof ActionCreators.gotVkUser>) {
  const {
    data: { user, random_url },
  }: Unwrap<typeof checkUserToken> = yield call(checkUserToken, u);

  yield put(setUser({ ...user, random_url }));
}

function* keyPressedSaga({ key, target }: ReturnType<typeof ActionCreators.keyPressed>): any {
  if (target === 'INPUT' || target === 'TEXTAREA') {
    return;
  }

  if (key === 'Escape') {
    const {
      dialog_active,
      mode,
      renderer: { renderer_active },
    } = yield select(selectUser);

    if (renderer_active) return yield put(hideRenderer());
    if (dialog_active) return yield put(setDialogActive(false));
    if (mode !== MODES.NONE) return yield put(setMode(MODES.NONE));
  } else if (key === 'Delete') {
    const {
      user: { editing },
    } = yield select();

    if (!editing) return;

    const { mode } = yield select(selectUser);

    if (mode === MODES.TRASH) {
      yield put(clearAll());
    } else {
      yield put(setMode(MODES.TRASH));
    }
  }
}

function* searchGetRoutes() {
  const { token } = yield select(selectUserUser);

  const {
    routes: {
      step,
      shift,
      filter: { title, distance, tab },
    },
  } = yield select(selectUser);

  const result: Unwrap<typeof getRouteList> = yield getRouteList({
    token,
    search: title,
    min: distance[0],
    max: distance[1],
    step,
    shift,
    tab,
  });

  return result;
}

export function* searchSetSagaWorker() {
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
      ])
    );
  }

  return yield put(searchSetLoading(false));
}

function* searchSetSaga() {
  yield put(searchSetLoading(true));
  yield put(mapsSetShift(0));
  yield delay(300);
  yield call(searchSetSagaWorker);
}

function* openMapDialogSaga({ tab }: ReturnType<typeof ActionCreators.openMapDialog>) {
  const {
    dialog_active,
    routes: {
      filter: { tab: current },
    },
  } = yield select(selectUser);

  if (dialog_active && tab === current) {
    return yield put(setDialogActive(false));
  }

  if (tab !== current) {
    // if tab wasnt changed just update data
    yield put(searchSetTab(tab));
  }

  yield put(setDialog(DIALOGS.MAP_LIST));
  yield put(setDialogActive(true));

  return tab;
}

function* searchSetTabSaga() {
  yield put(searchChangeDistance([0, 10000]));
  yield put(searchPutRoutes({ list: [], min: 0, max: 10000, step: 20, shift: 0 }));

  yield put(searchSetTitle(''));
}

function* userLogoutSaga(): SagaIterator {
  yield put(setUser(DEFAULT_USER));
  yield call(generateGuestSaga);
}

function* setUserSaga() {
  const { dialog_active } = yield select(selectUser);

  if (dialog_active) yield call(searchSetSagaWorker);

  return true;
}

function* getGPXTrackSaga(): SagaIterator {
  const { route, stickers }: ReturnType<typeof selectMap> = yield select(selectMap);
  const { title, address } = yield select(selectUser);

  if (!route || route.length <= 0) return;

  const track = getGPXString({ route, stickers, title: title || address });

  return downloadGPXTrack({ track, title });
}

function* mapsLoadMoreSaga() {
  const {
    routes: { limit, list, shift, step, loading, filter },
  } = yield select(selectUser);

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
      ])
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
    })
  );
  yield put(searchSetLoading(false));
}

function* dropRouteSaga({ address }: ReturnType<typeof ActionCreators.dropRoute>): SagaIterator {
  const { token } = yield select(selectUserUser);
  const {
    routes: {
      list,
      step,
      shift,
      limit,
      filter: { min, max },
    },
  } = yield select(selectUser);

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
      })
    );
  }

  return yield call(dropRoute, { address, token });
}

function* modifyRouteSaga({
  address,
  title,
  is_public,
}: ReturnType<typeof ActionCreators.modifyRoute>): SagaIterator {
  const { token } = yield select(selectUserUser);
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
      })
    );
  }

  return yield call(modifyRoute, { address, token, title, is_public });
}

function* toggleRouteStarredSaga({
  address,
}: ReturnType<typeof ActionCreators.toggleRouteStarred>) {
  const {
    routes: { list },
  }: IState['user'] = yield select(selectUser);

  const route = list.find(el => el.address === address);
  const { token } = yield select(selectUserUser);

  yield put(setRouteStarred(address, !route.is_published));
  const result = yield sendRouteStarred({
    token,
    address,
    is_published: !route.is_published,
  });

  if (!result) return yield put(setRouteStarred(address, route.is_published));
}

export function* userSaga() {
  yield takeLatest(REHYDRATE, authCheckSaga);

  yield takeEvery(USER_ACTIONS.START_EDITING, startEditingSaga);
  yield takeEvery(USER_ACTIONS.STOP_EDITING, stopEditingSaga);

  yield takeEvery(USER_ACTIONS.USER_LOGOUT, userLogoutSaga);

  // yield takeEvery(USER_ACTIONS.ROUTER_CANCEL, routerCancelSaga);
  // yield takeEvery(USER_ACTIONS.ROUTER_SUBMIT, routerSubmitSaga);

  yield takeLatest(USER_ACTIONS.TAKE_A_SHOT, takeAShotSaga);
  yield takeLatest(USER_ACTIONS.CROP_A_SHOT, cropAShotSaga);

  // yield takeEvery(USER_ACTIONS.CHANGE_PROVIDER, changeProviderSaga);
  yield takeLatest(USER_ACTIONS.LOCATION_CHANGED, locationChangeSaga);

  yield takeLatest(USER_ACTIONS.GOT_VK_USER, gotVkUserSaga);
  yield takeLatest(USER_ACTIONS.KEY_PRESSED, keyPressedSaga);

  // yield takeLatest(USER_ACTIONS.SET_TITLE, setTitleSaga);

  yield takeLatest(
    [USER_ACTIONS.SEARCH_SET_TITLE, USER_ACTIONS.SEARCH_SET_DISTANCE],
    searchSetSaga
  );

  yield takeLatest(USER_ACTIONS.OPEN_MAP_DIALOG, openMapDialogSaga);
  yield takeLatest(USER_ACTIONS.SEARCH_SET_TAB, searchSetTabSaga);
  yield takeLatest(USER_ACTIONS.SET_USER, setUserSaga);

  yield takeLatest(USER_ACTIONS.GET_GPX_TRACK, getGPXTrackSaga);
  yield takeLatest(USER_ACTIONS.MAPS_LOAD_MORE, mapsLoadMoreSaga);

  yield takeLatest(USER_ACTIONS.DROP_ROUTE, dropRouteSaga);
  yield takeLatest(USER_ACTIONS.MODIFY_ROUTE, modifyRouteSaga);
  yield takeLatest(USER_ACTIONS.TOGGLE_ROUTE_STARRED, toggleRouteStarredSaga);
}
