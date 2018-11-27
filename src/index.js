import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';
import '$styles/main.less';

// import 'raleway-cyrillic/raleway.css';
// import 'typeface-pt-sans';

import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '$redux/store';

const { store, persistor } = configureStore();

export const Index = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));

// <PersistGate loading={null} persistor={persistor}>
