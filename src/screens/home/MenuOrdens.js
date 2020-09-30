import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Row } from "react-bootstrap";
import iconeCompra from "assets/compra/IconeCompra.png";
import iconeCompraMercado from "assets/compra/iconeCompraMercado.png";
import iconeCompraLimitada from "assets/compra/iconeCompraLimitada.png";
import iconeCompraAgendada from "assets/compra/iconeCompraAgendada.png";
import iconeCompraStartStop from "assets/compra/iconeCompraStartStop.png";
import iconeCompraStartMovel from "assets/compra/iconeCompraStartMovel.png";
import iconeVenda from "assets/venda/iconeVenda.png";
import iconeVendaMercado from "assets/venda/iconeVendaMercado.png";
import iconeVendaLimitada from "assets/venda/iconeVendaLimitada.png";
import iconeVendaAgendada from "assets/venda/iconeVendaAgendada.png";
import iconeVendaStartStop from "assets/venda/iconeVendaStartStop.png";
import iconeVendaStopMovel from "assets/venda/iconeVendaStopMovel.png";
import { Animate } from "react-show";
import iconeMultileg from "assets/iconeMultileg.png";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import {
  criarMostrarAppAction,
  mostrarAppAction,
  atualizarShowAction,
  atualizarDivKeyAction,
  abrirFormAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import {
  mouseOverAction,
  mouseLeaveAction,
} from "redux/actions/system/SystemActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import { updateOneMultilegState } from "redux/actions/multileg/utils";

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

//Possui o menu de ordens e encapsula todos os sub-apps.
class MenuOrdens extends Component {
  componentDidUpdate() {
    if (
      this.props.divkey !== "" &&
      this.props.divkey === "divOrdens" &&
      this.props.isOpenOrdersHoverMenu === true
    ) {
      document.getElementById("divOrdens").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("divOrdens", this.props.zIndex, true);
    }
  }

  render() {
    const { props } = this;
    return (
      <Animate
        show={props.isOpenOrdersHoverMenu}
        duration={100}
        preMount
        transitionOnMount
        stayMounted={true}
        start={startStyle}
      >
        <div
          className="divOrdens"
          id="divOrdens"
          onMouseOver={() => props.mouseOverAction("isOpenOrdersHoverMenu")}
          onMouseLeave={() => props.mouseLeaveAction("isOpenOrdersHoverMenu")}
        >
          <Row className="rowOrdensTracejada">
            <img src={iconeCompra} alt="" />
            <div className="divBotaoFormulario">
              <img
                src={iconeCompraMercado}
                alt=""
                onClick={(event) => props.abrirFormAction(event, props)}
                data-name="compra_mercado"
                className="divClicavel"
              />
              <span>A mercado</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeCompraLimitada}
                alt=""
                onClick={(event) => props.abrirFormAction(event, props)}
                data-name="compra_limitada"
                className="divClicavel"
              />
              <span>Limitada</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeCompraAgendada}
                alt=""
                onClick={(event) => props.abrirFormAction(event, props)}
                data-name="compra_agendada"
                className="divClicavel"
              />
              <span>Agendada</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeCompraStartStop}
                alt=""
                onClick={(event) => props.abrirFormAction(event, props)}
                data-name="compra_startstop"
                className="divClicavel"
              />
              <span>Start/Stop</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeCompraStartMovel}
                alt=""
                onClick={(event) => props.abrirFormAction(event, props)}
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
                onClick={(event) => props.abrirFormAction(event, props)}
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
                onClick={(event) => props.abrirFormAction(event, props)}
                className="divClicavel"
              />
              <span>Limitada</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeVendaAgendada}
                alt=""
                data-name="venda_agendada"
                onClick={(event) => props.abrirFormAction(event, props)}
                className="divClicavel"
              />
              <span>Agendada</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeVendaStartStop}
                alt=""
                data-name="venda_startstop"
                onClick={(event) => props.abrirFormAction(event, props)}
                className="divClicavel"
              />
              <span>Start/Stop</span>
            </div>
            <div className="divBotaoFormulario">
              <img
                src={iconeVendaStopMovel}
                alt=""
                data-name="venda_stopmovel"
                onClick={(event) => props.abrirFormAction(event, props)}
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
                  props.abrirItemBarraLateralAction(props, "isOpenMultileg");
                  props.updateOneMultilegState({
                    attributeName: "multilegButtonsVisibility",
                    attributeValue: true,
                  });
                }}
                className="divClicavel"
              />
              <span>MULTILEG</span>
            </div>
          </Row>
        </div>
      </Animate>
    );
  }
}

/* {props.apps.map((appBoleta) => appBoleta)} */

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.GlobalReducer.apps,
    show: state.GlobalReducer.show,
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

const mapStateToPropsAppPrincipal = (state) => ({
  isOpenOrdersHoverMenu: state.systemReducer.isOpenOrdersHoverMenu,
  isOpenOrdersExec: state.systemReducer.isOpenOrdersExec,
  isOpenDetailedReport: state.systemReducer.isOpenDetailedReport,
  isOpenPosition: state.systemReducer.isOpenPosition,
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
  isOpenMultileg: state.systemReducer.isOpenMultileg,
  isOpenTHL: state.systemReducer.isOpenTHL,
  isLogged: state.systemReducer.isLogged,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      criarMostrarAppAction,
      mostrarAppAction,
      atualizarShowAction,
      atualizarDivKeyAction,
      abrirFormAction,
      aumentarZindexAction,
    },
    null,
    { context: GlobalContext },
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      mouseOverAction,
      mouseLeaveAction,
      abrirItemBarraLateralAction,
      updateOneMultilegState,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(MenuOrdens);
