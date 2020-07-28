import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Row } from "react-bootstrap";
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
import iconeMultileg from "img/iconeMultileg.png";
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
} from "redux/actions/telaPrincipal/TelaPrincipalActions";
import { abrirItemBarraLateralAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";

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
            onMouseOver={() => props.mouseOverAction("ordensAberto")}
            onMouseLeave={() => props.mouseLeaveAction("ordensAberto")}
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
                    props.abrirItemBarraLateralAction(props, "multilegAberto");
                  }}
                  className="divClicavel"
                />
                <span>MULTILEG</span>
              </div>
            </Row>
          </div>
        </Animate>
        {props.apps.map((appBoleta) => appBoleta)}
      </div>
    );
  }
}

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

const mapStateToPropsAppPrincipal = (state) => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto,
  multilegAberto: state.telaPrincipalReducer.multilegAberto,
  thlAberta: state.telaPrincipalReducer.thlAberta,
  logado: state.telaPrincipalReducer.logado,
  eventSourceCotacao_Multileg: state.multilegReducer.eventSourceCotacao,
  eventSourcePosicao_Posicao: state.posicaoReducer.eventSourcePosicao,
  eventSourceEmblema_Posicao: state.posicaoReducer.eventSourceEmblema,
  eventSourceCotacoes_Posicao: state.posicaoReducer.eventSourceCotacoes,
  eventSourceOrdensExec_OrdensExec:
    state.ordensExecReducer.eventSourceOrdensExec,
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
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      mouseOverAction,
      mouseLeaveAction,
      abrirItemBarraLateralAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(MenuOrdens);
