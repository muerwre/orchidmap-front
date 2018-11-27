import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { toHours } from '$utils/format';

import { Icon } from '$components/panels/Icon';
import { EditorDialog } from '$components/panels/EditorDialog';
import { LogoPreview } from '$components/logo/LogoPreview';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMode, startEditing, stopEditing, setLogo } from '$redux/user/actions';
import type { UserType } from '$constants/types';
import { editor } from '$modules/Editor';

type Props = {
  user: UserType,
  editing: false,
  mode: String,
  changed: Boolean,
  distance: Number,
  title: String,
  address: String,
  logo: String,
  routerPoints: Number,
  activeSticker: String,
  estimated: Number, // todo: implement!

  setMode: Function,
  startEditing: Function,
  stopEditing: Function,
  setLogo: Function,
}

class Component extends React.PureComponent<Props, void> {
  componentDidMount() {
    const obj = document.getElementById('control-dialog');
    const { width } = this.panel.getBoundingClientRect();

    console.log(obj, this.panel);

    if (!this.panel || !obj) return;

    obj.style.width = width;
  }

  startPolyMode = () => this.props.setMode(MODES.POLY);
  startStickerMode = () => this.props.setMode(MODES.STICKERS);
  startRouterMode = () => this.props.setMode(MODES.ROUTER);
  startShotterMode = () => this.props.setMode(MODES.SHOTTER);
  startTrashMode = () => this.props.setMode(MODES.TRASH);
  startLogoMode = () => this.props.setMode(MODES.LOGO);
  startSaveMode = () => this.props.setMode(MODES.SAVE);

  render() {
    const {
      mode, routerPoints, distance, estimated, activeSticker, logo, user, editing, title, address,
    } = this.props;

    return (
      <div>

        <LogoPreview logo={logo} />

        <div className="control-dist">
          {distance} км
          <Icon icon="icon-cycle" size={32} />
          {
            <span>{
              toHours(estimated)
            }</span>
          }
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
              className={classnames('disabled', { active: mode === MODES.SHOTTER })}
              // onClick={this.startShotterMode}
            >
              <Icon icon="icon-shot-3" />
            </button>

            <button
              className={classnames('disabled', { active: mode === MODES.LOGO })}
            >
              <Icon icon="icon-map-1" />
            </button>

            <button
              className={classnames({ active: mode === MODES.LOGO })}
              onClick={this.startLogoMode}
            >
              <Icon icon="icon-logo-3" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className="highlighted  cancel"
              onClick={this.props.stopEditing}
            >
              <Icon icon="icon-cancel-1" />
            </button>

            <button
              className="primary"
              onClick={this.startSaveMode}
            >
              <span>СХОРОНИТЬ</span>
              <Icon icon="icon-check-1" />
            </button>
          </div>

        </div>

        <div className={classnames('panel right', { active: !editing })}>
          <div className="control-bar">
            <button
              className={classnames('disabled', { active: mode === MODES.SHOTTER })}
              onClick={this.startShotterMode}
            >
              <Icon icon="icon-shot-3" />
              <span>
                СНИМОК
              </span>
            </button>
          </div>

          <div className="control-sep" />

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
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setMode,
  setLogo,
  startEditing,
  stopEditing,
}, dispatch);

export const EditorPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
