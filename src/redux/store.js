import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
// import { routerReducer, routerMiddleware } from 'react-router-redux';

import { authReducer } from '$redux/auth/reducer';
import { authSaga } from '$redux/auth/sagas';

const authPersistConfig = {
  key: 'auth',
  blacklist: [],
  storage,
};

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

// redux extension composer
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
/* eslint-enable no-underscore-dangle */

// export const history = createHistory();

export const store = createStore(
  combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    // routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(
    // routerMiddleware(history),
    sagaMiddleware
  ))
);

export function configureStore() {
  // run sagas
  sagaMiddleware.run(authSaga);

  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
