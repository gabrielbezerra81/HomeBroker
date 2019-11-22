import React, { Component } from "react";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./components/redux/reducers";
import { Row } from "react-bootstrap";
import "./css";
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
import { Animate } from "react-show";
import { AppConectado } from "components/redux/ElementosConectadosRedux";
import iconeMultileg from "img/iconeMultileg.png";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Possui o menu de ordens e encapsula todos os sub-apps.
export class MainApp extends Component {
  componentDidUpdate() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "divOrdens" &&
      this.props.ordensAberto === true
    ) {
      document.getElementById("divOrdens").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("divOrdens", this.props.zIndex, true);
    }
  }

  render() {
    const { props } = this;
    return (
      <div>
        <Animate
          show={props.ordensAberto}
          duration={100}
          preMount
          transitionOnMount
          stayMounted={true}
          start={startStyle}
        >
          <div
            className="divOrdens"
            id="divOrdens"
            onMouseOver={() => props.mouseOverAction(props, "ordensAberto")}
            onMouseLeave={() => props.mouseLeaveAction(props, "ordensAberto")}
          >
            <Row className="rowOrdensTracejada">
              <img src={iconeCompra} alt="" />
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraMercado}
                  alt=""
                  onClick={event => props.abrirFormAction(event, props)}
                  data-name="compra_mercado"
                  className="divClicavel"
                />
                <span>A mercado</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraLimitada}
                  alt=""
                  onClick={event => props.abrirFormAction(event, props)}
                  data-name="compra_limitada"
                  className="divClicavel"
                />
                <span>Limitada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraAgendada}
                  alt=""
                  onClick={event => props.abrirFormAction(event, props)}
                  data-name="compra_agendada"
                  className="divClicavel"
                />
                <span>Agendada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraStartStop}
                  alt=""
                  onClick={event => props.abrirFormAction(event, props)}
                  data-name="compra_startstop"
                  className="divClicavel"
                />
                <span>Start/Stop</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraStartMovel}
                  alt=""
                  onClick={event => props.abrirFormAction(event, props)}
                  data-
                  data-name="compra_startmovel"
                  className="divClicavel"
                />
                <span>Start Móvel</span>
              </div>
            </Row>
            <Row className="rowOrdensTracejada">
              <img src={iconeVenda} alt="" className="imagemVenda" />
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaMercado}
                  alt=""
                  data-name="venda_mercado"
                  onClick={event => props.abrirFormAction(event, props)}
                  className="divClicavel"
                />
                <span>A mercado</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaLimitada}
                  alt=""
                  data-
                  data-name="venda_limitada"
                  onClick={event => props.abrirFormAction(event, props)}
                  className="divClicavel"
                />
                <span>Limitada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaAgendada}
                  alt=""
                  data-name="venda_agendada"
                  onClick={event => props.abrirFormAction(event, props)}
                  className="divClicavel"
                />
                <span>Agendada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaStartStop}
                  alt=""
                  data-name="venda_startstop"
                  onClick={event => props.abrirFormAction(event, props)}
                  className="divClicavel"
                />
                <span>Start/Stop</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaStopMovel}
                  alt=""
                  data-name="venda_stopmovel"
                  onClick={event => props.abrirFormAction(event, props)}
                  className="divClicavel"
                />
                <span>Stop Móvel</span>
              </div>
            </Row>
            <Row className="rowSpeciais">
              <span className="mr-5">ESPECIAIS</span>
              <div className="divBotaoFormulario">
                <img
                  src={iconeMultileg}
                  alt="Multileg"
                  onClick={() => {
                    props.atualizarDivKeyAction("multileg");
                    props.abrirItemBarraLateralAction(props, "multilegAberto");
                  }}
                  className="divClicavel"
                />
                <span>MULTILEG</span>
              </div>
            </Row>
          </div>
        </Animate>
        {props.apps.map(Subapp => Subapp)}
      </div>
    );
  }
}

//Responsável por criar uma store individual para cada sub-app e encapsulá-los. Cada sub-app contem os 12 formularios de compra e venda
export class SubApp extends Component {
  constructor(props) {
    super(props);

    this.store = createStore(
      rootReducer,
      {},
      composeEnhancers(applyMiddleware(ReduxThunk))
    );
  }
  render() {
    const { props } = this;
    return (
      <Provider store={this.store}>
        <// @ts-ignore
        AppConectado
          appkey={props.index}
          indiceShow={props.indiceShow}
          codigoBook={props.codigoBook}
        />
      </Provider>
    );
  }
}
