import { REHYDRATE } from 'redux-persist';
import { delay } from 'redux-saga';
import { takeLatest, select, call, put, takeEvery, race, take } from 'redux-saga/effects';
import { checkUserToken, getGuestToken, getStoredMap, postMap } from '$utils/api';
import {
  hideRenderer,
  setActiveSticker, setAddress,
  setChanged,
  setEditing,
  setMode, setRenderer,
  setSaveError,
  setSaveOverwrite, setSaveSuccess, setTitle,
  setUser
} from '$redux/user/actions';
import { getUrlData, pushPath } from '$utils/history';
import { editor } from '$modules/Editor';
import { ACTIONS } from '$redux/user/constants';
import { MODES } from '$constants/modes';
import { DEFAULT_USER } from '$constants/auth';
import { TIPS } from '$constants/tips';
import {
  composeImages,
  composePoly, downloadCanvas,
  fetchImages,
  getPolyPlacement,
  getTilePlacement,
  imageFetcher
} from '$utils/renderer';
import { LOGOS } from '$constants/logos';

const getUser = state => (state.user.user);
const getState = state => (state.user);

const hideLoader = () => {
  document.getElementById('loader').style.opacity = 0;
  document.getElementById('loader').style.pointerEvents = 'none';

  return true;
};

function* generateGuestSaga() {
  const user = yield call(getGuestToken);
  yield put(setUser(user));

  return user;
}

function* startEmptyEditorSaga() {
  const { id, random_url } = yield select(getUser);

  pushPath(`/${random_url}/edit`);

  editor.owner = id;
  editor.startEditing();

  yield put(setChanged(false));
  yield put(setEditing(true));

  return hideLoader();
}

function* startEditingSaga() {
  yield editor.startEditing();
  yield put(setEditing(true));
}

function* stopEditingSaga() {
  const { changed, editing, mode } = yield select(getState);

  if (!editing) return;
  if (changed && mode !== MODES.CONFIRM_CANCEL) {
    yield put(setMode(MODES.CONFIRM_CANCEL));
    return;
  }

  yield editor.cancelEditing();
  yield put(setMode(MODES.NONE));

  yield put(setChanged(false));

  yield put(setEditing(editor.hasEmptyHistory())); // don't close editor if no previous map
}

function* mapInitSaga() {
  const { path, mode } = getUrlData();

  if (path) {
    const map = yield call(getStoredMap, { name: path });

    if (map) {
      yield editor.setData(map);
      yield editor.fitDrawing();
      yield put(setChanged(false));

      if (mode && mode === 'edit') {
        yield call(startEditingSaga);
        // yield put(setEditing(true));
        // editor.startEditing();
      } else {
        yield put(setEditing(false));
        // yield call(stopEditingSaga);
        editor.stopEditing();
      }

      return hideLoader();
    }
  }

  return yield call(startEmptyEditorSaga);
}

function* authChechSaga() {
  const { id, token } = yield select(getUser);

  if (id && token) {
    const user = yield call(checkUserToken, { id, token });

    if (user && user.success) {
      yield put(setUser(user));
      return yield call(mapInitSaga);
    }
  }

  yield call(generateGuestSaga);
  return yield call(mapInitSaga);
}

function* setModeSaga({ mode }) {
  return yield editor.changeMode(mode);
  // console.log('change', mode);
}

function* userLogoutSaga() {
  const { id } = yield select(getUser);

  if (id === editor.owner) {
    editor.owner = null;
  }

  yield put(setUser(DEFAULT_USER));
  yield call(generateGuestSaga);
}

function* setActiveStickerSaga({ activeSticker }) {
  yield editor.activeSticker = activeSticker;
  return true;
}

function* setLogoSaga({ logo }) {
  const { mode } = yield select(getState);
  editor.logo = logo;

  if (mode === MODES.LOGO) {
    yield put(setMode(MODES.NONE));
  }
}

function* routerCancelSaga() {
  yield call(editor.router.cancelDrawing);
  yield put(setMode(MODES.NONE));

  return true;
}

function* routerSubmitSaga() {
  yield call(editor.router.submitDrawing);
  yield put(setMode(MODES.NONE));

  return true;
}

function* clearSaga({ type }) {
  switch (type) {
    case ACTIONS.CLEAR_POLY:
      yield editor.poly.clearAll();
      yield editor.router.clearAll();
      break;

    case ACTIONS.CLEAR_STICKERS:
      yield editor.stickers.clearAll();
      break;

    case ACTIONS.CLEAR_ALL:
      yield editor.clearAll();
      yield put(setChanged(false));
      break;

    default: break;
  }

  yield put(setActiveSticker(null));
  yield put(setMode(MODES.NONE));
}

function* sendSaveRequestSaga({ title, address, force }) {
  if (editor.isEmpty()) {
    return yield put(setSaveError(TIPS.SAVE_EMPTY));
  }

  const { route, stickers } = editor.dumpData();
  const { id, token } = yield select(getUser);

  const { result, timeout, cancel } = yield race({
    result: postMap({
      id, token, route, stickers, title, force, address
    }),
    timeout: delay(10000),
    cancel: take(ACTIONS.RESET_SAVE_DIALOG),
  });

  if (cancel) return yield put(setMode(MODES.NONE));
  if (result && result.mode === 'overwriting') return yield put(setSaveOverwrite());
  if (timeout || !result || !result.success || !result.address) return yield put(setSaveError(TIPS.SAVE_TIMED_OUT));

  return yield put(setSaveSuccess({ address: result.address, save_error: TIPS.SAVE_SUCCESS, title }));
}

function* setSaveSuccessSaga({ address, title }) {
  const { id } = yield select(getUser);

  pushPath(`/${address}/edit`);
  yield put(setTitle(title));
  yield put(setAddress(address));
  // yield editor.setAddress(address);
  yield editor.owner = id;

  return yield editor.setInitialData();
}

function* getRenderData() {
  const canvas = document.getElementById('renderer');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const geometry = getTilePlacement();
  const points = getPolyPlacement();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const images = yield fetchImages(ctx, geometry);
  yield composeImages({ geometry, images, ctx });
  yield composePoly({ points, ctx });

  return yield canvas.toDataURL('image/jpeg');
}

function* takeAShotSaga() {
  const data = yield call(getRenderData);

  yield put(setRenderer({
    data, renderer_active: true, width: window.innerWidth, height: window.innerHeight
  }));

  return true;
}


function* getCropData({
  x, y, width, height
}) {
  const { logo, renderer: { data } } = yield select(getState);
  const canvas = document.getElementById('renderer');
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
  const { title, address } = yield select(getState);
  yield call(getCropData, params);
  const canvas = document.getElementById('renderer');

  downloadCanvas(canvas, (title || address));

  return yield put(hideRenderer());
}

export function* userSaga() {
  // ASYNCHRONOUS!!! :-)

  yield takeLatest(REHYDRATE, authChechSaga);
  yield takeEvery(ACTIONS.SET_MODE, setModeSaga);

  yield takeEvery(ACTIONS.START_EDITING, startEditingSaga);
  yield takeEvery(ACTIONS.STOP_EDITING, stopEditingSaga);

  yield takeEvery(ACTIONS.USER_LOGOUT, userLogoutSaga);
  yield takeEvery(ACTIONS.SET_ACTIVE_STICKER, setActiveStickerSaga);
  yield takeEvery(ACTIONS.SET_LOGO, setLogoSaga);

  yield takeEvery(ACTIONS.ROUTER_CANCEL, routerCancelSaga);
  yield takeEvery(ACTIONS.ROUTER_SUBMIT, routerSubmitSaga);
  yield takeEvery([
    ACTIONS.CLEAR_POLY,
    ACTIONS.CLEAR_STICKERS,
    ACTIONS.CLEAR_ALL,
    ACTIONS.CLEAR_CANCEL,
  ], clearSaga);

  yield takeLatest(ACTIONS.SEND_SAVE_REQUEST, sendSaveRequestSaga);
  yield takeLatest(ACTIONS.SET_SAVE_SUCCESS, setSaveSuccessSaga);
  yield takeLatest(ACTIONS.TAKE_A_SHOT, takeAShotSaga);
  yield takeLatest(ACTIONS.CROP_A_SHOT, cropAShotSaga);
}
