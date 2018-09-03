import { Map } from '$modules/Map';
import { Poly } from '$modules/Poly';
import { MODES } from '$constants/modes';
import { Stickers } from '$modules/Stickers';
import { Router } from '$modules/Router';
import { Shotter } from '$modules/Shotter';
import { DEFAULT_LOGO } from '$constants/logos';

import { parseStickerAngle, parseStickerStyle } from '$utils/import';
import { getUrlData, pushPath } from '$utils/history';

export class Editor {
  constructor({
    container,
    mode,
    setMode,
    setRouterPoints,
    setTotalDist,
    setActiveSticker,
    setLogo,
    setEditing,
    setTitle,
    setAddress,
    getUser,
    triggerOnChange,
  }) {
    this.logo = DEFAULT_LOGO;
    this.owner = null;
    this.map = new Map({ container });

    const {
      lockMapClicks, routerMoveStart, changeMode, pushPolyPoints, map: { map }
    } = this;

    this.poly = new Poly({
      map, routerMoveStart, lockMapClicks, setTotalDist, triggerOnChange
    });
    this.stickers = new Stickers({ map, lockMapClicks, triggerOnChange });
    this.router = new Router({
      map, lockMapClicks, setRouterPoints, changeMode, pushPolyPoints
    });
    this.shotter = new Shotter({ map });

    this.switches = {
      [MODES.POLY]: {
        start: this.poly.continue,
        stop: this.poly.stop,
      },
      [MODES.ROUTER]: {
        start: this.routerSetStart,
      },
      [MODES.SHOTTER]: {
        start: this.shotter.makeShot,
      },
      [MODES.STICKERS]: {
        toggle: this.clearSticker,
      },
      [MODES.TRASH]: {
        toggle: this.clearAll,
      }
    };

    this.clickHandlers = {
      [MODES.STICKERS]: this.createStickerOnClick,
      [MODES.ROUTER]: this.router.pushWaypointOnClick,
    };

    this.activeSticker = null;
    this.setActiveSticker = setActiveSticker;
    this.setLogo = setLogo;
    this.setMode = setMode;
    this.setEditing = setEditing;
    this.setTitle = setTitle;
    this.setAddress = setAddress;
    this.getUser = getUser;
    this.mode = mode;

    map.addEventListener('mouseup', this.onClick);
    map.addEventListener('dragstart', () => lockMapClicks(true));
    map.addEventListener('dragstop', () => lockMapClicks(false));
  }

  createStickerOnClick = (e) => {
    if (!e || !e.latlng || !this.activeSticker) return;
    const { latlng } = e;

    this.stickers.createSticker({ latlng, sticker: this.activeSticker });
    this.setSticker(null);
  };

  changeMode = mode => {
    if (this.mode === mode) {
      if (this.switches[mode] && this.switches[mode].toggle) {
        this.switches[mode].toggle(); // if we have special function on mode when it toggles
      } else {
        this.disableMode(mode);
        this.setMode(MODES.NONE);
        this.mode = MODES.NONE;
      }
    } else {
      this.disableMode(this.mode);
      this.setMode(mode);
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
    if (e.originalEvent.which === 3) return; // skip right click
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

  setSticker = sticker => {
    this.activeSticker = sticker;
    this.setActiveSticker(sticker);
  };

  clearSticker = () => {
    if (this.activeSticker) {
      this.setSticker(null);
    } else {
      this.changeMode(MODES.NONE);
    }
  };

  clearAll = () => {
    this.poly.clearAll();
    this.router.clearAll();
    this.stickers.clearAll();

    this.setSticker(null);
    this.changeMode(MODES.NONE);
  };

  changeLogo = logo => {
    this.logo = logo;
    this.setLogo(logo);
    this.changeMode(MODES.NONE);
  };

  setData = ({ route, stickers, version = 1, owner, title, address }) => {
    this.setTitle(title || '');
    this.setAddress(address || '');

    if (route) {
      this.poly.setPoints(route);
    }

    if (stickers) {
      stickers.map(sticker => this.stickers.createSticker({
        latlng: sticker.latlng,
        angle: parseStickerAngle({ sticker, version }),
        sticker: parseStickerStyle({ sticker, version }),
      }));
    }

    if (owner) {
      this.owner = owner;
    }

    if (!route || route.length <= 1) return;

    const bounds = this.poly.poly.getBounds();

    if (Object.values(bounds)) this.map.map.fitBounds(bounds);
  };

  startEditing = () => {
    const { path } = getUrlData();
    const { random_url, id } = this.getUser();

    // console.log('ID', id, this.owner);

    const url = (this.owner && this.owner === id) ? path : random_url;

    this.setAddress(url);
    pushPath(`/${url}/edit`);

    if (this.poly.latlngs && this.poly.latlngs.length > 1) this.poly.poly.enableEdit();

    this.stickers.startEditing();
    this.setEditing(true);
  };

  stopEditing = () => {
    const { path } = getUrlData();
    pushPath(`/${path}`);

    this.changeMode(MODES.NONE);
    this.poly.poly.disableEdit();
    this.stickers.stopEditing();
    this.setEditing(false);
  };

  dumpData = () => ({
    route: this.poly.dumpData(),
    stickers: this.stickers.dumpData(),
  });
}
