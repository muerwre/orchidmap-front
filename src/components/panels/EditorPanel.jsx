import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { toHours } from '$utils/format';

import { Icon } from '$components/panels/Icon';
import { EditorDialog } from '$components/panels/EditorDialog';
import { LogoPreview } from '$components/logo/LogoPreview';

export class EditorPanel extends React.PureComponent {
  startPolyMode = () => this.props.editor.changeMode(MODES.POLY);

  startStickerMode = () => this.props.editor.changeMode(MODES.STICKERS);

  startRouterMode = () => this.props.editor.changeMode(MODES.ROUTER);

  startShotterMode = () => this.props.editor.changeMode(MODES.SHOTTER);

  startTrashMode = () =>  this.props.editor.changeMode(MODES.TRASH);

  startLogoMode = () => this.props.editor.changeMode(MODES.LOGO);

  startSaveMode = () => this.props.editor.changeMode(MODES.SAVE);

  stopEditing = () => this.props.editor.stopEditing();

  startEditing = () => this.props.editor.startEditing();

  render() {
    const {
      mode, routerPoints, editor, totalDistance, estimateTime, activeSticker, logo, user, editing,
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
        />

        <LogoPreview logo={logo} />

        <div className={classnames('panel right', { active: editing })}>
          <div className="control-dist">
            {totalDistance} км
            <Icon icon="icon-cycle" size={32} />
            {
              <span>{toHours(estimateTime)}</span>
            }
          </div>

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
              onClick={this.stopEditing}
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
            <button className="success single" onClick={this.startEditing}>
              <Icon icon="icon-router" />
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
