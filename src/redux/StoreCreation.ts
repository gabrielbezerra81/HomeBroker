import React from "react";
import { ReactReduxContextValue } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// import LogRocket from "logrocket";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import MainAppReducer from "redux/reducers/MainAppReducer";
import { combinedReducersAppPrincipal } from "redux/reducers";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ["telaPrincipalReducer"],
};

const persistedReducerAppPrincipal = persistReducer<any, any>(
  persistConfig,
  combinedReducersAppPrincipal
);

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer,
});

//Usado para todos os outros dados gerais como os da tela principal
export const storeAppPrincipal = createStore(
  persistedReducerAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk)) //, LogRocket.reduxMiddleware()
);

export const persistor = persistStore(storeAppPrincipal);

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
export const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk)) //, LogRocket.reduxMiddleware()
);

export const StorePrincipalContext = React.createContext<
  ReactReduxContextValue
>({ store: storeAppPrincipal, storeState: {} });

export const GlobalContext = React.createContext<ReactReduxContextValue>({
  store: globalStore,
  storeState: {},
});
