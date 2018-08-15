import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';

// import { configs } from '$constants/moment';
import configureStore, { history } from '$redux/store';

const { store, persistor } = configureStore();

// import './js/common';
// import './js/script';
import './css/style.css';

export const Index = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));
