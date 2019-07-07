import React, { Component } from "react";
import { Provider } from "react-redux";
import App from "./App";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./components/redux/reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default class SubApp extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      rootReducer,
      {},
      composeEnhancers(applyMiddleware(ReduxThunk))
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    );
  }
}
