import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';

export const Index = () => (
  <App />
);

ReactDOM.render(<Index />, document.getElementById('index'));
