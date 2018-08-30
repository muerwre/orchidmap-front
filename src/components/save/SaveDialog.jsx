import React from 'react';
import { getUrlData } from '$utils/history';
import { toTranslit } from '$utils/format';
import { TIPS } from '$constants/tips';
import { MODES } from '$constants/modes';
import { postMap } from '$utils/api';

export class SaveDialog extends React.Component {
  state = {
    address: '',
    title: '',
    error: '',
    sending: false,
    finished: false,
    success: false,
  };

  setTitle = ({ target: { value } }) => this.setState({ title: (value || '') });

  setAddress = ({ target: { value } }) => this.setState({ address: (value || '') });

  cancelSaving = () => this.props.editor.changeMode(MODES.NONE);

  sendSaveRequest = () => {
    const { route, stickers } = this.props.editor.dumpData();
    const { title, address } = this.state;
    const { id, token } = this.props.user;

    postMap({
      id,
      token,
      route,
      stickers,
      title,
      address,
    }).then(console.log).catch(console.warn);
  };

  render() {
    const { address, title, error } = this.state;
    const { path, host } = getUrlData();

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
            <input type="text" value={toTranslit(address.trim() || title.trim() || path).substr(0, 32)} onChange={this.setAddress} />
          </div>

          <div className="save-text">
            {
              error || TIPS.SAVE_INFO
            }
          </div>

          <div className="save-buttons">
            <div className="save-buttons-text" />
            <div className="button-group">
              <div className="button" onClick={this.cancelSaving}>Отмена</div>
              <div className="button primary" onClick={this.sendSaveRequest}>Сохранить</div>
            </div>
          </div>
        </div>


      </div>
    );
  }
};
