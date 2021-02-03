import React from "react";
import ReactDOM from "react-dom";
import { setAutoFreeze } from "immer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index";
import "@fortawesome/fontawesome-free/css/all.css";
import { Routes } from "routing/routes";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  StorePrincipalContext,
  globalStore,
  GlobalContext,
  storeAppPrincipal,
  persistor,
} from "redux/StoreCreation";
import PermissionProvider from "context/PermissionContext";

setAutoFreeze(false);

ReactDOM.render(
  <Provider store={globalStore} context={GlobalContext}>
    <Provider store={storeAppPrincipal} context={StorePrincipalContext}>
      <PersistGate loading={null} persistor={persistor}>
        <PerfectScrollbar id="scrollbarPrincipal">
          <PermissionProvider>
            <Routes />
          </PermissionProvider>
        </PerfectScrollbar>
      </PersistGate>
    </Provider>
  </Provider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()

// <React.StrictMode>
// </React.StrictMode>,
