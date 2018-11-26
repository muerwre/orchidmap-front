import { REHYDRATE } from 'redux-persist';
import { takeLatest, select, call, put, takeEvery } from 'redux-saga/effects';
import { checkUserToken, getGuestToken, getStoredMap } from '$utils/api';
import { setEditing, setMode, setUser } from '$redux/user/actions';
import { getUrlData, pushPath } from '$utils/history';
import { editor } from '$modules/Editor';
import { ACTIONS } from '$redux/user/constants';
import { MODES } from '$constants/modes';

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

  console.log('RURL', random_url);
  pushPath(`/${random_url}/edit`);

  editor.owner = id;
  editor.startEditing();

  return hideLoader();

  // todo: this.clearChanged();
}

function* mapInitSaga() {
  const { path, mode } = getUrlData();

  if (path) {
    const map = yield call(getStoredMap, { name: path });

    if (map) {
      // todo: this.clearChanged();
      editor.setData(map);

      if (mode && mode === 'edit') {
        editor.startEditing();
      } else {
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

function* startEditingSaga() {
  yield editor.startEditing();
  yield put(setEditing(true));
}

function* stopEditingSaga() {
  const { changed } = yield select(getState);

  if (!changed) {
    yield editor.cancelEditing();
    yield put(setEditing(false));
    yield put(setMode(MODES.NONE));
  } else {
    // editor.changeMode(MODES.CONFIRM_CANCEL);
    // this.props.setMode(MODES.CONFIRM_CANCEL);
    yield put(setMode(MODES.CONFIRM_CANCEL));
  }
}

export function* userSaga() {
  // Login
  // yield takeLatest(AUTH_ACTIONS.SEND_LOGIN_REQUEST, sendLoginRequestSaga);
  yield takeLatest(REHYDRATE, authChechSaga);
  yield takeEvery(ACTIONS.SET_MODE, setModeSaga);

  yield takeEvery(ACTIONS.START_EDITING, startEditingSaga);
  yield takeEvery(ACTIONS.STOP_EDITING, stopEditingSaga);
}
