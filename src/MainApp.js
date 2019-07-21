import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import rootReducer from "./components/redux/reducers";
import { Button, Row, Col } from "react-bootstrap";
import {
  criarMostrarAppAction,
  mostrarAppAction,
  atualizarShowAction,
  atualizarDivKeyAction,
  fecharFormAction,
  abrirFormAction,
  aumentarZindexAction
} from "./components/redux/reducers/MainAppReducer";
import MainAppReducer from "./components/redux/reducers/MainAppReducer";
import "./css";
import App from "./components/App";
import { modalHeader } from "./components/utils/FormHeader";

export const GlobalContext = React.createContext();
export const localContext = React.createContext();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer
});

const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export const Helper = () => {
  return (
    <Provider store={globalStore} context={GlobalContext}>
      <MainAppConectado />
    </Provider>
  );
};

class MainApp extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Row style={{ paddingBottom: "0.5rem" }}>
            <Col md={2}>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="book"
              >
                <h6 name="book">Book de Ofertas</h6>
              </Button>
            </Col>
          </Row>
          <Row style={{ paddingBottom: "0.5rem" }}>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="compra_agendada"
              >
                <h6 name="compra_agendada">Compra Agendada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="compra_limitada"
              >
                <h6 name="compra_limitada">Compra Limitada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="compra_mercado"
              >
                <h6 name="compra_mercado">Compra a Mercado</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="compra_startstop"
              >
                <h6 name="compra_startstop">Compra Start/Stop</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={event => this.props.abrirFormAction(event, this.props)}
                name="compra_startmovel"
              >
                <h6 name="compra_startmovel">Compra Start Móvel</h6>
              </Button>
            </Col>

            <Col>
              {" "}
              <Button
                variant="primary"
                size="sm"
                name="compra_gainreducao"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="compra_gainreducao">Gain/Redução de compra</h6>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_agendada"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_agendada">Venda Agendada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_limitada"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_limitada">Venda Limitada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_mercado"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_mercado">Venda a Mercado</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_startstop"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_startstop">Venda Start/Stop</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_stop_movel"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_stop_movel">Venda Stop Móvel</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_gainreducao"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_gainreducao">Gain/Redução de venda</h6>
              </Button>
            </Col>
          </Row>
        </header>

        {this.props.apps.map(Subapp => Subapp)}
      </div>
    );
  }
}

//Responsável por criar uma store individual para cada sub-app
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
        <AppConectado
          appkey={this.props.index}
          indiceShow={this.props.indiceShow}
        />
      </Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex
  };
};

export const MainAppConectado = connect(
  mapStateToProps,
  {
    criarMostrarAppAction,
    mostrarAppAction,
    atualizarShowAction,
    atualizarDivKeyAction,
    abrirFormAction
  },
  null,
  { context: GlobalContext }
)(MainApp);

export const SubAppConectado = connect(
  mapStateToProps,
  {},
  null,
  { context: GlobalContext }
)(SubApp);

export const AppConectado = compose(
  connect(
    mapStateToProps,
    {
      aumentarZindexAction,
      fecharFormAction,
      abrirFormAction
    },
    null,
    { context: GlobalContext }
  )
)(App);

export const ModalHeaderConectado = connect(
  mapStateToProps,
  { fecharFormAction, abrirFormAction },
  null,
  { context: GlobalContext }
)(modalHeader);
