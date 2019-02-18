/*

  ## BUGS

  done adding/removing points doesn't change distance
  done cancelling editing someone's else map return back to it's original address /razminochnyj/
  done change title on route opening
  done delete sticker icon
  todo fix arrows (can't reproduce now :-( )

  ## FEATURES

  todo hide arrows on small zooms
  todo hide stickers and route on small zooms (?)

  todo selecting logo on crop

  todo public maps
    todo editing map on map list
    todo setting map public on map list

  done map catalogue
    done public maps
    done map search
    todo map list lazy loading

  todo network operations notify
    done delayed notify (delay(2000).then(showLoadingMsg))
    todo network error notifications
    todo check canvas support at startup
    todo check osrm is up

  todo tooltips for panel items
  todo maybe: map preview on save
  todo maybe: stickers clusterization?

  ## DONE

  done save spinner
  done better poly editor https://github.com/SupriyaSudhindra/leaflet-editable-polyline
    done update after point delete
    done hidden markers tooltip

  done clear routing on editing cancellation
  done riding speed slider
  done dont close map list on click
  done fix loaded stickers has wrong text placement for right-sided captions
  done fix save button should not react to clicks
  done stickers with empty text should not have blackbox at view mode
  done add ability to copy-paste address after saving

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

  done stickers drag on rotate bug
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
