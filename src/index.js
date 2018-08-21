import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';

import '$styles/map.less';
import '$styles/controls.less';

export const Index = () => (
  <App />
);

ReactDOM.render(<Index />, document.getElementById('index'));
