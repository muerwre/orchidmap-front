import React from 'react';

import { Editor } from '$modules/Editor';
import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';

export class App extends React.Component {
  state = {
    mode: 'none',
    editor: null,
  };

  componentDidMount() {
    const container = 'map';
    const { mode } = this.state;

    const editor = new Editor({
      container,
      mode,
      setMode: this.setMode,
    });

    this.setState({ editor })
  }

  setMode = mode => {
    this.setState({ mode });
  };

  render() {
    const {
      state: { mode, editor },
    } = this;


    return (
      <div>
        <Fills />
        <div id="map" />
        <EditorPanel editor={editor} mode={mode} />
      </div>
    );
  }
}
