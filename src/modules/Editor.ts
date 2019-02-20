import { Map } from '$modules/Map';
import { NewPoly } from '$modules/NewPoly';
import { MODES } from '$constants/modes';
import { Stickers } from '$modules/Stickers';
import { Router } from '$modules/Router';
import { DEFAULT_LOGO, LOGOS } from '$constants/logos';

import { getUrlData } from '$utils/history';
import { store } from '$redux/store';
import {
  changeProvider,
  resetSaveDialog,
  setActiveSticker,
  setAddress,
  setChanged,
  setDistance, setIsEmpty,
  setLogo, setMarkersShown,
  setMode,
  setPublic,
  setRouterPoints,
  setTitle,
} from '$redux/user/actions';
import { DEFAULT_PROVIDER, IProvider, PROVIDERS } from '$constants/providers';
import { STICKERS } from '$constants/stickers';
import { IRootState } from "$redux/user/reducer";
import { DEFAULT_USER } from "$constants/auth";

export class Editor {
  constructor() {
    this.logo = DEFAULT_LOGO;
    this.owner = null;
    this.map = new Map({ container: 'map' });
    this.initialData = {};
    this.activeSticker = {};
    this.mode = MODES.NONE;
    this.provider = PROVIDERS[DEFAULT_PROVIDER];

    const {
      triggerOnChange, lockMapClicks, routerMoveStart, changeMode, pushPolyPoints,
      map: { map }
    } = this;

    this.poly = new NewPoly({
      map, routerMoveStart, lockMapClicks, setTotalDist: this.setDistance, triggerOnChange, editor: this,
    });

    // this.newPoly = new NewPoly({
    //   map, editor: this,
    // });

    this.stickers = new Stickers({ map, lockMapClicks, triggerOnChange, editor: this });
    this.router = new Router({
      map, lockMapClicks, setRouterPoints: this.setRouterPoints, changeMode, pushPolyPoints
    });
    // this.shotter = new Shotter({ map });

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
      [MODES.STICKERS]: {
        toggle: this.clearSticker,
      },
      [MODES.STICKERS_SELECT]: {
        toggle: this.clearSticker,
      },
      [MODES.TRASH]: {
        toggle: this.clearMode,
      },
      [MODES.CONFIRM_CANCEL]: {
        toggle: this.cancelEditing,
      },
      [MODES.LOGO]: {
        toggle: this.clearMode,
      },
      [MODES.SAVE]: {
        toggle: this.clearMode,
        stop: this.resetSaveDialog,
      },
      [MODES.PROVIDER]: {
        toggle: this.clearMode,
      }
    };

    this.clickHandlers = {
      [MODES.STICKERS]: this.createStickerOnClick,
      [MODES.ROUTER]: this.router.pushWaypointOnClick,
    };

    map.addEventListener('mouseup', this.onClick);
    map.addEventListener('dragstart', () => lockMapClicks(true));
    map.addEventListener('dragstop', () => lockMapClicks(false));
  }

  map; // todo typecheck
  poly; // todo typecheck
  stickers;
  router;

  logo: string | number = DEFAULT_LOGO;
  owner = null;
  initialData;
  activeSticker: IRootState['activeSticker'];
  mode: IRootState['mode'];
  provider: IProvider;
  switches;
  clickHandlers;
  user = DEFAULT_USER;

  getState = (): IRootState => <any>store.getState().user;

  getUser = () => this.getState().user;
  getMode = () => this.getState().mode;
  getProvider = () => this.getState().provider;
  getTitle = () => this.getState().title;
  getEditing = () => this.getState().editing;
  getChanged = () => this.getState().changed;
  getRouterPoints = () => this.getState().routerPoints;
  getDistance = () => this.getState().distance;
  getIsEmpty = () => this.getState().is_empty;

  setLogo: typeof setLogo = logo => store.dispatch(setLogo(logo));
  setMode: typeof setMode = value => store.dispatch(setMode(value));
  setRouterPoints: typeof setRouterPoints = value => store.dispatch(setRouterPoints(value));
  setActiveSticker: typeof setActiveSticker = value => store.dispatch(setActiveSticker(value));
  setTitle: typeof setTitle = value => store.dispatch(setTitle(value));
  setAddress: typeof setAddress = value => store.dispatch(setAddress(value));
  setPublic: typeof setPublic = value => store.dispatch(setPublic(value));
  setIsEmpty: typeof setIsEmpty = value => store.dispatch(setIsEmpty(value));

  setMarkersShown = value => {
    if (this.getState().markers_shown !== value) store.dispatch(setMarkersShown(value));
  };

  resetSaveDialog = () => store.dispatch(resetSaveDialog());

  setDistance = value => {
    if (this.getDistance() !== value) store.dispatch(setDistance(value));
  };

  setChanged = value => {
    if (this.getChanged() !== value) store.dispatch(setChanged(value));
  };

  clearMode = () => this.setMode(MODES.NONE);
  clearChanged = () => store.dispatch(setChanged(false));

  startPoly = () => {
    if (this.getRouterPoints()) this.router.clearAll();

    this.poly.continue();
  };

  triggerOnChange = () => {
    if (this.isEmpty !== this.getIsEmpty()) this.setIsEmpty(this.isEmpty);
    if (this.getEditing() && this.getChanged()) this.setChanged(true);
  };

  createStickerOnClick = (e) => {
    if (!e || !e.latlng || !this.activeSticker) return;
    const { latlng } = e;

    this.stickers.createSticker({ latlng, sticker: this.activeSticker.sticker, set: this.activeSticker.set });
    this.setActiveSticker(null);
    this.setChanged(true);
    this.setMode(MODES.STICKERS_SELECT);
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

    this.setIsEmpty(true);
  };

  setData = ({
    route = [], stickers = [], owner, title, address, provider = DEFAULT_PROVIDER, logo = DEFAULT_LOGO, is_public,
  }) => {
    this.setTitle(title || '');
    const { id } = this.getUser();

    if (address && id && owner && id === owner.id) {
      this.setAddress(address);
    }

    if (route) this.poly.setPoints(route);

    this.stickers.clearAll();
    if (stickers) {
      stickers.map(sticker =>
        sticker.set && STICKERS[sticker.set].url &&
          this.stickers.createSticker({
            latlng: sticker.latlng,
            angle: sticker.angle,
            sticker: sticker.sticker,
            set: sticker.set,
            text: sticker.text,
          })
      );
    }

    this.setPublic(is_public);
    this.setLogo((logo && LOGOS[DEFAULT_LOGO] && logo) || DEFAULT_LOGO);
    this.setProvider((provider && PROVIDERS[provider] && provider) || DEFAULT_PROVIDER);
    if (owner) this.owner = owner;
  };

  fitDrawing = () => {
    if (this.poly.isEmpty) return;

    const bounds = this.poly.poly.getBounds();
    if (bounds && Object.values(bounds)) this.map.map.fitBounds(bounds);
  };

  setInitialData = () => {
    const { path } = getUrlData();
    const { id } = this.getUser();
    const { is_public } = this.getState();
    const { route, stickers, provider } = this.dumpData();

    this.initialData = {
      version: 2,
      title: this.getTitle(),
      owner: this.owner,
      address: (this.owner === id ? path : null),
      path,
      route,
      stickers,
      provider,
      is_public,
    };
  };

  startEditing = () => {
    const { id } = this.getUser();

    this.setInitialData();
    this.owner = { id };

    if (this.poly.latlngs && this.poly.latlngs.length > 1) this.poly.poly.editor.enable();
    this.stickers.startEditing();
  };

  stopEditing = () => {
    this.poly.poly.editor.disable();
    this.stickers.stopEditing();
    this.router.clearAll();
  };

  cancelEditing = () => {
    if (this.hasEmptyHistory) {
      this.clearAll();
      this.startEditing();
      this.clearChanged();
      return;
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
    provider: this.getProvider(),
  });

  setProvider = provider => store.dispatch(changeProvider(provider));

  get isEmpty() {
    const { route, stickers } = this.dumpData();

    return (!route || route.length < 1) && (!stickers || stickers.length <= 0);
  }

  get hasEmptyHistory() {
    const { route, stickers } = this.initialData;

    return (!route || route.length < 1) && (!stickers || stickers.length <= 0);
  };
}

export const editor = new Editor();

declare let window:any;

window.editor = editor;
