/*

  todo public maps
    todo editing map on map list
    todo setting map public on map list

  done add ability to copy-paste address after saving
  todo save progress

  done hide sticker dialog on sticker selection
    done separate mode for sticker selection
  done TEST: set initialData after saving map, clear is-modified
  done TEST: provider / logo triggers setChanged
  done shot mechanism (100%)
    done client-side shot mechanism
    done croppr.js
    done shot stickers
    done progress
  done hotkeys via sagas
  done better loader screen
    done network errors handling on startup

  done map catalogue
    done public maps
    done map search
    todo map list lazy loading

  todo tooltips

  done better poly editor https://github.com/SupriyaSudhindra/leaflet-editable-polyline
    todo update after point delete

  done stickers drag on rotate bug

  todo network operations notify
    done delayed notify (delay(2000).then(showLoadingMsg))
    todo network error notifications
    todo check canvas support at startup
    todo check osrm is up

  todo map preview on save
 */
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '$containers/App';
import '$styles/main.less';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '$redux/store';
import { pushLoaderState } from '$utils/history';

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
