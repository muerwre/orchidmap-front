import React from 'react';

import { Editor } from '$modules/Editor';
import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';

export class App extends React.Component {
  state = {
    mode: 'none',
    routerPoints: 0,
  };

  setMode = mode => {
    this.setState({ mode });
  };
  setRouterPoints = routerPoints => {
    this.setState({ routerPoints });
  };

  editor = new Editor({
    container: 'map',
    mode: this.state.mode,
    setMode: this.setMode,
    setRouterPoints: this.setRouterPoints,
  });

  render() {
    const {
      editor,
      state: { mode, routerPoints },
    } = this;


    return (
      <div>
        <Fills />
        <EditorPanel
          editor={editor}
          mode={mode}
          routerPoints={routerPoints}
        />
      </div>
    );
  }
}
