import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { Icon } from '$components/panels/Icon';
import { EditorDialog } from '$components/panels/EditorDialog';

export class EditorPanel extends React.PureComponent {
  startPolyMode = () => this.props.editor.changeMode(MODES.POLY);

  startStickerMode = () => this.props.editor.changeMode(MODES.STICKERS);

  startRouterMode = () => this.props.editor.changeMode(MODES.ROUTER);

  startShotterMode = () => this.props.editor.changeMode(MODES.SHOTTER);

  render() {
    const { mode, routerPoints } = this.props;

    return (
      <div>

        <EditorDialog
          mode={mode}
          routerPoints={routerPoints}
        />

        <div className="panel">
          <div className="control-bar">
            <button
              onClick={this.startShotterMode}
            >
              <span>РЕДАКТОР</span>
            </button>
          </div>
        </div>

        <div className="panel right">
          <div className="control-bar">
            <button
              className={classnames({ active: mode === MODES.ROUTER })}
              onClick={this.startRouterMode}
            >
              <Icon icon="icon-router" />
            </button>
            <button
              className={classnames({ active: mode === MODES.POLY })}
              onClick={this.startPolyMode}
            >
              <Icon icon="icon-poly" />
            </button>
            <button
              className={classnames({ active: mode === MODES.STICKERS })}
              onClick={this.startStickerMode}
            >
              <Icon icon="icon-sticker" />
            </button>

          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className={classnames({ active: mode === MODES.SHOTTER })}
              onClick={this.startShotterMode}
            >
              <Icon icon="icon-shooter" />
            </button>

            <button
              className={classnames('highlighted', { active: mode === MODES.SHOTTER })}
              onClick={this.startShotterMode}
            >
              <span>СХОРОНИТЬ</span>
              <Icon icon="icon-shooter" />
            </button>
          </div>

        </div>
      </div>
    );
  }
};
