import React from 'react';

import { MODES } from '~/constants/modes';
import { Icon } from '~/components/panels/Icon';
import { editorSetMode, editorStopEditing } from '~/redux/editor/actions';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  editorSetMode,
  editorStopEditing,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { width?: number };

export class CancelDialog extends React.Component<Props, void> {
  cancel = () => {
    this.props.editorStopEditing();
  };

  proceed = () => {
    this.props.editorSetMode(MODES.NONE);
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
