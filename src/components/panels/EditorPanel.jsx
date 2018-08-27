import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { toHours } from '$utils/time';

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

  render() {
    const {
      mode, routerPoints, editor, totalDistance, estimateTime, activeSticker, logo,
    } = this.props;

    return (
      <div>

        <EditorDialog
          mode={mode}
          routerPoints={routerPoints}
          activeSticker={activeSticker}
          editor={editor}
          logo={logo}
        />

        <LogoPreview logo={logo} />

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
          <div className="control-dist">
            {(totalDistance > 0)
              ?
                <React.Fragment>
                  {totalDistance} км
                  <Icon icon="icon-cycle" size={32} />
                  {
                    (estimateTime > 0) && (estimateTime > 0) && <span>{toHours(estimateTime)}</span>
                  }
                </React.Fragment>
              :
                <div onClick={() => editor.changeMode(MODES.ROUTER)}>
                  <div className="button danger">Начать рисовать</div>
                </div>
            }
          </div>

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
              className={classnames({ active: mode === MODES.TRASH })}
              onClick={this.startTrashMode}
            >
              <Icon icon="icon-trash" />
            </button>

            <button
              className={classnames({ active: mode === MODES.LOGO })}
              onClick={this.startLogoMode}
            >
              <Icon icon="icon-logo" />
            </button>

            <button
              className="highlighted"
            >
              <span>СХОРОНИТЬ</span>
              <Icon icon="icon-save" />
            </button>
          </div>

        </div>
      </div>
    );
  }
}
