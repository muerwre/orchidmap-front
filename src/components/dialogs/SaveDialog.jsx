import React from 'react';
import { getUrlData, pushPath } from '$utils/history';
import { toTranslit } from '$utils/format';
import { TIPS } from '$constants/tips';
import { MODES } from '$constants/modes';

type Props = {
  address: String, // initial?
  title: String, // initial?

  save_error: String,
  save_finished: Boolean,
  save_overwriting: Boolean,
  save_processing: Boolean,

  setMode: Function,
  sendSaveRequest: Function,
};

type State = {
  address: String,
  title: String,
};

export class SaveDialog extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      address: props.address || '',
      title: props.title || '',
    };
  }

  getAddress = () => {
    const { path } = getUrlData();
    const { title, address } = this.state;

    return toTranslit(address.trim()) || toTranslit(title.trim().toLowerCase()) || toTranslit(path.trim());
  };

  setTitle = ({ target: { value } }) => this.setState({ title: (value || '') });

  setAddress = ({ target: { value } }) => this.setState({ address: (value || '') });

  // cancelSaving = () => this.props.editor.changeMode(MODES.NONE);
  cancelSaving = () => this.props.setMode(MODES.NONE);

  sendSaveRequest = (e, force = false) => {
    const { title } = this.state;
    const address = this.getAddress();

    this.props.sendSaveRequest({
      title, address, force,
    });
  };

  forceSaveRequest = e => this.sendSaveRequest(e, true);

  render() {
    const { title } = this.state;
    const { save_error, save_finished, save_overwriting } = this.props;
    const { host } = getUrlData();

    return (
      <div className="helper save-helper">
        <div className="save-title">
          <div className="save-title-input">
            <div className="save-title-label">Название</div>
            <input type="text" value={title} onChange={this.setTitle} autoFocus readOnly={save_finished} />
          </div>
        </div>

        <div className="save-description">
          <div className="save-address-input">
            <label className="save-address-label">http://{host}/</label>
            <input type="text" value={this.getAddress().substr(0, 32)} onChange={this.setAddress} readOnly={save_finished} />
          </div>

          <div className="save-text">
            { save_error || TIPS.SAVE_INFO }
          </div>

          <div className="save-buttons">
            <div className="save-buttons-text" />
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
                <div className="button success" onClick={this.cancelSaving}>Отлично, спасибо!</div>
              }

            </div>
          </div>
        </div>


      </div>
    );
  }
}
