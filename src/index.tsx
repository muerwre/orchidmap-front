import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '~/containers/App';
import '~/styles/main.less';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '~/redux/store';
import { pushLoaderState } from '~/utils/history';

const { store, persistor } = configureStore();

pushLoaderState(10);

export const Index = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  (function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./service-worker.js', { scope: '/' })
        .then(() => console.log('Service Worker registered successfully.'))
        .catch(error => console.log('Service Worker registration failed:', error));
    }
  })();
}
