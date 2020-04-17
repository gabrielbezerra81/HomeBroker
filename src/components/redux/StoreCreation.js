import React from "react";
import {
  createSelectorHook,
  createDispatchHook,
  useDispatch,
  useSelector,
} from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import MainAppReducer from "components/redux/reducers/MainAppReducer";
import { combinedReducersAppPrincipal } from "components/redux/reducers";

export const StorePrincipalContext = React.createContext();
export const GlobalContext = React.createContext();

export const useSelectorStorePrincipal = createSelectorHook(
  StorePrincipalContext
);
export const useSelectorGlobalStore = createSelectorHook(GlobalContext);

export const useDispatchStorePrincipal = createDispatchHook(
  StorePrincipalContext
);
export const useDispatchGlobalStore = createDispatchHook(GlobalContext);

export const StateBoletas = () => {
  return useSelector((state) => state);
};
export const StateStorePrincipal = () => {
  return useSelectorStorePrincipal((state) => state);
};
export const StateGlobalStore = () => {
  return useSelectorGlobalStore((state) => state);
};

export const DispatchBoletas = () => {
  return useDispatch();
};
export const DispatchStorePrincipal = () => {
  return useDispatchStorePrincipal();
};
export const DispatchGlobalStore = () => {
  return useDispatchGlobalStore();
};

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer,
});

//Usado para todos os outros dados gerais como os da tela principal
export const storeAppPrincipal = createStore(
  combinedReducersAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
export const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);
