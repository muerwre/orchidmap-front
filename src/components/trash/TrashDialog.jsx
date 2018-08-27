import React from 'react';

import { MODES } from '$constants/modes';

export class TrashDialog extends React.Component {
  clearPoly = () => {
    this.props.editor.poly.clearAll();
    this.props.editor.changeMode(MODES.NONE);
  };

  clearStickers = () => {
    this.props.editor.stickers.clearAll();
    this.props.editor.changeMode(MODES.NONE);
  };

  clearAll = () => {
    this.props.editor.clearAll();
  };

  cancel = () => {
    this.props.editor.changeMode(MODES.NONE);
  };

  render() {
    return (
      <div className="helper trash-helper">
        <div className="helper__text">
          <div className="big white">Уверены?</div>
          <div className="small gray">Мы все удалим</div>
        </div>
        <div className="helper__buttons button-group">
          <div className="button router-helper__button" onClick={this.clearStickers}>
            Стикеры
          </div>
          <div className="button router-helper__button" onClick={this.clearPoly}>
            Маршрут
          </div>
          <div className="button danger router-helper__button" onClick={this.clearAll}>
            Очистить
          </div>
          <div className="button primary router-helper__button" onClick={this.cancel}>
            Отмена
          </div>
        </div>
      </div>
    );
  }
}
