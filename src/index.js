import React from 'react';
import ReactDOM from 'react-dom';


import { App } from '$containers/App';
import '$styles/main.less';

// import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import configureStore, { history } from '$redux/store';
// const { store, persistor } = configureStore();

export const Index = () => (
  <App />
);

ReactDOM.render(<Index />, document.getElementById('index'));
