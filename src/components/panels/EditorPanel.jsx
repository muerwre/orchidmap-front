import React from 'react';
import { MODES } from '$constants/modes';
import classnames from 'classnames';

import { Icon } from '$components/Icon';

export class EditorPanel extends React.PureComponent {
  startPolyMode = () => this.props.editor.changeMode(MODES.POLY);

  startStickerMode = () => this.props.editor.changeMode(MODES.STICKERS);

  startRouterMode = () => this.props.editor.changeMode(MODES.ROUTER);

  startShotterMode = () => this.props.editor.changeMode(MODES.SHOTTER);

  render() {
    const { mode } = this.props;

    return (
      <div id="control-screen">
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

        <button
          className={classnames({ active: mode === MODES.SHOTTER })}
          onClick={this.startShotterMode}
        >
          <Icon icon="icon-shooter" />
        </button>
      </div>
    );
  }
};
