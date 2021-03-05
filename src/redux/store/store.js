import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from '../sagas/index'
//import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/index';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['variants', 'communication', 'tableData', 'masterFilter']
  }

const persistedReducer = persistReducer(persistConfig, rootReducer)

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export const store = createStore(persistedReducer, composeEnhancers(
    applyMiddleware(
        sagaMiddleware,
        //loggerMiddleware
    ),
    // other store enhancers if any
));

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);