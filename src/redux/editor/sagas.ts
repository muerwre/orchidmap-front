import { call, put, takeEvery, takeLatest, select, race } from 'redux-saga/effects';
import { delay, SagaIterator } from 'redux-saga';
import { selectEditor } from '~/redux/editor/selectors';

import {
  editorHideRenderer,
  editorSetChanged,
  editorSetEditing,
  editorSetMode,
  editorSetReady,
  editorSetRenderer,
  editorSetDialog,
  editorSetDialogActive,
  editorClearAll,
  editorSetFeature,
  editorLocationChanged,
  editorKeyPressed,
} from '~/redux/editor/actions';
import { getUrlData, pushPath } from '~/utils/history';
import { MODES } from '~/constants/modes';
import { checkOSRMService } from '~/utils/api';
import { LatLng } from 'leaflet';
import { searchSetTab } from '../user/actions';
import { TABS } from '~/constants/dialogs';
import { EDITOR_ACTIONS } from './constants';
import { getGPXString, downloadGPXTrack } from '~/utils/gpx';
import {
  getTilePlacement,
  getPolyPlacement,
  getStickersPlacement,
  fetchImages,
  composeArrows,
  composeDistMark,
  composeImages,
  composePoly,
  composeStickers,
  imageFetcher,
  downloadCanvas,
} from '~/utils/renderer';
import { selectMap } from '../map/selectors';
import { selectUser } from '../user/selectors';
import { LOGOS } from '~/constants/logos';
import { loadMapSaga, replaceAddressIfItsBusy } from '../map/sagas';
import { mapSetAddressOrigin } from '../map/actions';

const hideLoader = () => {
  document.getElementById('loader').style.opacity = String(0);
  document.getElementById('loader').style.pointerEvents = 'none';

  return true;
};

function* stopEditingSaga() {
  const { changed, editing, mode }: ReturnType<typeof selectEditor> = yield select(selectEditor);
  const { address_origin }: ReturnType<typeof selectMap> = yield select(selectMap);
  const { path } = getUrlData();

  if (!editing) return;
  if (changed && mode !== MODES.CONFIRM_CANCEL) {
    yield put(editorSetMode(MODES.CONFIRM_CANCEL));
    return;
  }

  yield put(editorSetMode(MODES.NONE));
  yield put(editorSetChanged(false));

  yield pushPath(`/${address_origin || path}/`);
}

function* checkOSRMServiceSaga() {
  const routing = yield call(checkOSRMService, [new LatLng(1, 1), new LatLng(2, 2)]);

  yield put(editorSetFeature({ routing }));
}

export function* setReadySaga() {
  yield put(editorSetReady(true));
  hideLoader();

  yield call(checkOSRMServiceSaga);
  yield put(searchSetTab(TABS.MY));
}

function* getRenderData() {
  yield put(editorSetRenderer({ info: 'Загрузка тайлов', progress: 0.1 }));

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

  yield put(editorSetRenderer({ info: 'Отрисовка', progress: 0.5 }));

  yield composeImages({ geometry, images, ctx });
  yield composePoly({ points, ctx });
  yield composeArrows({ points, ctx });
  yield composeDistMark({ ctx, points, distance });
  yield composeStickers({ stickers: sticker_points, ctx });

  yield put(editorSetRenderer({ info: 'Готово', progress: 1 }));

  return yield canvas.toDataURL('image/jpeg');
}

function* takeAShotSaga() {
  const worker = call(getRenderData);

  const { result, timeout } = yield race({
    result: worker,
    timeout: delay(500),
  });

  if (timeout) yield put(editorSetMode(MODES.SHOT_PREFETCH));

  const data = yield result || worker;

  yield put(editorSetMode(MODES.NONE));
  yield put(
    editorSetRenderer({
      data,
      renderer_active: true,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  );
}

function* getCropData({ x, y, width, height }) {
  const { logo }: ReturnType<typeof selectMap> = yield select(selectMap);
  const {
    renderer: { data },
  }: ReturnType<typeof selectEditor> = yield select(selectEditor);

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
  const { title, address }: ReturnType<typeof selectMap> = yield select(selectMap);

  yield call(getCropData, params);
  const canvas = document.getElementById('renderer') as HTMLCanvasElement;

  downloadCanvas(canvas, (title || address).replace(/\./gi, ' '));

  return yield put(editorHideRenderer());
}

function* locationChangeSaga({ location }: ReturnType<typeof editorLocationChanged>) {
  const {
    user: { id, random_url },
  }: ReturnType<typeof selectUser> = yield select(selectUser);

  const { ready }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  const { owner, address }: ReturnType<typeof selectMap> = yield select(selectMap);

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
    yield put(mapSetAddressOrigin(''));
  }

  if (mode !== 'edit') {
    yield put(editorSetEditing(false));
    // editor.stopEditing();
  } else {
    yield put(editorSetEditing(true));
    // editor.startEditing();
  }
}

function* keyPressedSaga({ key, target }: ReturnType<typeof editorKeyPressed>): any {
  if (target === 'INPUT' || target === 'TEXTAREA') {
    return;
  }

  if (key === 'Escape') {
    const {
      dialog_active,
      mode,
      renderer: { renderer_active },
    }: ReturnType<typeof selectEditor> = yield select(selectEditor);

    if (renderer_active) return yield put(editorHideRenderer());
    if (dialog_active) return yield put(editorSetDialogActive(false));
    if (mode !== MODES.NONE) return yield put(editorSetMode(MODES.NONE));
  } else if (key === 'Delete') {
    const { editing } = yield select(selectEditor);

    if (!editing) return;

    const { mode } = yield select(selectUser);

    if (mode === MODES.TRASH) {
      yield put(editorClearAll());
    } else {
      yield put(editorSetMode(MODES.TRASH));
    }
  }
}

function* getGPXTrackSaga(): SagaIterator {
  const { route, stickers, title, address }: ReturnType<typeof selectMap> = yield select(selectMap);
  // const { title, address }:  = yield select(selectUser);

  if (!route || route.length <= 0) return;

  const track = getGPXString({ route, stickers, title: title || address });

  return downloadGPXTrack({ track, title });
}

export function* editorSaga() {
  yield takeEvery(EDITOR_ACTIONS.STOP_EDITING, stopEditingSaga);
  yield takeLatest(EDITOR_ACTIONS.TAKE_A_SHOT, takeAShotSaga);
  yield takeLatest(EDITOR_ACTIONS.CROP_A_SHOT, cropAShotSaga);
  yield takeLatest(EDITOR_ACTIONS.LOCATION_CHANGED, locationChangeSaga);
  yield takeLatest(EDITOR_ACTIONS.KEY_PRESSED, keyPressedSaga);
  yield takeLatest(EDITOR_ACTIONS.GET_GPX_TRACK, getGPXTrackSaga);
}
