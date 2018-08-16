import React from 'react';

import { Editor } from '$modules/Editor';

import { MapScreen } from '$styles/mapScreen';
import { ControlsScreen } from '$styles/controlsScreen';
import { MODES } from '$constants/modes';

export class App extends React.Component {
  state = {
    mode: 'none',
  };

  componentDidMount() {
    const container = 'map';
    const { mode } = this.state;

    this.editor = new Editor({
      container,
      mode,
      setMode: this.setMode,
    });
  }

  setMode = mode => {
    this.setState({ mode });
  };

  startPolyMode = () => this.editor.changeMode(MODES.POLY);

  startStickerMode = () => this.editor.changeMode(MODES.STICKERS);

  startRouterMode = () => this.editor.changeMode(MODES.ROUTER);

  render() {
    const { mode } = this.state;

    return (
      <div>
        <MapScreen />
        <ControlsScreen>
          <button onClick={this.startPolyMode}>
            {mode === MODES.POLY && '-->'}{MODES.POLY}
          </button>
          <button onClick={this.startStickerMode}>
            {mode === MODES.STICKERS && '-->'}{MODES.STICKERS}
          </button>
          <button onClick={this.startRouterMode}>
            {mode === MODES.ROUTER && '-->'}{MODES.ROUTER}
          </button>
        </ControlsScreen>
      </div>
    );
  }
}
