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
import BookOfertas from "./components/forms/book_Ofertas/BookOfertas";
import CompraAgendada from "./components/forms/compra_Agendada/CompraAgendada";
import CompraLimitada from "./components/forms/compra_Limitada/CompraLimitada";
import CompraMercado from "./components/forms/compra_Mercado/CompraMercado";
import CompraStartStop from "./components/forms/compra_StartStop/CompraStartStop";
import CompraStartMovel from "./components/forms/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "./components/forms/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "./components/forms/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./components/forms/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./components/forms/venda/venda_Mercado/VendaMercado";
import VendaStartStop from "./components/forms/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./components/forms/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./components/forms/venda/venda_GainReducao/VendaGainReducao";

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
      <MainApli />
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
        <ApConectado
          appkey={this.props.index}
          indiceShow={this.props.indiceShow}
        />
      </Provider>
    );
  }
}

class Ap extends React.Component {
  componentDidUpdate() {
    if (this.props.divkey !== "")
      document.getElementById(this.props.divkey).style.zIndex =
        this.props.zIndex + 1;
  }

  render() {
    return (
      <div className="App">
        <Row className="appbody">
          {this.props.show[this.props.indiceShow].book ? (
            <div
              id={`book${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `book${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].book
                )
              }
            >
              <BookOfertas
                close={() => {
                  this.props.fecharFormAction(this.props, "book");
                }}
                name="book"
              />
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_agendada ? (
            <div
              id={`compra_agendada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_agendada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_agendada
                )
              }
            >
              <CompraAgendada
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_agendada");
                }}
                headerTitle="COMPRA AGENDADA"
                name="compra_agendada"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_limitada ? (
            <div
              id={`compra_limitada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_limitada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_limitada
                )
              }
            >
              <CompraLimitada
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_limitada");
                }}
                headerTitle="COMPRA LIMITADA"
                name="compra_limitada"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_mercado ? (
            <div
              id={`compra_mercado${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_mercado${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_mercado
                )
              }
            >
              <CompraMercado
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_mercado");
                }}
                headerTitle="COMPRA A MERCADO"
                name="compra_mercado"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_startstop ? (
            <div
              id={`compra_startstop${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_startstop${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_startstop
                )
              }
            >
              <CompraStartStop
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_startstop");
                }}
                headerTitle="COMPRA START STOP"
                name="compra_startstop"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].compra_startmovel ? (
            <div
              id={`compra_startmovel${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_startmovel${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_startmovel
                )
              }
            >
              <CompraStartMovel
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_startmovel");
                }}
                headerTitle="COMPRA START MÓVEL"
                name="compra_startmovel"
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].compra_gainreducao ? (
            <div
              id={`compra_gainreducao${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_gainreducao${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_gainreducao
                )
              }
            >
              <CompraGainReducao
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_gainreducao");
                }}
                headerTitle="GAIN / REDUÇÃO DE COMPRA"
                name="compra_gainreducao"
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_agendada ? (
            <div
              id={`venda_agendada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_agendada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_agendada
                )
              }
            >
              <VendaAgendada
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_agendada");
                }}
                headerTitle="VENDA AGENDADA"
                name="venda_agendada"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_limitada ? (
            <div
              id={`venda_limitada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_limitada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_limitada
                )
              }
            >
              <VendaLimitada
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_limitada");
                }}
                headerTitle="VENDA LIMITADA"
                name="venda_limitada"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_mercado ? (
            <div
              id={`venda_mercado${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_mercado${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_mercado
                )
              }
            >
              <VendaMercado
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_mercado");
                }}
                headerTitle="VENDA MERCADO"
                name="venda_mercado"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_startstop ? (
            <div
              id={`venda_startstop${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_startstop${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_startstop
                )
              }
            >
              <VendaStartStop
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_startstop");
                }}
                headerTitle="VENDA START STOP"
                name="venda_startstop"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_stop_movel ? (
            <div
              id={`venda_stop_movel${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_stop_movel${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_stop_movel
                )
              }
            >
              <VendaStopMovel
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_stop_movel");
                }}
                headerTitle="VENDA STOP MÓVEL"
                name="venda_stop_movel"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_gainreducao ? (
            <div
              id={`venda_gainreducao${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_gainreducao${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_gainreducao
                )
              }
            >
              <VendaGainReducao
                close={() => {
                  this.props.fecharFormAction(this.props, "venda_gainreducao");
                }}
                headerTitle="GAIN / REDUÇÃO DE VENDA"
                name="venda_gainreducao"
                handleShow={event => {
                  this.props.abrirFormAction(event, this.props);
                }}
              />
            </div>
          ) : null}
        </Row>
      </div>
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

export const MainApli = connect(
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

export const Sub = connect(
  mapStateToProps,
  {},
  null,
  { context: GlobalContext }
)(SubApp);

export const ApConectado = compose(
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
)(Ap);
