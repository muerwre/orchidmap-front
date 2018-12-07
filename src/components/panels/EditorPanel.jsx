import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { toHours } from '$utils/format';

import { Icon } from '$components/panels/Icon';
import { EditorDialog } from '$components/panels/EditorDialog';
import { LogoPreview } from '$components/logo/LogoPreview';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMode, startEditing, stopEditing, setLogo, takeAShot } from '$redux/user/actions';

import { UserLocation } from '$components/UserLocation';
import { PROVIDERS } from '$constants/providers';
import { LOGOS } from '$constants/logos';

type Props = {
  editing: false,
  mode: String,
  changed: Boolean,
  distance: Number,
  logo: String,
  estimated: Number, // todo: implement!
  provider: String,

  setMode: Function,
  startEditing: Function,
  stopEditing: Function,
  takeAShot: Function,
}

class Component extends React.PureComponent<Props, void> {
  componentDidMount() {
    const obj = document.getElementById('control-dialog');
    const { width } = this.panel.getBoundingClientRect();

    if (!this.panel || !obj) return;

    obj.style.width = width;
  }

  startPolyMode = () => this.props.setMode(MODES.POLY);
  startStickerMode = () => this.props.setMode(MODES.STICKERS);
  startRouterMode = () => this.props.setMode(MODES.ROUTER);
  startProviderMode = () => this.props.setMode(MODES.PROVIDER);
  startTrashMode = () => this.props.setMode(MODES.TRASH);
  startLogoMode = () => this.props.setMode(MODES.LOGO);
  startSaveMode = () => this.props.setMode(MODES.SAVE);

  render() {
    const {
      mode, distance, estimated, changed, logo, editing, provider,
    } = this.props;

    return (
      <div>

        <LogoPreview logo={logo} />

        <div className="status-panel top left">
          <div className="status-bar square pointer pointer">
            <UserLocation />
          </div>

          <div className="status-bar padded desktop-only">
            {distance} км&nbsp;
            <Icon icon="icon-cycle" size={32} />
            {
              <span>{toHours(estimated)}</span>
            }
          </div>
        </div>

        <div className="status-panel top right">
          <div className="status-bar pointer top-control padded" onClick={this.startProviderMode}>
            <Icon icon="icon-map-1" size={24} />
            <div className="status-bar-sep" />
            <span>{(provider && PROVIDERS[provider] && PROVIDERS[provider].name) || '...'}</span>
          </div>

          <div className="status-bar pointer top-control padded" onClick={this.startLogoMode}>
            <Icon icon="icon-logo-3" size={24} />
            <div className="status-bar-sep" />
            <span>{(logo && LOGOS[logo] && LOGOS[logo][0]) || '...'}</span>
          </div>
        </div>

        <div className={classnames('panel right', { active: editing })} ref={el => { this.panel = el; }}>
          <div className="control-bar control-bar-padded">
            <button
              className={classnames({ active: mode === MODES.ROUTER })}
              onClick={this.startRouterMode}
            >
              <Icon icon="icon-route-2" />
            </button>
            <button
              className={classnames({ active: mode === MODES.POLY })}
              onClick={this.startPolyMode}
            >
              <Icon icon="icon-poly-3" />
            </button>
            <button
              className={classnames({ active: mode === MODES.STICKERS })}
              onClick={this.startStickerMode}
            >
              <Icon icon="icon-sticker-3" />
            </button>

          </div>

          <div className="control-sep" />

          <div className="control-bar control-bar-padded">
            <button
              className={classnames({ active: mode === MODES.TRASH })}
              onClick={this.startTrashMode}
            >
              <Icon icon="icon-trash-4" />
            </button>

            <button
              className={classnames({ active: false })}
              onClick={this.props.takeAShot}
            >
              <Icon icon="icon-shot-2" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className="highlighted cancel"
              onClick={this.props.stopEditing}
            >
              <Icon icon="icon-cancel-1" />
            </button>

            <button
              className={classnames({ primary: changed, disabled: !changed })}
              onClick={this.startSaveMode}
            >
              <span className="desktop-only">СХОРОНИТЬ</span>
              <Icon icon="icon-check-1" />
            </button>
          </div>

        </div>

        <div className={classnames('panel right', { active: !editing })}>
          <div className="control-bar">
            <button className="primary single" onClick={this.props.startEditing}>
              <Icon icon="icon-route-2" />
              <span>
                РЕДАКТИРОВАТЬ
              </span>
            </button>
          </div>
        </div>

        <EditorDialog
          width={((this.panel && this.panel.getBoundingClientRect().width) || 0)}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: {
      user,
      editing,
      mode,
      routerPoints,
      distance,
      estimated,
      activeSticker,
      logo,
      title,
      address,
      changed,
      provider,
    },
  } = state;

  return {
    user,
    editing,
    mode,
    routerPoints,
    distance,
    estimated,
    activeSticker,
    logo,
    title,
    address,
    changed,
    provider,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setMode,
  setLogo,
  startEditing,
  stopEditing,
  takeAShot,
}, dispatch);

export const EditorPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
