import React from 'react';

import { MODES } from '~/constants/modes';
import { Icon } from '~/components/panels/Icon';
import { editorChangeMode, editorStopEditing } from '~/redux/editor/actions';
import { connect } from 'react-redux';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  editorChangeMode,
  editorStopEditing,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { };

class CancelDialogUnconnected extends React.Component<Props, void> {
  cancel = () => {
    this.props.editorStopEditing();
  };

  proceed = () => {
    this.props.editorChangeMode(MODES.NONE);
  };

  render() {
    return (
      <div className="control-dialog control-dialog__medium">
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

export const CancelDialog = connect(mapStateToProps, mapDispatchToProps)(CancelDialogUnconnected)