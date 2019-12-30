import { takeEvery, select, put } from "redux-saga/effects";
import { MAP_ACTIONS } from "./constants";
import { mapClicked, mapSet } from "./actions";
import { selectUserMode, selectUserActiveSticker } from "$redux/user/selectors";
import { IRootReducer } from "$redux/user";
import { MODES } from "$constants/modes";
import { selectMapStickers } from "./selectors";
import { setActiveSticker, setMode } from "$redux/user/actions";

function* onMapClick({ latlng }: ReturnType<typeof mapClicked>) {
  const mode = yield select(selectUserMode);
  const { set, sticker } = yield select(selectUserActiveSticker);
  const stickers = yield select(selectMapStickers);

  switch (mode) {
    case MODES.STICKERS:
      yield put(
        mapSet({
          stickers: [
            ...stickers,
            {
              latlng,
              set,
              sticker,
              text: "",
              angle: 0,
            }
          ]
        })
      );
      yield put(setMode(MODES.NONE))
      break;

    default:
  }
}

export function* mapSaga() {
  yield takeEvery(MAP_ACTIONS.MAP_CLICKED, onMapClick);
}
