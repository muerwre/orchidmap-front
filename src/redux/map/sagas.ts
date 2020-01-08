import { takeEvery, select, put, call, TakeEffect, race, take, takeLatest } from 'redux-saga/effects';
import { MAP_ACTIONS } from './constants';
import { mapClicked, mapAddSticker, mapSetProvider, mapSet, mapSetTitle, mapSetAddress, mapSetDescription, mapSetOwner, mapSetPublic } from './actions';
import { selectUserMode, selectUserActiveSticker, selectUser, selectUserUser } from '~/redux/user/selectors';
import { MODES } from '~/constants/modes';
import {
  setMode,
  setChanged,
  setAddressOrigin,
  setEditing,
  setReady,
  setActiveSticker,
  setSaveError,
  setSaveLoading,
  sendSaveRequest,
  setSaveSuccess,
  setSaveOverwrite,
} from '~/redux/user/actions';
import { pushLoaderState, getUrlData, pushPath, replacePath } from '~/utils/history';
import { setReadySaga, searchSetSagaWorker } from '~/redux/user/sagas';
import { getStoredMap, postMap } from '~/utils/api';
import { Unwrap } from '~/utils/middleware';
import { DEFAULT_PROVIDER } from '~/constants/providers';
import { USER_ACTIONS } from '~/redux/user/constants';
import { selectMap } from './selectors';
import { TIPS } from '~/constants/tips';
import { delay } from 'redux-saga';

function* onMapClick({ latlng }: ReturnType<typeof mapClicked>) {
  const mode = yield select(selectUserMode);
  const { set, sticker } = yield select(selectUserActiveSticker);

  switch (mode) {
    case MODES.STICKERS:
      yield put(mapAddSticker({ latlng, set, sticker, text: '', angle: 0 }));
      yield put(setMode(MODES.NONE));
      break;

    default:
  }
}

// function* changeProviderSaga({ provider }: ReturnType<typeof changeProvider>) {
//   const { provider: current_provider } = yield select(selectUser);

//   yield put(mapSetProvider(provider));

//   if (current_provider === provider) return;

//   yield put(setChanged(true));

//   return put(setMode(MODES.NONE));
// }

// function* setLogoSaga({ logo }: { type: string; logo: string }) {
//   const { mode } = yield select(selectUser);

//   yield put(setChanged(true));

//   if (mode === MODES.LOGO) {
//     yield put(setMode(MODES.NONE));
//   }
// }

export function* replaceAddressIfItsBusy(destination, original) {
  if (original) {
    yield put(setAddressOrigin(original));
  }

  pushPath(`/${destination}/edit`);
}

export function* loadMapSaga(path) {
  const {
    data: { route, error, random_url },
  }: Unwrap<typeof getStoredMap> = yield call(getStoredMap, { name: path });

  if (route && !error) {
    // TODO: set initial data
    // TODO: fit bounds

    yield put(
      mapSet({
        provider: route.provider,
        route: route.route,
        stickers: route.stickers,
        title: route.title,
      })
    );

    return { route, random_url };
  }

  return null;
}

function* startEmptyEditorSaga() {
  const {
    user: { id, random_url },
    provider = DEFAULT_PROVIDER,
  } = yield select(selectUser);

  // TODO: set owner { id }
  pushPath(`/${random_url}/edit`);

  yield put(setChanged(false));
  yield put(setEditing(true));

  return yield call(setReadySaga);
}

export function* mapInitSaga() {
  pushLoaderState(90);

  const { path, mode, hash } = getUrlData();
  const {
    provider,
    user: { id },
  } = yield select(selectUser);

  yield put(mapSetProvider(provider));

  if (hash && /^#map/.test(hash)) {
    const [, newUrl] = hash.match(/^#map[:/?!](.*)$/);

    if (newUrl) {
      yield pushPath(`/${newUrl}`);
      yield call(setReadySaga);
      return;
    }
  }

  if (path) {
    const map = yield call(loadMapSaga, path);

    if (map && map.route) {
      if (mode && mode === 'edit') {
        if (map && map.route && map.route.owner && mode === 'edit' && map.route.owner !== id) {
          yield call(setReadySaga);
          yield call(replaceAddressIfItsBusy, map.random_url, map.address);
        } else {
          yield put(setAddressOrigin(''));
        }

        yield put(setEditing(true));
        // TODO: start editing
      } else {
        yield put(setEditing(false));
        // TODO: stop editing
      }

      yield call(setReadySaga);
      return true;
    }
  }

  yield call(startEmptyEditorSaga);
  yield put(setReady(true));

  pushLoaderState(100);

  return true;
}

function* setActiveStickerSaga() {
  yield put(setMode(MODES.STICKERS));
}

function* setTitleSaga({ title }: ReturnType<typeof mapSetTitle>) {
  if (title) {
    document.title = `${title} | Редактор маршрутов`;
  }
}

function* clearSaga({ type }) {
  switch (type) {
    case USER_ACTIONS.CLEAR_POLY:
      // TODO: clear router waypoints
      yield put(
        mapSet({
          route: [],
        })
      );
      break;

    case USER_ACTIONS.CLEAR_STICKERS:
      yield put(
        mapSet({
          stickers: [],
        })
      );
      break;

    case USER_ACTIONS.CLEAR_ALL:
      yield put(setChanged(false));
      yield put(
        mapSet({
          route: [],
          stickers: [],
        })
      );
      break;

    default:
      break;
  }

  yield put(setActiveSticker(null)); // TODO: move to maps
  yield put(setMode(MODES.NONE));
}

function* sendSaveRequestSaga({
  title,
  address,
  force,
  is_public,
  description,
}: ReturnType<typeof sendSaveRequest>) {
  const { route, stickers, provider } = yield select(selectMap);

  if (!route.length && !stickers.length) {
    return yield put(setSaveError(TIPS.SAVE_EMPTY)); // TODO: move setSaveError to editor
  }

  const { logo, distance } = yield select(selectUser);
  const { token } = yield select(selectUserUser);

  yield put(setSaveLoading(true)); // TODO: move setSaveLoading to maps

  const {
    result,
    timeout,
    cancel,
  }: {
    result: Unwrap<typeof postMap>;
    timeout: boolean;
    cancel: TakeEffect;
  } = yield race({
    result: postMap({
      token,
      route,
      stickers,
      title,
      force,
      address,
      logo,
      distance,
      provider,
      is_public,
      description,
    }),
    timeout: delay(10000),
    cancel: take(USER_ACTIONS.RESET_SAVE_DIALOG),
  });

  yield put(setSaveLoading(false));

  if (cancel) return yield put(setMode(MODES.NONE));

  if (result && result.data.code === 'already_exist') return yield put(setSaveOverwrite()); // TODO: move setSaveOverwrite to editor
  if (result && result.data.code === 'conflict') return yield put(setSaveError(TIPS.SAVE_EXISTS));
  if (timeout || !result || !result.data.route || !result.data.route.address)
    return yield put(setSaveError(TIPS.SAVE_TIMED_OUT));

  return yield put( // TODO: move setSaveSuccess to editor
    setSaveSuccess({
      address: result.data.route.address,
      title: result.data.route.title,
      is_public: result.data.route.is_public,
      description: result.data.route.description,

      save_error: TIPS.SAVE_SUCCESS,
    })
  );
}

function* setSaveSuccessSaga({
  address,
  title,
  is_public,
  description,
}: ReturnType<typeof setSaveSuccess>) {
  const { id } = yield select(selectUser);
  const { dialog_active } = yield select(selectUser);

  replacePath(`/${address}/edit`);

  yield put(mapSetTitle(title));
  yield put(mapSetAddress(address));
  yield put(mapSetPublic(is_public));
  yield put(mapSetDescription(description));
  yield put(setChanged(false));
  yield put(mapSetOwner({ id }));

  if (dialog_active) {
    yield call(searchSetSagaWorker);
  }

  // yield editor.setInitialData();
  // TODO: set initial data here
  
  return
}

export function* mapSaga() {
  // TODO: setChanged on set route, logo, provider, stickers
  
  yield takeEvery(USER_ACTIONS.SET_ACTIVE_STICKER, setActiveStickerSaga); // TODO: move active sticker to maps
  yield takeEvery(MAP_ACTIONS.MAP_CLICKED, onMapClick);
  yield takeEvery(MAP_ACTIONS.SET_TITLE, setTitleSaga);
  // yield takeEvery(USER_ACTIONS.SET_LOGO, setLogoSaga);
  yield takeLatest(USER_ACTIONS.SEND_SAVE_REQUEST, sendSaveRequestSaga);
  yield takeLatest(USER_ACTIONS.SET_SAVE_SUCCESS, setSaveSuccessSaga);

  yield takeEvery(
    // TODO: move all actions to MAP
    [
      USER_ACTIONS.CLEAR_POLY,
      USER_ACTIONS.CLEAR_STICKERS,
      USER_ACTIONS.CLEAR_ALL,
      USER_ACTIONS.CLEAR_CANCEL,
    ],
    clearSaga
  );
}
