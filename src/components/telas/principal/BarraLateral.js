import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import { ReactComponent as Icones } from "img/IconesBarraLateral.svg";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  mouseOverAction,
  mouseLeaveAction,
} from "redux/actions/TelaPrincipalActions";
import { abrirItemBarraLateralAction } from "redux/actions/TelaPrincipalActions";
import {
  atualizarDivKeyAction,
  abrirFormAction,
} from "redux/actions/GlobalAppActions";

/*
<img src={iconeAbrirOrdens} alt="Ordens" />

Icone Ordens

*/
const margemParaMenuLateral = (menuLateralAberto) => {
  if (menuLateralAberto) return " divBarraLateralAfastada";
  return "";
};

class BarraLateral extends React.Component {
  render() {
    const { props } = this;
    return (
      <div
        className={`divBarraLateral${margemParaMenuLateral(
          props.menuLateralAberto
        )}`}
        id="divBarraLateral"
      >
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={(event) => {
            props.abrirFormAction(event, props);
          }}
          data-name="book"
        >
          <Icones viewBox="9 0 36 39" className="iconesBarraLateral"></Icones>
          <h6>BOOK</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("thl");
            props.abrirItemBarraLateralAction(props, "thlAberta");
          }}
        >
          <Icones viewBox="7 70 42 49" className="iconesBarraLateral"></Icones>
          <h6>ANÁLISE</h6>
        </div>

        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onMouseOver={() => {
            props.atualizarDivKeyAction("divOrdens");

            if (!props.ordensAberto) props.mouseOverAction("ordensAberto");
          }}
          onMouseLeave={() => {
            if (props.ordensAberto) props.mouseLeaveAction("ordensAberto");
          }}
        >
          <Icones
            viewBox="11 145 41 45"
            className="iconesBarraLateral"
          ></Icones>
          <h6>ORDENS</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("ordens_execucao");
            props.abrirItemBarraLateralAction(props, "ordensExecucaoAberto");
          }}
        >
          <Icones
            viewBox="11 233 36 43"
            className="iconesBarraLateral"
          ></Icones>
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("posicao_custodia");
            props.abrirItemBarraLateralAction(props, "listaCompletaAberta");
          }}
        >
          <Icones viewBox="5 326 41 52" className="iconesBarraLateral"></Icones>
          <h6>POSIÇÃO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("relatorio_detalhado");
            props.abrirItemBarraLateralAction(
              props,
              "relatorioDetalhadoAberto"
            );
          }}
        >
          <Icones viewBox="8 407 41 52" className="iconesBarraLateral"></Icones>
          <h6>HISTÓRICO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("posicao_custodia");
            props.abrirItemBarraLateralAction(props, "listaCompletaAberta");
          }}
          style={{ display: "none" }}
        >
          <img src={iconeListaCompleta} alt="Lista completa" />
          <h6>LISTA COMPLETA</h6>
        </div>
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
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    { atualizarDivKeyAction, abrirFormAction },
    null,
    {
      context: GlobalContext,
    }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      abrirItemBarraLateralAction,
      mouseOverAction,
      mouseLeaveAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(BarraLateral);
