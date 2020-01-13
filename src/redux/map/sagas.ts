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
  editorSendSaveRequest,
  editorSetSave,
  editorClearAll,
} from '~/redux/editor/actions';
import { pushLoaderState, getUrlData, pushPath, replacePath } from '~/utils/history';
import { searchSetSagaWorker } from '~/redux/user/sagas';
import { getStoredMap, postMap } from '~/utils/api';
import { Unwrap } from '~/utils/middleware';
import { selectMap, selectMapProvider } from './selectors';
import { TIPS } from '~/constants/tips';
import { delay } from 'redux-saga';
import { setReadySaga } from '../editor/sagas';
import { selectEditor } from '../editor/selectors';
import { EDITOR_ACTIONS } from '../editor/constants';
import { MainMap } from '~/constants/map';

function* onMapClick({ latlng }: ReturnType<typeof mapClicked>) {
  const {
    mode,
    activeSticker: { set, sticker },
  }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  switch (mode) {
    case MODES.STICKERS:
      yield put(mapAddSticker({ latlng, set, sticker, text: '', angle: 2.11 }));
      yield put(editorSetMode(MODES.NONE));
      break;

    default:
  }
}

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
    yield put(
      mapSet({
        provider: route.provider,
        route: route.route,
        stickers: route.stickers,
        title: route.title,
        address: route.address,
        description: route.description,
        is_public: route.is_public,
        logo: route.logo,
      })
    );

    return { route, random_url };
  }

  return null;
}

export function* startEmptyEditorSaga() {
  yield put(editorSetReady(false));

  const {
    user: { id, random_url },
  }: ReturnType<typeof selectUser> = yield select(selectUser);

  const { path, mode } = getUrlData();

  if (!path || !mode || mode !== 'edit') {
    pushPath(`/${random_url}/edit`);
  }

  yield put(editorClearAll());
  yield put(mapSet({ owner: { id } }));
  yield put(editorSetEditing(true));
  yield put(editorSetReady(true));
}

export function* loadMapFromPath() {
  const { path, mode } = getUrlData();

  if (path) {
    const map = yield call(loadMapSaga, path);

    if (!map) {
      yield call(startEmptyEditorSaga);
      return;
    }

    yield put(editorSetEditing(mode && mode === 'edit'));
    return;
  }

  yield call(startEmptyEditorSaga);
}

export function* mapInitSaga() {
  pushLoaderState(90);

  const { hash } = getUrlData();
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

  yield call(loadMapFromPath);
  yield call(setReadySaga);
  MainMap.fitBounds(MainMap.getVisibleBounds(), { animate: false });
  pushLoaderState(100);
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

function* clearPolySaga() {
  yield put(
    mapSet({
      route: [],
    })
  );
}

function* clearStickersSaga() {
  yield put(
    mapSet({
      stickers: [],
    })
  );
}

function* clearAllSaga() {
  yield put(editorSetChanged(false));
  yield put(
    mapSet({
      route: [],
      stickers: [],
    })
  );
}

function* clearSaga({ type }) {
  switch (type) {
    case EDITOR_ACTIONS.CLEAR_POLY:
      yield call(clearPolySaga);
      break;

    case EDITOR_ACTIONS.CLEAR_STICKERS:
      yield call(clearStickersSaga);
      break;

    case EDITOR_ACTIONS.CLEAR_ALL:
      yield call(clearAllSaga);
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
    return yield put(
      editorSetSave({ error: TIPS.SAVE_EMPTY, loading: false, overwriting: false, finished: false })
    );
  }

  const { logo }: ReturnType<typeof selectMap> = yield select(selectMap);
  const { distance }: ReturnType<typeof selectEditor> = yield select(selectEditor);
  const { token }: ReturnType<typeof selectUserUser> = yield select(selectUserUser);

  yield put(editorSetSave({ loading: true, overwriting: false, finished: false, error: null }));

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

  yield put(editorSetSave({ loading: false }));

  if (cancel) return yield put(editorSetMode(MODES.NONE));

  if (result && result.data.code === 'already_exist')
    return yield put(editorSetSave({ overwriting: true }));

  if (result && result.data.code === 'conflict')
    return yield put(
      editorSetSave({
        error: TIPS.SAVE_EXISTS,
        loading: false,
        overwriting: false,
        finished: false,
      })
    );

  if (timeout || !result || !result.data.route || !result.data.route.address)
    return yield put(
      editorSetSave({
        error: TIPS.SAVE_TIMED_OUT,
        loading: false,
        overwriting: false,
        finished: false,
      })
    );

  yield put(
    mapSet({
      address: result.data.route.address,
      title: result.data.route.title,
      is_public: result.data.route.is_public,
      description: result.data.route.description,
    })
  );

  yield put(editorSetReady(false));
  pushPath(`/${address}/edit`);
  yield put(editorSetReady(true));

  yield put(
    editorSetSave({
      error: TIPS.SAVE_SUCCESS,
      loading: false,
      overwriting: false,
      finished: true,
    })
  );
}

export function* mapSaga() {
  // TODO: setChanged on set route, logo, provider, stickers
  yield takeEvery(EDITOR_ACTIONS.START_EDITING, startEditingSaga);
  yield takeEvery(EDITOR_ACTIONS.SET_ACTIVE_STICKER, setActiveStickerSaga);
  yield takeEvery(MAP_ACTIONS.MAP_CLICKED, onMapClick);
  yield takeEvery(MAP_ACTIONS.SET_TITLE, setTitleSaga);
  yield takeLatest(EDITOR_ACTIONS.SEND_SAVE_REQUEST, sendSaveRequestSaga);
  // yield takeLatest(EDITOR_ACTIONS.SET_SAVE_SUCCESS, setSaveSuccessSaga);

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
