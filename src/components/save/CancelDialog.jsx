import React from 'react';

import { MODES } from '$constants/modes';

export class CancelDialog extends React.Component {
  cancel = () => {
    this.props.editor.stopEditing();
  };

  proceed = () => {
    this.props.editor.changeMode(MODES.NONE);
  };

  save = () => {
    this.props.editor.changeMode(MODES.SAVE);
  };

  render() {
    return (
      <div className="helper cancel-helper">
        <div className="helper__text">
          <div className="big white">Изменения не сохранены!</div>
          <div className="small gray">Закрыть редактор?</div>
        </div>
        <div className="helper__buttons button-group">
          <div className="button router-helper__button" onClick={this.cancel}>
            Закрыть
          </div>
          <div className="button success router-helper__button" onClick={this.proceed}>
            Продолжить
          </div>
          <div className="button primary router-helper__button" onClick={this.save}>
            Сохранить
          </div>
        </div>
      </div>
    );
  }
}
