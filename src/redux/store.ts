import { createStore, applyMiddleware, combineReducers, compose, Store } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { userReducer } from '$redux/user/reducer';
import { userSaga } from '$redux/user/sagas';
import { createBrowserHistory } from 'history';
import { locationChanged } from '$redux/user/actions';
import { PersistConfig, Persistor } from "redux-persist/es/types";

const userPersistConfig: PersistConfig = {
  key: 'user',
  whitelist: ['user', 'logo', 'provider', 'speed'],
  storage,
};

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

// redux extension composer
const composeEnhancers =
  typeof window === 'object' &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export const store = createStore(
  combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    // routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(/* routerMiddleware(history), */ sagaMiddleware))
);

export function configureStore(): { store: Store<any>, persistor: Persistor } {
  sagaMiddleware.run(userSaga);

  const persistor = persistStore(store);

  return { store, persistor };
}

export const history = createBrowserHistory();
// export const historyListener = history.listen((location, action) => {
//   if (action === 'REPLACE') return;
//   store.dispatch(locationChanged(location.pathname));
// });
