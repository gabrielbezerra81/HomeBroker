import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
// import * as serviceWorker from "./serviceWorker";
import "@fortawesome/fontawesome-free/css/all.css";
import { Helper } from "redux/ElementosConectadosRedux";
import PerfectScrollbar from "react-perfect-scrollbar";

ReactDOM.render(
  <React.StrictMode>
    <PerfectScrollbar id="scrollbarPrincipal">{Helper()}</PerfectScrollbar>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
