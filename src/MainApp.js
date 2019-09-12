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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Possui o menu de ordens e encapsula todos os sub-apps.
export class MainApp extends Component {
  componentDidUpdate() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "divOrdens" &&
      this.props.ordensAberto === true
    ) {
      console.log(1);
      document.getElementById("divOrdens").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("divOrdens", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <div>
        <Animate
          show={this.props.ordensAberto}
          duration={100}
          preMount
          transitionOnMount
          stayMounted={true}
          start={startStyle}
        >
          <div
            className="divOrdens"
            id="divOrdens"
            onMouseOver={() =>
              this.props.mouseOverAction(this.props, "ordensAberto")
            }
            onMouseLeave={() =>
              this.props.mouseLeaveAction(this.props, "ordensAberto")
            }
          >
            <Row className="rowOrdensTracejada">
              <img src={iconeCompra} alt="" />
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraMercado}
                  alt=""
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  name="compra_mercado"
                  className="divClicavel"
                />
                <span>A mercado</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraLimitada}
                  alt=""
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  name="compra_limitada"
                  className="divClicavel"
                />
                <span>Limitada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraAgendada}
                  alt=""
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  name="compra_agendada"
                  className="divClicavel"
                />
                <span>Agendada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraStartStop}
                  alt=""
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  name="compra_startstop"
                  className="divClicavel"
                />
                <span>Start/Stop</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeCompraStartMovel}
                  alt=""
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  name="compra_startmovel"
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
                  name="venda_mercado"
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  className="divClicavel"
                />
                <span>A mercado</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaLimitada}
                  alt=""
                  name="venda_limitada"
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  className="divClicavel"
                />
                <span>Limitada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaAgendada}
                  alt=""
                  name="venda_agendada"
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  className="divClicavel"
                />
                <span>Agendada</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaStartStop}
                  alt=""
                  name="venda_startstop"
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
                  className="divClicavel"
                />
                <span>Start/Stop</span>
              </div>
              <div className="divBotaoFormulario">
                <img
                  src={iconeVendaStopMovel}
                  alt=""
                  name="venda_stop_movel"
                  onClick={event =>
                    this.props.abrirFormAction(event, this.props)
                  }
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
                    this.props.atualizarDivKeyAction("multileg");
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "multilegAberto"
                    );
                  }}
                  className="divClicavel"
                />
                <span>MULTILEG</span>
              </div>
            </Row>
          </div>
        </Animate>
        {this.props.apps.map(Subapp => Subapp)}
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
