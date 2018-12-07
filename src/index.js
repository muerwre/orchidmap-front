/*
  done shot mechanism (100%)
    done client-side shot mechanism
    done croppr.js
    done shot stickers
    todo progress

  todo hotkeys via sagas
  todo map catalogue
    todo public maps
    todo map search
    todo map lazy loading

  todo tooltips

  todo better poly editor https://github.com/SupriyaSudhindra/leaflet-editable-polyline

  todo network operations notify
    todo delayed notify (delay(2000).then(showLoadingMsg))
    todo network error notifications
    todo check canvas support at startup
    todo check osrm is up

  todo better loader screen
    todo network errors handling on startup

  todo map preview on save
 */
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';
import '$styles/main.less';

import { Provider } from 'react-redux';
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
