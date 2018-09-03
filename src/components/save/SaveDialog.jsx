import React from 'react';
import { getUrlData, pushPath } from '$utils/history';
import { toTranslit } from '$utils/format';
import { TIPS } from '$constants/tips';
import { MODES } from '$constants/modes';
import { postMap } from '$utils/api';

import classnames from 'classnames';

export class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: props.address || '',
      title: props.title || '',
      error: '',
      sending: false,
      finished: false,
      overwriting: false,
    };
  }

  getAddress = () => {
    const { path } = getUrlData();
    const { title, address } = this.state;
    return toTranslit(address.trim()) || toTranslit(title.trim()) || toTranslit(path.trim());
  };

  setTitle = ({ target: { value } }) => this.setState({ title: (value || '') });

  setAddress = ({ target: { value } }) => this.setState({ address: (value || '') });

  cancelSaving = () => this.props.editor.changeMode(MODES.NONE);

  sendSaveRequest = (e, force = false) => {
    const { route, stickers } = this.props.editor.dumpData();
    const { title } = this.state;
    const { id, token } = this.props.user;

    postMap({
      id,
      token,
      route,
      stickers,
      title,
      force,
      address: this.getAddress(),
    }).then(this.parseResponse).catch(console.warn);
  };

  forceSaveRequest = e => this.sendSaveRequest(e, true);

  parseResponse = data => {
    if (data.success) return this.setSuccess(data);
    if (data.mode === 'overwriting') return this.setOverwrite(data.description);
    return this.setError(data.description);
  };

  setSuccess = ({ address, description }) => {
    pushPath(`/${address}/edit`);

    this.setState({
      error: description, finished: true, sending: true, overwriting: false
    });
  };

  setOverwrite = error => this.setState({
    error, finished: false, sending: true, overwriting: true
  });

  setError = error => this.setState({
    error, finished: false, sending: true, overwriting: false
  });

  render() {
    const {
      title, error, finished, overwriting, sending
    } = this.state;
    const { host } = getUrlData();

    return (
      <div className="helper save-helper">
        <div className="save-title">
          <div className="save-title-input">
            <label className="save-title-label">Название</label>
            <input type="text" value={title} onChange={this.setTitle} autoFocus />
          </div>
        </div>

        <div className="save-description">
          <div className="save-address-input">
            <label className="save-address-label">http://{host}/</label>
            <input type="text" value={this.getAddress().substr(0, 32)} onChange={this.setAddress} />
          </div>

          <div className="save-text">
            {
              error || TIPS.SAVE_INFO
            }
          </div>

          <div className="save-buttons">
            <div className="save-buttons-text" />
            <div className={classnames({ 'button-group': !finished })}>

              { !finished &&
              <div className="button" onClick={this.cancelSaving}>Отмена</div>
              }

              {
                (!sending || (sending && !overwriting && !finished)) &&
                  <div className="button primary" onClick={this.sendSaveRequest}>Сохранить</div>
              }

              {
                sending && overwriting &&
                  <div className="button danger" onClick={this.forceSaveRequest}>Перезаписать</div>
              }

              { finished &&
              <div className="button success" onClick={this.cancelSaving}>Отлично, спасибо!</div>
              }

            </div>
          </div>
        </div>


      </div>
    );
  }
}
