import React from "react";
import { ReactReduxContextValue } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// import LogRocket from "logrocket";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import GlobalReducer from "redux/reducers/GlobalReducer";
import SystemReducer from "./reducers/system/SystemReducer";

import MultilegReducer from "modules/multileg/duck/MultilegReducer";
import PositionReducer from "modules/position/duck/PositionReducer";
import OrdensExecucaoReducer from "modules/ordersExec/duck/OrdensExecReducer";
import FinancialPlannerReducer from "modules/financialPlanner/duck/FinancialPlannerReducer";
import multiBoxReducer from "modules/multiBox/duck/multiBoxReducer";
import CategoryListReducer from "modules/categoryList/duck/CategoryListReducer";
import optionsTableReducer from "modules/optionsTable/duck/optionsTableReducer";
import THLReducer from "modules/thl/duck/THLReducer";

let rehydrationComplete: any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let rehydrationFailed: any;

const rehydrationPromise = new Promise((resolve, reject) => {
  rehydrationComplete = resolve;
  rehydrationFailed = reject;
});

const rootPersistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ["multilegReducer"], // "multiBoxReducer"
};

const systemReducerPersistConfig = {
  key: "SystemReducer",
  storage,
  stateReconciler: autoMergeLevel1,
  blacklist: ["hasAuthorizationHeader"], // "multiBoxReducer"
};

const rootReducer = combineReducers({
  systemReducer: persistReducer(systemReducerPersistConfig, SystemReducer),
  multilegReducer: MultilegReducer,
  positionReducer: PositionReducer,
  ordersExecReducer: OrdensExecucaoReducer,
  thlReducer: THLReducer,
  financialPlannerReducer: FinancialPlannerReducer,
  multiBoxReducer,
  categoryListReducer: CategoryListReducer,
  optionsTableReducer,
});

export type MainStoreState = ReturnType<typeof rootReducer>;

const persistedReducerAppPrincipal = persistReducer<MainStoreState, any>(
  rootPersistConfig,
  rootReducer,
);

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  GlobalReducer,
});

type GlobalStoreState = ReturnType<typeof combinedReducers>;

//Usado para todos os outros dados gerais como os da tela principal
export const storeAppPrincipal = createStore(
  persistedReducerAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk)), //, LogRocket.reduxMiddleware()
);

export const persistor = persistStore(storeAppPrincipal, null, () => {
  rehydrationComplete();
});

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
export const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk)), //, LogRocket.reduxMiddleware()
);

export const StorePrincipalContext = React.createContext<
  ReactReduxContextValue<MainStoreState, any>
>({ store: storeAppPrincipal, storeState: {} as MainStoreState });

export const GlobalContext = React.createContext<
  ReactReduxContextValue<GlobalStoreState, any>
>({
  store: globalStore,
  storeState: {} as GlobalStoreState,
});

export async function rehydration() {
  return rehydrationPromise;
}

(async () => {
  try {
    await rehydration();
  } catch (e) {}
})();
