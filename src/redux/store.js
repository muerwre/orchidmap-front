import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { userReducer } from '$redux/user/reducer';
import { userSaga } from '$redux/user/sagas';

const userPersistConfig = {
  key: 'user',
  whitelist: ['user', 'logo', 'provider'],
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
    user: persistReducer(userPersistConfig, userReducer),
    // routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(/* routerMiddleware(history), */ sagaMiddleware))
);

export function configureStore() {
  sagaMiddleware.run(userSaga);

  const persistor = persistStore(store);

  return { store, persistor };
}
