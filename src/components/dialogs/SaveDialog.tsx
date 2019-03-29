import * as React from 'react';
import { copyToClipboard, getUrlData } from '$utils/history';
import { toTranslit, parseDesc } from '$utils/format';
import { TIPS } from '$constants/tips';
import { MODES } from '$constants/modes';
import { Icon } from '$components/panels/Icon';
import { Switch } from '$components/Switch';

import classnames from 'classnames';
import { sendSaveRequest, setMode } from "$redux/user/actions";
import ExpandableTextarea from 'react-expandable-textarea';

interface Props {
  address: string,
  title: string,
  is_public: boolean,

  width: number,
  setMode: typeof setMode,
  sendSaveRequest: typeof sendSaveRequest,
  save_error: string,

  save_loading: boolean,
  save_finished: boolean,
  save_overwriting: boolean,
}

interface State {
  address: string,
  title: string,
  is_public: boolean,
  description: string,
}

export class SaveDialog extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      address: props.address || '',
      title: props.title || '',
      is_public: props.is_public || false,
      description: props.description || '',
    };
  }

  getAddress = () => {
    const { path } = getUrlData();
    const { title, address } = this.state;

    return toTranslit(address.trim()) || toTranslit(title.trim().toLowerCase()).substr(0, 32) || toTranslit(path.trim()).substr(0, 32);
  };

  setTitle = ({ target: { value } }) => this.setState({ title: ((value && value.substr(0, 64)) || '') });
  setAddress = ({ target: { value } }) => this.setState({ address: (value && value.substr(0, 32) || '') });
  setDescription = ({ target: { value } }) => this.setState({ description: (value && value.substr(0, 256) || '') });



  sendSaveRequest = (e, force = false) => {
    const { title, is_public, description } = this.state;
    const address = this.getAddress();

    this.props.sendSaveRequest({
      title, address, force, is_public, description,
    });
  };
  forceSaveRequest = e => this.sendSaveRequest(e, true);

  cancelSaving = () => this.props.setMode(MODES.NONE);

  onCopy = e => {
    e.preventDefault();
    const { host, protocol } = getUrlData();
    copyToClipboard(`${protocol}//${host}/${this.getAddress()}`);
  };

  togglePublic = () => {
    this.setState({ is_public: !this.state.is_public });
  };

  render() {
    const { title, is_public, description } = this.state;
    const { save_error, save_finished, save_overwriting, width, save_loading } = this.props;
    const { host, protocol } = getUrlData();

    return (
      <div className="control-dialog control-dialog-medium" style={{ width }}>
        <div className="helper save-helper">
          <div className={classnames('save-loader', { active: save_loading })} />

          <div className="save-title">
            <div className="save-title-input">
              <div className="save-title-label">Название</div>
              <input type="text" value={title} onChange={this.setTitle} autoFocus readOnly={save_finished} />
            </div>
          </div>

          <div className="save-description">
            <div className="save-address-input">
              <label className="save-address-label">{protocol}//{host}/</label>
              <input
                type="text"
                value={this.getAddress()}
                onChange={this.setAddress}
                readOnly={save_finished}
                onCopy={this.onCopy}
              />
              <div className="save-address-copy" onClick={this.onCopy}>
                <Icon icon="icon-copy-1" size={24} />
              </div>
            </div>

            <div className="save-textarea">
              <ExpandableTextarea
                minRows={2}
                maxRows={5}
                placeholder="Описание маршрута"
                value={parseDesc(description)}
                onChange={this.setDescription}
              />
            </div>
            <div className="save-text">
              { save_error || TIPS.SAVE_INFO }
            </div>

            <div className="save-buttons">
              <div className={classnames('save-buttons-text pointer', { gray: !is_public })} onClick={this.togglePublic}>
                <Switch active={is_public} />
                {
                  is_public
                    ? ' В каталоге карт'
                    : ' Только по ссылке'
                }
              </div>
              <div>
                { !save_finished &&
                  <div className="button" onClick={this.cancelSaving}>Отмена</div>
                }
                {
                  !save_finished && !save_overwriting &&
                  <div className="button primary" onClick={this.sendSaveRequest}>Сохранить</div>
                }
                {
                  save_overwriting &&
                  <div className="button danger" onClick={this.forceSaveRequest}>Перезаписать</div>
                }
                { save_finished &&
                  <div className="button" onClick={this.onCopy}>Скопировать</div>
                }
                { save_finished &&
                  <div className="button success" onClick={this.cancelSaving}>Отлично!</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
