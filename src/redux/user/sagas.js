import { REHYDRATE } from 'redux-persist';
import { takeLatest, select, call, put, takeEvery } from 'redux-saga/effects';
import { checkUserToken, getGuestToken, getStoredMap } from '$utils/api';
import { setActiveSticker, setChanged, setEditing, setMode, setUser } from '$redux/user/actions';
import { getUrlData, pushPath } from '$utils/history';
import { editor } from '$modules/Editor';
import { ACTIONS } from '$redux/user/constants';
import { MODES } from '$constants/modes';
import { DEFAULT_USER } from '$constants/auth';

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

}
