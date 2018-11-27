import { Map } from '$modules/Map';
import { Poly } from '$modules/Poly';
import { MODES } from '$constants/modes';
import { Stickers } from '$modules/Stickers';
import { Router } from '$modules/Router';
import { Shotter } from '$modules/Shotter';
import { DEFAULT_LOGO } from '$constants/logos';

import { parseStickerAngle, parseStickerStyle } from '$utils/import';
import { getUrlData, pushPath } from '$utils/history';
import { store } from '$redux/store';
import {
  setActiveSticker, setAddress,
  setChanged,
  setDistance,
  setEditing,
  setLogo, setMode,
  setRouterPoints,
  setTitle
} from '$redux/user/actions';

export class Editor {
  constructor() {
    this.logo = DEFAULT_LOGO;
    this.owner = null;
    this.map = new Map({ container: 'map' });
    this.initialData = {};
    this.activeSticker = null;
    this.mode = MODES.NONE;

    const {
      triggerOnChange, lockMapClicks, routerMoveStart, changeMode, pushPolyPoints,
      map: { map }
    } = this;

    this.poly = new Poly({
      map, routerMoveStart, lockMapClicks, setTotalDist: this.setDistance, triggerOnChange
    });
    this.stickers = new Stickers({ map, lockMapClicks, triggerOnChange });
    this.router = new Router({
      map, lockMapClicks, setRouterPoints: this.setRouterPoints, changeMode, pushPolyPoints
    });
    this.shotter = new Shotter({ map });

    this.switches = {
      [MODES.POLY]: {
        start: this.startPoly,
        stop: this.poly.stop,
        toggle: this.clearMode,
      },
      [MODES.ROUTER]: {
        toggle: this.clearMode,
        start: this.routerSetStart,
      },
      [MODES.SHOTTER]: {
        start: this.shotter.makeShot,
      },
      [MODES.STICKERS]: {
        toggle: this.clearSticker,
      },
      [MODES.TRASH]: {
        // toggle: this.clearAll,
        toggle: this.clearMode,
      },
      [MODES.CONFIRM_CANCEL]: {
        toggle: this.cancelEditing,
      },
      [MODES.LOGO]: {
        toggle: this.clearMode,
      }
    };

    this.clickHandlers = {
      [MODES.STICKERS]: this.createStickerOnClick,
      [MODES.ROUTER]: this.router.pushWaypointOnClick,
    };

    // this.clearChanged = clearChanged;
    // this.setActiveSticker = setActiveSticker;
    // this.setLogo = setLogo;
    // this.setMode = setMode;
    // this.setEditing = setEditing;
    // this.setTitle = setTitle;
    // this.setAddress = setAddress;
    // this.getUser = getUser;
    // this.getTitle = getTitle;

    map.addEventListener('mouseup', this.onClick);
    map.addEventListener('dragstart', () => lockMapClicks(true));
    map.addEventListener('dragstop', () => lockMapClicks(false));
  }

  getUser = () => store.getState().user.user;
  getTitle = () => store.getState().user.title;
  getEditing = () => store.getState().user.editing;
  getChanged = () => store.getState().user.changed;
  getRouterPoints = () => store.getState().user.routerPoints;
  getDistance = () => store.getState().user.distance;

  setMode = value => store.dispatch(setMode(value));
  setChanged = value => store.dispatch(setChanged(value));
  setRouterPoints = value => store.dispatch(setRouterPoints(value));
  setActiveSticker = value => store.dispatch(setActiveSticker(value));
  setTitle = value => store.dispatch(setTitle(value));
  setAddress = value => store.dispatch(setAddress(value));

  setDistance = value => {
    if (this.getDistance() !== value) store.dispatch(setDistance(value));
  };

  clearMode = () => this.setMode(MODES.NONE);
  clearChanged = () => store.dispatch(setChanged(false));

  startPoly = () => {
    if (this.getRouterPoints()) this.router.clearAll();

    this.poly.continue();
  };

  triggerOnChange = () => {
    if (!this.getEditing() || this.getChanged()) return;

    this.setChanged(true);
  };

  createStickerOnClick = (e) => {
    if (!e || !e.latlng || !this.activeSticker) return;
    const { latlng } = e;

    this.stickers.createSticker({ latlng, sticker: this.activeSticker });
    this.setActiveSticker(null);
    this.setChanged(true);
  };

  changeMode = mode => {
    if (this.mode === mode) {
      if (this.switches[mode] && this.switches[mode].toggle) {
        // if we have special function on mode when it clicked again
        this.switches[mode].toggle();
      } else {
        this.disableMode(mode);
        // this.setMode(MODES.NONE);
        this.mode = MODES.NONE;
      }
    } else {
      this.disableMode(this.mode);
      // this.setMode(mode);
      this.mode = mode;
      this.enableMode(mode);
    }
  };

  enableMode = mode => {
    if (this.switches[mode] && this.switches[mode].start) this.switches[mode].start();
  };

  disableMode = mode => {
    if (this.switches[mode] && this.switches[mode].stop) this.switches[mode].stop();
  };

  onClick = e => {
    if (e.originalEvent.which === 3) return; // skip right / middle click
    if (this.clickHandlers[this.mode]) this.clickHandlers[this.mode](e);
  };

  lockMapClicks = lock => {
    if (lock) {
      this.map.map.removeEventListener('mouseup', this.onClick);
      this.map.map.addEventListener('mouseup', this.unlockMapClicks);
    } else {
      this.map.map.removeEventListener('mouseup', this.unlockMapClicks);
      this.map.map.addEventListener('mouseup', this.onClick);
    }
  };

  unlockMapClicks = () => {
    this.lockMapClicks(false);
  };

  routerSetStart = () => {
    const { latlngs } = this.poly;

    if (!latlngs || !latlngs.length) return;

    this.router.startFrom(latlngs[latlngs.length - 1]);
  };

  routerMoveStart = () => {
    const { _latlngs } = this.poly.poly;

    if (_latlngs) this.router.moveStart(_latlngs[_latlngs.length - 1]);
  };

  pushPolyPoints = latlngs => {
    this.poly.pushPoints(latlngs);
  };

  clearSticker = () => {
    if (this.activeSticker) {
      this.setActiveSticker(null);
    } else {
      this.setMode(MODES.NONE);
    }
  };

  clearAll = () => {
    this.poly.clearAll();
    this.router.clearAll();
    this.stickers.clearAll();
  };


  setData = ({
    route, stickers, version = 1, owner, title, address
  }) => {
    this.setTitle(title || '');
    const { id } = this.getUser();

    if (address && id && owner && id === owner) this.setAddress(address);

    if (route) this.poly.setPoints(route);

    this.stickers.clearAll();
    if (stickers) {
      stickers.map(sticker => this.stickers.createSticker({
        latlng: sticker.latlng,
        angle: parseStickerAngle({ sticker, version }),
        sticker: parseStickerStyle({ sticker, version }),
      }));
    }

    if (owner) this.owner = owner;
  };

  fitDrawing = () => {
    if (this.poly.isEmpty()) return;

    const bounds = this.poly.poly.getBounds();
    if (bounds && Object.values(bounds)) this.map.map.fitBounds(bounds);
  };

  setInitialData = () => {
    const { path } = getUrlData();
    const { id } = this.getUser();
    const { route, stickers } = this.dumpData();

    this.initialData = {
      version: 2,
      title: this.getTitle(),
      owner: this.owner,
      address: (this.owner === id ? path : null),
      path,
      route,
      stickers,
    };
  };

  startEditing = () => {
    const { path } = getUrlData();
    const { random_url, id } = this.getUser();

    this.setInitialData();

    const url = (this.owner && this.owner === id) ? path : random_url;

    pushPath(`/${url}/edit`);

    if (this.poly.latlngs && this.poly.latlngs.length > 1) this.poly.poly.enableEdit();

    this.stickers.startEditing();
  };

  stopEditing = () => {
    const { path } = getUrlData();
    pushPath(`/${(this.initialData && this.initialData.path) || path}`);

    // this.changeMode(MODES.NONE);
    this.poly.poly.disableEdit();
    this.stickers.stopEditing();
    // this.setEditing(false);
  };

  cancelEditing = () => {
    if (this.hasEmptyHistory()) {
      this.clearAll();
      this.startEditing();
    } else {
      this.setData(this.initialData);
    }

    this.stopEditing();
    this.clearChanged();

    return true;
  };

  dumpData = () => ({
    route: this.poly.dumpData(),
    stickers: this.stickers.dumpData(),
  });

  // isEmpty = () => {
  //   const { route, stickers } = this.dumpData();
  //
  //   return (route.length > 1 && stickers.length > 0);
  // };

  isEmpty = () => {
    const { route, stickers } = this.dumpData();

    return (!route || route.length < 1) && (!stickers || stickers.length <= 0);
  };

  hasEmptyHistory = () => {
    const { route, stickers } = this.initialData;

    return (!route || route.length < 1) && (!stickers || stickers.length <= 0);
  };
}

export const editor = new Editor({});
