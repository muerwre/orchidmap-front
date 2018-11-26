import { REHYDRATE } from 'redux-persist';
import { takeLatest, select, call, put } from 'redux-saga/effects';
import { checkUserToken, getGuestToken, getStoredMap } from '$utils/api';
import { setUser } from '$redux/user/actions';
import { getUrlData, pushPath } from '$utils/history';
import { editor } from '$modules/Editor';

const getUser = state => (state.user);
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

export function* userSaga() {
  // Login
  // yield takeLatest(AUTH_ACTIONS.SEND_LOGIN_REQUEST, sendLoginRequestSaga);
  yield takeLatest(REHYDRATE, authChechSaga);
}
