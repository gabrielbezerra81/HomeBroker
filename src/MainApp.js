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
  aumentarZindexAction,
  receberAppPropsAction
} from "./components/redux/reducers/MainAppReducer";
import MainAppReducer from "./components/redux/reducers/MainAppReducer";
import "./css";
import App from "./components/App";
import { modalHeader } from "./components/utils/FormHeader";
import TelaPrincipal from "components/tela_principal/TelaPrincipal";
import TelaPrincipalReducer from "components/redux/reducers/TelaPrincipalReducer";
import iconeCompra from "img/IconeCompra.png";
import iconeCompra2 from "img/iconeCompra2.png";
import iconeCompra3 from "img/iconeCompra3.png";
import iconeCompra4 from "img/iconeCompra4.png";
import iconeCompra5 from "img/iconeCompra5.png";
import iconeCompra6 from "img/iconeCompra6.png";
import iconeVenda from "img/iconeVenda.png";
import iconeVenda2 from "img/iconeVenda2.png";
import iconeVenda3 from "img/iconeVenda3.png";
import iconeVenda4 from "img/iconeVenda4.png";
import iconeVenda5 from "img/iconeVenda5.png";
import iconeVenda6 from "img/iconeVenda6.png";

export const GlobalContext = React.createContext();
export const localContext = React.createContext();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer
});

const combinedAppPrincipal = combineReducers({
  telaPrincipalReducer: TelaPrincipalReducer
});

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

//Usado para todos os outros dados gerais como os da tela principal
const storeAppPrincipal = createStore(
  combinedAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export const Helper = () => {
  return (
    <Provider store={globalStore} context={GlobalContext}>
      <Provider store={storeAppPrincipal}>
        <TelaPrincipal />
      </Provider>
    </Provider>
  );
};
/*
      <div className="App">
          <Row style={{ paddingBottom: "0.5rem" }}>
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
                name="venda_gainreducao"
                onClick={event => this.props.abrirFormAction(event, this.props)}
              >
                <h6 name="venda_gainreducao">Gain/Redução de venda</h6>
              </Button>
            </Col>
          </Row>
      </div>
*/
class MainApp extends Component {
  render() {
    return (
      <div className="divOrdens" id="divOrdens">
        <Row className="rowOrdensTracejada">
          <img src={iconeCompra} alt="" />
          <img
            src={iconeCompra2}
            alt=""
            onClick={event => this.props.abrirFormAction(event, this.props)}
            name="compra_agendada"
            className="divClicavel"
          />
          <img
            src={iconeCompra3}
            alt=""
            onClick={event => this.props.abrirFormAction(event, this.props)}
            name="compra_limitada"
            className="divClicavel"
          />
          <img
            src={iconeCompra4}
            alt=""
            onClick={event => this.props.abrirFormAction(event, this.props)}
            name="compra_mercado"
            className="divClicavel"
          />
          <img
            src={iconeCompra5}
            alt=""
            onClick={event => this.props.abrirFormAction(event, this.props)}
            name="compra_startstop"
            className="divClicavel"
          />
          <img
            src={iconeCompra6}
            alt=""
            onClick={event => this.props.abrirFormAction(event, this.props)}
            name="compra_startmovel"
            className="divClicavel"
          />
        </Row>
        <Row className="rowOrdensTracejada">
          <img src={iconeVenda} alt="" />
          <img
            src={iconeVenda2}
            alt=""
            name="venda_agendada"
            onClick={event => this.props.abrirFormAction(event, this.props)}
            className="divClicavel"
          />
          <img
            src={iconeVenda3}
            alt=""
            name="venda_limitada"
            onClick={event => this.props.abrirFormAction(event, this.props)}
            className="divClicavel"
          />
          <img
            src={iconeVenda4}
            alt=""
            name="venda_mercado"
            onClick={event => this.props.abrirFormAction(event, this.props)}
            className="divClicavel"
          />
          <img
            src={iconeVenda5}
            alt=""
            name="venda_startstop"
            onClick={event => this.props.abrirFormAction(event, this.props)}
            className="divClicavel"
          />
          <img
            src={iconeVenda6}
            alt=""
            name="venda_stop_movel"
            onClick={event => this.props.abrirFormAction(event, this.props)}
            className="divClicavel"
          />
        </Row>
        <Row />
        <div>{this.props.apps.map(Subapp => Subapp)}</div>
      </div>
    );
  }
}

/*
<div className="divOrdens" id="divOrdens">
              <Row className="rowOrdensTracejada">
                <img src={iconeCompra} alt="" />
                <img src={iconeCompra2} alt="" />
                <img src={iconeCompra3} alt="" />
                <img src={iconeCompra4} alt="" />
                <img src={iconeCompra5} alt="" />
                <img src={iconeCompra6} alt="" />
              </Row>
              <Row className="rowOrdensTracejada">
                <img src={iconeVenda} alt="" />
                <img src={iconeVenda2} alt="" />
                <img src={iconeVenda3} alt="" />
                <img src={iconeVenda4} alt="" />
                <img src={iconeVenda5} alt="" />
                <img src={iconeVenda6} alt="" />
              </Row>
              <Row />
            </div>
*/

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

const mapStateToPropsLocal = state => ({});

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
  ),
  connect(
    mapStateToPropsLocal,
    { receberAppPropsAction }
  )
)(App);

export const ModalHeaderConectado = connect(
  mapStateToProps,
  { fecharFormAction, abrirFormAction },
  null,
  { context: GlobalContext }
)(modalHeader);
