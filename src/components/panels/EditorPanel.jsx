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
  startPolyMode = () => this.props.setMode(MODES.POLY);
  startStickerMode = () => this.props.setMode(MODES.STICKERS);
  startRouterMode = () => this.props.setMode(MODES.ROUTER);
  startShotterMode = () => this.props.setMode(MODES.SHOTTER);
  startTrashMode = () => this.props.setMode(MODES.TRASH);
  startLogoMode = () => this.props.setMode(MODES.LOGO);
  startSaveMode = () => this.props.setMode(MODES.SAVE);
  // startPolyMode = () => this.props.editor.changeMode(MODES.POLY);
  // startStickerMode = () => this.props.editor.changeMode(MODES.STICKERS);
  // startRouterMode = () => this.props.editor.changeMode(MODES.ROUTER);
  // startShotterMode = () => this.props.editor.changeMode(MODES.SHOTTER);
  // startTrashMode = () =>  this.props.editor.changeMode(MODES.TRASH);
  // startLogoMode = () => this.props.editor.changeMode(MODES.LOGO);
  // startSaveMode = () => this.props.editor.changeMode(MODES.SAVE);

  // stopEditing = () => {
  //   if (!this.props.changed) {
  //     editor.cancelEditing();
  //   } else {
  //     // editor.changeMode(MODES.CONFIRM_CANCEL);
  //     this.props.setMode(MODES.CONFIRM_CANCEL);
  //   }
  // };

  // startEditing = () => editor.startEditing();

  render() {
    const {
      mode, routerPoints, distance, estimated, activeSticker, logo, user, editing, title, address, changed,
    } = this.props;

    return (
      <div>

        <EditorDialog
          mode={mode}
          routerPoints={routerPoints}
          activeSticker={activeSticker}
          editor={editor}
          logo={logo}
          user={user}
          title={title}
          address={address}
          setLogo={this.props.setLogo}
        />

        <LogoPreview logo={logo} />

        <div className="control-dist">
          {changed && '(ch) '}
          {distance} км
          <Icon icon="icon-cycle" size={32} />
          {
            <span>{
              toHours(estimated)
            }</span>
          }
        </div>

        <div className={classnames('panel right', { active: editing })}>
          <div className="control-bar">
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
              <Icon icon="icon-poly-2" />
            </button>
            <button
              className={classnames({ active: mode === MODES.STICKERS })}
              onClick={this.startStickerMode}
            >
              <Icon icon="icon-sticker-2" />
            </button>

          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className={classnames({ active: mode === MODES.SHOTTER })}
              onClick={this.startShotterMode}
            >
              <Icon icon="icon-shot-2" />
            </button>

            <button
              className={classnames({ active: mode === MODES.TRASH })}
              onClick={this.startTrashMode}
            >
              <Icon icon="icon-trash-2" />
            </button>

            <button
              className={classnames({ active: mode === MODES.LOGO })}
              onClick={this.startLogoMode}
            >
              <Icon icon="icon-logo-2" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className="highlighted  cancel"
              onClick={this.props.stopEditing}
            >
              <span>ОТМЕНА</span>
            </button>

            <button
              className="primary"
              onClick={this.startSaveMode}
            >
              <span>СХОРОНИТЬ</span>
              <Icon icon="icon-save-2" />
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
