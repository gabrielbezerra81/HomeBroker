import React from "react";
import ReactDOM from "react-dom";
// import LogRocket from "logrocket";
// import setupLogRocketReact from "logrocket-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "@fortawesome/fontawesome-free/css/all.css";
import { Helper } from "redux/ElementosConectadosRedux";
import PerfectScrollbar from "react-perfect-scrollbar";

// LogRocket.init("g32h7d/react-homebroker");
// setupLogRocketReact(LogRocket);

ReactDOM.render(
  <PerfectScrollbar id="scrollbarPrincipal">{Helper()}</PerfectScrollbar>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
