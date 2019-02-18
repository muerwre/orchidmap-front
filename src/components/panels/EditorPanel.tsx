import * as React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { Icon } from '$components/panels/Icon';
import { EditorDialog } from '$components/panels/EditorDialog';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMode, startEditing, stopEditing, setLogo, takeAShot, keyPressed } from '$redux/user/actions';
import { IRootState } from "$redux/user/reducer";

interface Props extends IRootState {
  setMode: typeof setMode,
  startEditing: typeof startEditing,
  stopEditing: typeof stopEditing,
  keyPressed: EventListenerOrEventListenerObject,
}

class Component extends React.PureComponent<Props, void> {
  componentDidMount() {
    window.addEventListener('keydown', this.props.keyPressed);

    const obj = document.getElementById('control-dialog');
    const { width } = this.panel.getBoundingClientRect();

    if (!this.panel || !obj) return;

    obj.style.width = String(width);
  }

  panel: HTMLElement = null;

  componentWillUnmount() {
    window.removeEventListener('keydown', this.props.keyPressed);
  }

  startPolyMode = () => this.props.setMode(MODES.POLY);
  startStickerMode = () => this.props.setMode(MODES.STICKERS_SELECT);
  startRouterMode = () => this.props.setMode(MODES.ROUTER);
  startTrashMode = () => this.props.setMode(MODES.TRASH);
  startSaveMode = () => {
    // if (!this.props.changed) return;
    this.props.setMode(MODES.SAVE);
  };

  render() {
    const {
      mode, changed, editing,
    } = this.props;

    return (
      <div>
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
              className={classnames({ active: (mode === MODES.STICKERS || mode === MODES.STICKERS_SELECT) })}
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
              <span className="desktop-only">СОХРАНИТЬ</span>
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
      activeSticker,
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
    activeSticker,
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
  takeAShot,
  keyPressed,
}, dispatch);

export const EditorPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);