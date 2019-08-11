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
import iconeCompra from "img/compra/IconeCompra.png";
import iconeCompraMercado from "img/compra/iconeCompraMercado.png";
import iconeCompraLimitada from "img/compra/iconeCompraLimitada.png";
import iconeCompraAgendada from "img/compra/iconeCompraAgendada.png";
import iconeCompraStartStop from "img/compra/iconeCompraStartStop.png";
import iconeCompraStartMovel from "img/compra/iconeCompraStartMovel.png";
import iconeVenda from "img/venda/iconeVenda.png";
import iconeVendaMercado from "img/venda/iconeVendaMercado.png";
import iconeVendaLimitada from "img/venda/iconeVendaLimitada.png";
import iconeVendaAgendada from "img/venda/iconeVendaAgendada.png";
import iconeVendaStartStop from "img/venda/iconeVendaStartStop.png";
import iconeVendaStopMovel from "img/venda/iconeVendaStopMovel.png";

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

class MainApp extends Component {
  render() {
    return (
      <div className="divOrdens" id="divOrdens">
        <Row className="rowOrdensTracejada">
          <img src={iconeCompra} alt="" />
          <div className="divBotaoFormulario">
            <img
              src={iconeCompraMercado}
              alt=""
              onClick={event => this.props.abrirFormAction(event, this.props)}
              name="compra_mercado"
              className="divClicavel"
            />
            <span>A mercado</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeCompraLimitada}
              alt=""
              onClick={event => this.props.abrirFormAction(event, this.props)}
              name="compra_limitada"
              className="divClicavel"
            />
            <span>Limitada</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeCompraAgendada}
              alt=""
              onClick={event => this.props.abrirFormAction(event, this.props)}
              name="compra_agendada"
              className="divClicavel"
            />
            <span>Agendada</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeCompraStartStop}
              alt=""
              onClick={event => this.props.abrirFormAction(event, this.props)}
              name="compra_startstop"
              className="divClicavel"
            />
            <span>Start/Stop</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeCompraStartMovel}
              alt=""
              onClick={event => this.props.abrirFormAction(event, this.props)}
              name="compra_startmovel"
              className="divClicavel"
            />
            <span>Start Móvel</span>
          </div>
        </Row>
        <Row className="rowOrdensTracejada">
          <img src={iconeVenda} alt="" />
          <div className="divBotaoFormulario">
            <img
              src={iconeVendaMercado}
              alt=""
              name="venda_mercado"
              onClick={event => this.props.abrirFormAction(event, this.props)}
              className="divClicavel"
            />
            <span>A mercado</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeVendaLimitada}
              alt=""
              name="venda_limitada"
              onClick={event => this.props.abrirFormAction(event, this.props)}
              className="divClicavel"
            />
            <span>Limitada</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeVendaAgendada}
              alt=""
              name="venda_agendada"
              onClick={event => this.props.abrirFormAction(event, this.props)}
              className="divClicavel"
            />
            <span>Agendada</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeVendaStartStop}
              alt=""
              name="venda_startstop"
              onClick={event => this.props.abrirFormAction(event, this.props)}
              className="divClicavel"
            />
            <span>Start/Stop</span>
          </div>
          <div className="divBotaoFormulario">
            <img
              src={iconeVendaStopMovel}
              alt=""
              name="venda_stop_movel"
              onClick={event => this.props.abrirFormAction(event, this.props)}
              className="divClicavel"
            />
            <span>Stop Móvel</span>
          </div>
        </Row>
        <Row />
        <div>{this.props.apps.map(Subapp => Subapp)}</div>
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
