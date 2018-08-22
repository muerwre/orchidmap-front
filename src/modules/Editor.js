import { Map } from '$modules/Map';
import { Poly } from '$modules/Poly';
import { MODES } from '$constants/modes';
import { Stickers } from '$modules/Stickers';
import { Router } from '$modules/Router';
import { Shotter } from '$modules/Shotter';

export class Editor {
  constructor({
    container,
    mode,
    setMode,
    setRouterPoints,
  }) {
    this.map = new Map({ container });

    const { lockMapClicks, routerMoveStart, map: { map } } = this;

    this.poly = new Poly({ map, routerMoveStart, lockMapClicks });
    this.stickers = new Stickers({ map, lockMapClicks });
    this.router = new Router({ map, lockMapClicks, setRouterPoints });
    this.shotter = new Shotter({ map });

    this.setMode = setMode;
    this.mode = mode;

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
      }
    };

    this.clickHandlers = {
      [MODES.STICKERS]: this.stickers.createOnClick,
      [MODES.ROUTER]: this.router.pushWaypointOnClick,
    };

    map.addEventListener('mouseup', this.onClick);
    map.addEventListener('dragstart', () => lockMapClicks(true));
    map.addEventListener('dragstop', () => lockMapClicks(false));
  }

  changeMode = mode => {
    if (this.mode === mode) {
      this.disableMode(mode);
      this.setMode(MODES.NONE);
      this.mode = MODES.NONE;
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

    if (_latlngs) this.router.moveStart(_latlngs[_latlngs.length-1]);
  }
}
