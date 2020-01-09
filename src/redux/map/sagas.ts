import {
  takeEvery,
  select,
  put,
  call,
  TakeEffect,
  race,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { MAP_ACTIONS } from './constants';
import {
  mapClicked,
  mapAddSticker,
  mapSetProvider,
  mapSet,
  mapSetTitle,
  mapSetAddressOrigin,
} from './actions';
import { selectUser, selectUserUser } from '~/redux/user/selectors';
import { MODES } from '~/constants/modes';
import {
  editorSetMode,
  editorSetChanged,
  editorSetEditing,
  editorSetReady,
  editorSetActiveSticker,
  editorSetSaveError,
  editorSetSaveLoading,
  editorSendSaveRequest,
  editorSetSaveSuccess,
  editorSetSaveOverwrite,
} from '~/redux/editor/actions';
import { pushLoaderState, getUrlData, pushPath, replacePath } from '~/utils/history';
import { searchSetSagaWorker } from '~/redux/user/sagas';
import { getStoredMap, postMap } from '~/utils/api';
import { Unwrap } from '~/utils/middleware';
import { USER_ACTIONS } from '~/redux/user/constants';
import { selectMap, selectMapProvider } from './selectors';
import { TIPS } from '~/constants/tips';
import { delay } from 'redux-saga';
import { setReadySaga } from '../editor/sagas';
import { selectEditor } from '../editor/selectors';
import { EDITOR_ACTIONS } from '../editor/constants';

function* onMapClick({ latlng }: ReturnType<typeof mapClicked>) {
  const {
    mode,
    activeSticker: { set, sticker },
  }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  switch (mode) {
    case MODES.STICKERS:
      yield put(mapAddSticker({ latlng, set, sticker, text: '', angle: 0 }));
      yield put(editorSetMode(MODES.NONE));
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
    yield put(mapSetAddressOrigin(original));
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
  }: ReturnType<typeof selectUser> = yield select(selectUser);

  const provider: ReturnType<typeof selectMapProvider> = yield select(selectMapProvider);

  // TODO: set owner { id }
  pushPath(`/${random_url}/edit`);

  yield put(editorSetChanged(false));
  yield put(editorSetEditing(true));

  return yield call(setReadySaga);
}

export function* mapInitSaga() {
  pushLoaderState(90);

  const { path, mode, hash } = getUrlData();
  const {
    user: { id },
  }: ReturnType<typeof selectUser> = yield select(selectUser);
  const provider: ReturnType<typeof selectMapProvider> = yield select(selectMapProvider);

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
          yield put(mapSetAddressOrigin(''));
        }

        yield put(editorSetEditing(true));
      } else {
        yield put(editorSetEditing(false));
      }

      yield call(setReadySaga);
      return true;
    }
  }

  yield call(startEmptyEditorSaga);
  yield put(editorSetReady(true));

  pushLoaderState(100);

  return true;
}

function* setActiveStickerSaga() {
  yield put(editorSetMode(MODES.STICKERS));
}

function* setTitleSaga({ title }: ReturnType<typeof mapSetTitle>) {
  if (title) {
    document.title = `${title} | Редактор маршрутов`;
  }
}

function* startEditingSaga() {
  const { path } = getUrlData();
  yield pushPath(`/${path}/edit`);
}

function* clearSaga({ type }) {
  switch (type) {
    case EDITOR_ACTIONS.CLEAR_POLY:
      yield put(
        mapSet({
          route: [],
        })
      );
      break;

    case EDITOR_ACTIONS.CLEAR_STICKERS:
      yield put(
        mapSet({
          stickers: [],
        })
      );
      break;

    case EDITOR_ACTIONS.CLEAR_ALL:
      yield put(editorSetChanged(false));
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

  yield put(editorSetActiveSticker(null));
  yield put(editorSetMode(MODES.NONE));
}

function* sendSaveRequestSaga({
  title,
  address,
  force,
  is_public,
  description,
}: ReturnType<typeof editorSendSaveRequest>) {
  const { route, stickers, provider }: ReturnType<typeof selectMap> = yield select(selectMap);

  if (!route.length && !stickers.length) {
    return yield put(editorSetSaveError(TIPS.SAVE_EMPTY));
  }

  const { logo }: ReturnType<typeof selectMap> = yield select(selectMap);
  const { distance }: ReturnType<typeof selectEditor> = yield select(selectEditor);
  const { token }: ReturnType<typeof selectUserUser> = yield select(selectUserUser);

  yield put(editorSetSaveLoading(true)); 

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
    cancel: take(EDITOR_ACTIONS.RESET_SAVE_DIALOG),
  });

  yield put(editorSetSaveLoading(false));

  if (cancel) return yield put(editorSetMode(MODES.NONE));

  if (result && result.data.code === 'already_exist') return yield put(editorSetSaveOverwrite());
  if (result && result.data.code === 'conflict')
    return yield put(editorSetSaveError(TIPS.SAVE_EXISTS));
  if (timeout || !result || !result.data.route || !result.data.route.address)
    return yield put(editorSetSaveError(TIPS.SAVE_TIMED_OUT));

  return yield put(
    editorSetSaveSuccess({
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
}: ReturnType<typeof editorSetSaveSuccess>) {
  const { id }: ReturnType<typeof selectUserUser> = yield select(selectUserUser);
  const { dialog_active }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  replacePath(`/${address}/edit`);

  yield put(
    mapSet({
      title,
      address,
      is_public,
      description,
      owner: { id },
    })
  );

  yield put(editorSetChanged(false));

  if (dialog_active) {
    yield call(searchSetSagaWorker);
  }

  // yield editor.setInitialData();
  // TODO: set initial data here

  return;
}

export function* mapSaga() {
  // TODO: setChanged on set route, logo, provider, stickers
  yield takeEvery(EDITOR_ACTIONS.START_EDITING, startEditingSaga);
  yield takeEvery(EDITOR_ACTIONS.SET_ACTIVE_STICKER, setActiveStickerSaga);
  yield takeEvery(MAP_ACTIONS.MAP_CLICKED, onMapClick);
  yield takeEvery(MAP_ACTIONS.SET_TITLE, setTitleSaga);
  yield takeLatest(EDITOR_ACTIONS.SEND_SAVE_REQUEST, sendSaveRequestSaga);
  yield takeLatest(EDITOR_ACTIONS.SET_SAVE_SUCCESS, setSaveSuccessSaga);

  yield takeEvery(
    [
      EDITOR_ACTIONS.CLEAR_POLY,
      EDITOR_ACTIONS.CLEAR_STICKERS,
      EDITOR_ACTIONS.CLEAR_ALL,
      EDITOR_ACTIONS.CLEAR_CANCEL,
    ],
    clearSaga
  );
}
