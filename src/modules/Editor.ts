import { Map } from '$modules/Map';
import { Poly } from '$modules/Poly';
import { MODES } from '$constants/modes';
import { ILatLng, Stickers } from '$modules/Stickers';
import { Router } from '$modules/Router';
import { DEFAULT_LOGO, ILogos, LOGOS } from '$constants/logos';

import { getUrlData } from '$utils/history';
import { store } from '$redux/store';
import {
  changeProvider,
  resetSaveDialog,
  setActiveSticker,
  setAddress,
  setChanged,
  setDistance,
  setIsEmpty, setIsRouting,
  setLogo,
  setMarkersShown,
  setMode,
  setPublic,
  setRouterPoints,
  setTitle,
} from '$redux/user/actions';
import { DEFAULT_PROVIDER, IProvider, PROVIDERS } from '$constants/providers';
import { STICKERS } from '$constants/stickers';
import { IRootState } from "$redux/user/reducer";
import { DEFAULT_USER, IUser } from "$constants/auth";

interface IEditor {
  map: Map;
  poly: Poly;
  stickers: Stickers;
  router: Router;

  logo: keyof ILogos;
  owner: { id: string };
  initialData: {
    version: number,
    title: string,
    owner: { id: string },
    address: string,
    path: any,
    route: any,
    stickers: any,
    provider: string,
    is_public: boolean,
    logo: string,
  };
  activeSticker: IRootState['activeSticker'];
  mode: IRootState['mode'];
  provider: IProvider;
  switches: {
    [x: string]: {
      start?: () => any,
      stop?: () => any,
      toggle?: () => any,
    }
  };
  clickHandlers: {
    [x: string]: (event) => void
  };
  user: IUser;
}

export class Editor {
  constructor() {
    this.logo = DEFAULT_LOGO;
    this.owner = null;
    this.map = new Map({ container: 'map' });
    this.activeSticker = {};
    this.mode = MODES.NONE;
    this.provider = PROVIDERS[DEFAULT_PROVIDER];

    const {
      triggerOnChange, lockMapClicks, routerMoveStart, pushPolyPoints,
      map: { map }
    } = this;

    this.poly = new Poly({
      map, routerMoveStart, lockMapClicks, setDistance: this.setDistance, triggerOnChange, editor: this,
    });

    this.stickers = new Stickers({
      map,
      lockMapClicks,
      triggerOnChange,
      editor: this
    });

    this.router = new Router({
      map,
      lockMapClicks,
      pushPolyPoints,
      setRouterPoints: this.setRouterPoints,
      setIsRouting: this.setIsRouting,
    });

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

  map: IEditor['map'];
  poly: IEditor['poly'];
  stickers: IEditor['stickers'];
  router: IEditor['router'];

  logo: IEditor['logo'] = DEFAULT_LOGO;
  owner: IEditor['owner'] = null;
  initialData: IEditor['initialData'] = {
    version: null,
    title: null,
    owner: null,
    address: null,
    path: null,
    route: null,
    stickers: null,
    provider: null,
    is_public: null,
    logo: null,
  };
  activeSticker: IEditor['activeSticker'];
  mode: IEditor['mode'];
  provider: IEditor['provider'];
  switches: IEditor['switches'];
  clickHandlers: IEditor['clickHandlers'];
  user: IEditor['user'] = DEFAULT_USER;

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
  setIsRouting: typeof setIsRouting = value => store.dispatch(setIsRouting(value));

  setMarkersShown = (value: boolean): void => {
    if (this.getState().markers_shown !== value) store.dispatch(setMarkersShown(value));
  };

  resetSaveDialog = (): void => { store.dispatch(resetSaveDialog()); };

  setDistance = (value: number): void => {
    if (this.getDistance() !== value) store.dispatch(setDistance(value));
  };

  setChanged = (value: boolean): void => {
    if (this.getChanged() !== value) store.dispatch(setChanged(value));
  };

  clearMode = (): void => { this.setMode(MODES.NONE); };
  clearChanged = (): void => { store.dispatch(setChanged(false)); };

  startPoly = (): void => {
    if (this.getRouterPoints()) this.router.clearAll();
    this.poly.continue();
  };

  triggerOnChange = (): void => {
    if (this.isEmpty !== this.getIsEmpty()) this.setIsEmpty(this.isEmpty);
    if (this.getEditing() && !this.getChanged()) this.setChanged(true);
  };

  createStickerOnClick = (e): void => {
    if (!e || !e.latlng || !this.activeSticker) return;
    const { latlng }: { latlng: ILatLng } = e;

    this.stickers.createSticker({ latlng, sticker: this.activeSticker.sticker, set: this.activeSticker.set });
    this.setActiveSticker(null);
    this.setChanged(true);
    this.setMode(MODES.STICKERS_SELECT);
  };

  changeMode = (mode: IRootState['mode']): void => {
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

  enableMode = (mode: IRootState['mode']): void => {
    if (this.switches[mode] && this.switches[mode].start) this.switches[mode].start();
  };

  disableMode = (mode: IRootState['mode']): void => {
    if (this.switches[mode] && this.switches[mode].stop) this.switches[mode].stop();
  };

  onClick = (e): void => {
    if (e.originalEvent.which === 3) return; // skip right / middle click
    if (this.clickHandlers[this.mode]) this.clickHandlers[this.mode](e);
  };

  lockMapClicks = (lock: boolean): void => {
    if (lock) {
      this.map.map.removeEventListener('mouseup', this.onClick);
      this.map.map.addEventListener('mouseup', this.unlockMapClicks);
    } else {
      this.map.map.removeEventListener('mouseup', this.unlockMapClicks);
      this.map.map.addEventListener('mouseup', this.onClick);
    }
  };

  unlockMapClicks = (): void => {
    this.lockMapClicks(false);
  };

  routerSetStart = (): void => {
    const { latlngs } = this.poly;

    if (!latlngs || !latlngs.length) return;

    this.router.startFrom(latlngs[latlngs.length - 1]);
  };

  routerMoveStart = (): void => {
    const { _latlngs } = this.poly.poly;

    if (_latlngs) this.router.moveStart(_latlngs[_latlngs.length - 1]);
  };

  pushPolyPoints = (latlngs: Array<ILatLng>): void => {
    this.poly.pushPoints(latlngs);
  };

  clearSticker = (): void => {
    if (this.activeSticker) {
      this.setActiveSticker(null);
    } else {
      this.setMode(MODES.NONE);
    }
  };

  clearAll = (): void => {
    this.poly.clearAll();
    this.router.clearAll();
    this.stickers.clearAll();

    this.setIsEmpty(true);
  };

  setData = ({
    route = [], stickers = [], owner, title, address, provider = DEFAULT_PROVIDER, logo = DEFAULT_LOGO, is_public,
  }: IEditor['initialData']): void => {
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

  fitDrawing = (): void => {
    if (this.poly.isEmpty) return;

    const bounds = this.poly.poly.getBounds();
    if (bounds && Object.values(bounds)) this.map.map.fitBounds(bounds);
  };

  setInitialData = (): void => {
    const { path } = getUrlData();
    const { id } = this.getUser();
    const { is_public, logo } = this.getState();
    const { route, stickers, provider } = this.dumpData();

    this.initialData = {
      version: 2,
      title: this.getTitle(),
      owner: this.owner,
      address: (this.owner.id === id ? path : null),
      path,
      route,
      stickers,
      provider,
      is_public,
      logo,
    };
  };

  startEditing = (): void => {
    const { id } = this.getUser();

    this.setInitialData();
    this.owner = { id };

    // todo: implement
    // if (this.poly.latlngs && this.poly.latlngs.length > 1) this.poly.poly.editor.enable();
    this.poly.enableEditor();
    this.stickers.startEditing();
  };

  stopEditing = (): void => {
    this.poly.poly.editor.disable();
    this.stickers.stopEditing();
    this.router.clearAll();
  };

  cancelEditing = (): void => {
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
  };

  dumpData = () => ({
    route: this.poly.dumpData(),
    stickers: this.stickers.dumpData(),
    provider: this.getProvider(),
  });

  setProvider: typeof changeProvider = provider => store.dispatch(changeProvider(provider));

  get isEmpty(): boolean {
    const { route, stickers } = this.dumpData();

    return (!route || route.length <= 1) && (!stickers || stickers.length <= 0);
  }

  get hasEmptyHistory(): boolean {
    const { route, stickers } = this.initialData;

    return (!route || route.length < 1) && (!stickers || stickers.length <= 0);
  };
}

export const editor = new Editor();

// for debug purposes
declare let window: any;
window.editor = editor;
