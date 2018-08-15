import { Map } from '$modules/Map';
import { Poly } from "$modules/Poly";
import { MODES } from '$constants/modes';
import { Stickers } from '$modules/Stickers';

export class Editor {
  constructor({
    container,
    mode,
    setMode
  }) {
    this.map = new Map({ container });
    this.poly = new Poly({ map: this.map.map });
    this.stickers = new Stickers({ map: this.map.map });

    this.setMode = setMode;
    this.mode = mode;

    this.switches = {
      [MODES.POLY]: {
        start: this.poly.continue,
        stop: this.poly.stop,
      }
    };

    this.clickHandlers = {
      [MODES.STICKERS]: this.stickers.createOnClick
    };

    this.map.map.addEventListener('mousedown', this.onClick);
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
    if (this.clickHandlers[this.mode]) this.clickHandlers[this.mode](e);
  };
}
