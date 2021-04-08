import React from 'react';
import { copyToClipboard, getUrlData } from '~/utils/history';
import { toTranslit, parseDesc } from '~/utils/format';
import { TIPS } from '~/constants/tips';
import { Icon } from '~/components/panels/Icon';
import { Switch } from '~/components/Switch';

import classnames from 'classnames';
import { connect } from 'react-redux';
import { selectMap } from '~/redux/map/selectors';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { selectEditorSave } from '~/redux/editor/selectors';
import { MODES } from '~/constants/modes';

const mapStateToProps = state => ({
  map: selectMap(state),
  save: selectEditorSave(state),
});

const mapDispatchToProps = {
  editorCancelSave: EDITOR_ACTIONS.editorCancelSave,
  editorChangeMode: EDITOR_ACTIONS.editorChangeMode,
  editorSendSaveRequest: EDITOR_ACTIONS.editorSendSaveRequest,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { };

interface State {
  address: string;
  title: string;
  is_public: boolean;
  description: string;
}

class SaveDialogUnconnected extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      address: props.map.address || '',
      title: props.map.title || '',
      is_public: props.map.is_public || false,
      description: props.map.description || '',
    };
  }

  getAddress = () => {
    const { path } = getUrlData();
    const { title, address } = this.state;

    return (
      toTranslit(address.trim()) ||
      toTranslit(title.trim().toLowerCase()).substr(0, 32) ||
      toTranslit(path.trim()).substr(0, 32)
    );
  };

  setTitle = ({ target: { value } }) =>
    this.setState({ title: (value && value.substr(0, 64)) || '' });

  setAddress = ({ target: { value } }) =>
    this.setState({ address: (value && value.substr(0, 32)) || '' });

  setDescription = ({ target: { value } }) =>
    this.setState({ description: (value && value.substr(0, 256)) || '' });

  editorSendSaveRequest = (e, force = false) => {
    const { title, is_public, description } = this.state;
    const address = this.getAddress();

    this.props.editorSendSaveRequest({
      title,
      address,
      force,
      is_public,
      description,
    });
  };

  forceSaveRequest = e => this.editorSendSaveRequest(e, true);

  cancelSaving = () => this.props.editorChangeMode(MODES.NONE);

  onCopy = e => {
    e.preventDefault();
    const { host, protocol } = getUrlData();
    copyToClipboard(`${protocol}//${host}/${this.getAddress()}`);
  };

  togglePublic = () => {
    this.setState({ is_public: !this.state.is_public });
  };

  componentWillUnmount = () => {
    this.props.editorCancelSave()
  };

  render() {
    const { title, is_public, description } = this.state;
    const {
      save: { error, finished, overwriting, loading },
    } = this.props;
    const { host, protocol } = getUrlData();

    return (
      <div className="control-dialog control-dialog__medium">
        <div className="helper save-helper">
          <div className={classnames('save-loader', { active: loading })} />

          <div className="save-title">
            <div className="save-title-input">
              <div className="save-title-label">Название</div>
              <input
                type="text"
                value={title}
                onChange={this.setTitle}
                autoFocus
                readOnly={finished}
              />
            </div>
          </div>

          <div className="save-description">
            <div className="save-address-input">
              <label className="save-address-label">
                {protocol}//{host}/
              </label>
              <input
                type="text"
                value={this.getAddress()}
                onChange={this.setAddress}
                readOnly={finished}
                onCopy={this.onCopy}
              />
              <div className="save-address-copy" onClick={this.onCopy}>
                <Icon icon="icon-copy-1" size={24} />
              </div>
            </div>

            <div className="save-textarea">
              <textarea
                placeholder="Описание маршрута"
                value={parseDesc(description)}
                onChange={this.setDescription}
              />
            </div>
            <div className="save-text">{error || TIPS.SAVE_INFO}</div>

            <div className="save-buttons">
              <div
                className={classnames('save-buttons-text pointer', { gray: !is_public })}
                onClick={this.togglePublic}
              >
                <Switch active={is_public} />
                {is_public ? ' В каталоге карт' : ' Только по ссылке'}
              </div>
              <div>
                {!finished && (
                  <div className="button" onClick={this.cancelSaving}>
                    Отмена
                  </div>
                )}
                {!finished && !overwriting && (
                  <div className="button primary" onClick={this.editorSendSaveRequest}>
                    Сохранить
                  </div>
                )}
                {overwriting && (
                  <div className="button danger" onClick={this.forceSaveRequest}>
                    Перезаписать
                  </div>
                )}
                {finished && (
                  <div className="button" onClick={this.onCopy}>
                    Скопировать
                  </div>
                )}
                {finished && (
                  <div className="button success" onClick={this.cancelSaving}>
                    Отлично!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SaveDialog = connect(mapStateToProps, mapDispatchToProps)(SaveDialogUnconnected);

export { SaveDialog };
