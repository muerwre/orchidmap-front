import React from 'react';

import { MODES } from '$constants/modes';
import { Icon } from '$components/panels/Icon';
import { setMode, stopEditing } from "$redux/user/actions";

type Props = {
  stopEditing: typeof stopEditing,
  setMode: typeof setMode,
  width: number,
};

export class CancelDialog extends React.Component<Props, void> {
  cancel = () => {
    this.props.stopEditing();
  };

  proceed = () => {
    this.props.setMode(MODES.NONE);
  };

  render() {
    const { width } = this.props;

    return (
      <div className="control-dialog" style={{ width }}>
        <div className="helper cancel-helper">
          <div className="helper__text danger">
            <Icon icon="icon-cancel-1" />
            <div className="big upper">Закрыть редактор?</div>
          </div>
        </div>
        <div className="helper cancel-helper">
          <div className="helper__text" />
          <div className="helper__buttons">
            <div className="button router-helper__button" onClick={this.cancel}>
              Удалить измения
            </div>

            <div className="button primary router-helper__button" onClick={this.proceed}>
              Вернуться
            </div>
          </div>
        </div>
      </div>
    );
  }
}
