import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';

import '$styles/main.less';

export const Index = () => (
  <App />
);

ReactDOM.render(<Index />, document.getElementById('index'));
