import React, { Component } from "react";
import { Provider } from "react-redux";
import App from "./components/App";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./components/redux/reducers";
import { Button } from "react-bootstrap";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = { apps: [] };
    this.criarApp = this.criarApp.bind(this);
    this.removerApp = this.removerApp.bind(this);
  }

  criarApp() {
    let apps = [...this.state.apps];
    console.log("index", apps.length);
    let sub = (
      <SubApp
        key={apps.length}
        index={apps.length}
        removerApp={this.removerApp}
      />
    );
    apps.push(sub);
    this.setState({ apps });
  }

  removerApp(index) {
    let apps = [...this.state.apps];
    console.log("index", index);
    apps.splice(index, 1);
    this.setState({ apps });
  }

  render() {
    return (
      <div>
        <Button variant="primary" size="sm" onClick={() => this.criarApp()}>
          <h6>Criar App</h6>
        </Button>

        {this.state.apps.map(Subapp => Subapp)}
      </div>
    );
  }
}

//Responsável por criar uma store individual para cada app
class SubApp extends Component {
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
        <App removerApp={this.props.removerApp} appkey={this.props.index} />
      </Provider>
    );
  }
}
