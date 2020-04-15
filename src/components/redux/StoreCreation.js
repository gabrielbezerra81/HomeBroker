import React from "react";
import { createSelectorHook } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import MainAppReducer from "components/redux/reducers/MainAppReducer";
import { combinedReducersAppPrincipal } from "components/redux/reducers";

export const GlobalContext = React.createContext();
export const StorePrincipalContext = React.createContext();

// @ts-ignore

export const useSelectorGlobalStore = createSelectorHook(GlobalContext);
export const useSelectorStorePrincipal = createSelectorHook(
  StorePrincipalContext
);

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer,
});

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
export const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

//Usado para todos os outros dados gerais como os da tela principal
export const storeAppPrincipal = createStore(
  combinedReducersAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);
