import { createStore, applyMiddleware, combineReducers, compose, Store } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { createBrowserHistory } from 'history';
import { editorLocationChanged } from '~/redux/editor/actions';
import { PersistConfig, Persistor } from 'redux-persist/es/types';

import { userReducer, IRootReducer } from '~/redux/user';
import { userSaga } from '~/redux/user/sagas';

import { editor, IEditorState } from '~/redux/editor';
import { editorSaga } from '~/redux/editor/sagas';

import { map, IMapReducer } from '~/redux/map';
import { mapSaga } from '~/redux/map/sagas';
import { watchLocation, getLocation } from '~/utils/window';
import { LatLngLiteral } from 'leaflet';
import { setUserLocation } from './user/actions';

const userPersistConfig: PersistConfig = {
  key: 'user',
  whitelist: ['user', 'logo', 'provider', 'speed'],
  storage,
};

export interface IState {
  user: IRootReducer;
  map: IMapReducer;
  editor: IEditorState;
}
// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

// redux extension composer
const composeEnhancers =
  typeof window === 'object' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export const store = createStore(
  combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    map,
    editor,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

export function configureStore(): { store: Store<any>; persistor: Persistor } {
  sagaMiddleware.run(userSaga);
  sagaMiddleware.run(mapSaga);
  sagaMiddleware.run(editorSaga);

  const persistor = persistStore(store);

  return { store, persistor };
}

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'REPLACE') return;
  store.dispatch(editorLocationChanged(location.pathname));
});

watchLocation((location: LatLngLiteral) => store.dispatch(setUserLocation(location)));
