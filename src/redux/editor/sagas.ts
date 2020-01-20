import { call, put, takeEvery, takeLatest, select, race, delay } from 'redux-saga/effects';
import { selectEditor, selectEditorMode } from '~/redux/editor/selectors';
import { simplify } from '~/utils/simplify';
import {
  editorHideRenderer,
  editorSetChanged,
  editorSetMode,
  editorSetReady,
  editorSetRenderer,
  editorSetDialogActive,
  editorClearAll,
  editorSetFeature,
  editorLocationChanged,
  editorKeyPressed,
  editorSetSave,
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
import { selectMap, selectMapRoute } from '../map/selectors';
import { selectUser } from '../user/selectors';
import { LOGOS } from '~/constants/logos';
import { loadMapFromPath } from '../map/sagas';
import { mapClicked, mapSetRoute } from '../map/actions';
import { MAP_ACTIONS } from '../map/constants';
import { OsrmRouter } from '~/utils/map/OsrmRouter';
import path from 'ramda/es/path';
import { MainMap } from '~/constants/map';
import { EDITOR_INITIAL_STATE } from '.';

const hideLoader = () => {
  document.getElementById('loader').style.opacity = String(0);
  document.getElementById('loader').style.pointerEvents = 'none';

  return true;
};

function* stopEditingSaga() {
  const { changed, mode }: ReturnType<typeof selectEditor> = yield select(selectEditor);
  const { path } = getUrlData();

  if (changed && mode !== MODES.CONFIRM_CANCEL) {
    yield put(editorSetMode(MODES.CONFIRM_CANCEL));
    return;
  }

  yield put(editorSetMode(MODES.NONE));
  yield put(editorSetChanged(false));
  yield put(editorSetReady(true));

  yield pushPath(`/${path}/`);
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
  const { distance }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  const canvas = <HTMLCanvasElement>document.getElementById('renderer');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const geometry = getTilePlacement();
  const points = getPolyPlacement(route);
  const sticker_points = getStickersPlacement(stickers);

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
  const { ready }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  if (!ready) return;

  const mode: ReturnType<typeof selectEditorMode> = yield select(selectEditorMode);

  if (mode !== MODES.NONE) {
    yield put(editorSetMode(MODES.NONE));
  }

  yield call(loadMapFromPath);
  MainMap.fitVisibleBounds({ animate: true });
}

function* keyPressedSaga({ key, target }: ReturnType<typeof editorKeyPressed>) {
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

function* getGPXTrackSaga() {
  const { route, stickers, title, address }: ReturnType<typeof selectMap> = yield select(selectMap);

  if (!route.length && !stickers.length) return;

  const track = getGPXString({ route, stickers, title: title || address });

  return downloadGPXTrack({ track, title });
}

function* routerCancel() {
  yield put(editorSetMode(MODES.NONE));
}

function* mapClick({ latlng }: ReturnType<typeof mapClicked>) {
  const { mode }: ReturnType<typeof selectEditor> = yield select(selectEditor);

  if (mode === MODES.ROUTER) {
    const wp = OsrmRouter.getWaypoints().filter(point => !!point.latLng);
    OsrmRouter.setWaypoints([...wp, latlng]);
  }
}

function* routerSubmit() {
  const route: ReturnType<typeof selectMapRoute> = yield select(selectMapRoute);
  const latlngs: LatLng[] = path(['_routes', 0, 'coordinates'], OsrmRouter);

  const coordinates = simplify({ map: MainMap, latlngs });

  yield put(mapSetRoute([...route, ...coordinates]));
  OsrmRouter.setWaypoints([]);
  yield put(editorSetMode(MODES.NONE));
}

function* cancelSave() {
  yield put(
    editorSetSave({
      ...EDITOR_INITIAL_STATE.save,
    })
  );
}

export function* editorSaga() {
  yield takeEvery(EDITOR_ACTIONS.LOCATION_CHANGED, locationChangeSaga);

  yield takeEvery(EDITOR_ACTIONS.STOP_EDITING, stopEditingSaga);
  yield takeLatest(EDITOR_ACTIONS.TAKE_A_SHOT, takeAShotSaga);
  yield takeLatest(EDITOR_ACTIONS.CROP_A_SHOT, cropAShotSaga);
  yield takeLatest(EDITOR_ACTIONS.KEY_PRESSED, keyPressedSaga);
  yield takeLatest(EDITOR_ACTIONS.GET_GPX_TRACK, getGPXTrackSaga);
  yield takeLatest(EDITOR_ACTIONS.ROUTER_CANCEL, routerCancel);
  yield takeLatest(MAP_ACTIONS.MAP_CLICKED, mapClick);
  yield takeLatest(EDITOR_ACTIONS.ROUTER_SUBMIT, routerSubmit);
  yield takeLatest(EDITOR_ACTIONS.CANCEL_SAVE, cancelSave);
}
