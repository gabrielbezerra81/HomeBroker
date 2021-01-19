import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { AiFillForward } from "react-icons/ai";

import iconeListaCompleta from "assets/iconeListaCompleta.png";
import { ReactComponent as Icones } from "assets/IconesBarraLateral.svg";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  mouseOverAction,
  mouseLeaveAction,
} from "redux/actions/system/SystemActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import {
  atualizarDivKeyAction,
  abrirFormAction,
} from "redux/actions/GlobalAppActions";

/*
<img src={iconeAbrirOrdens} alt="Ordens" />

Icone Ordens

*/
const margemParaMenuLateral = (isOpenLeftUserMenu) => {
  if (isOpenLeftUserMenu) return " divBarraLateralAfastada";
  return "";
};

class BarraLateral extends React.Component {
  render() {
    const { props } = this;
    return (
      <div
        className={`divBarraLateral${margemParaMenuLateral(
          props.isOpenLeftUserMenu,
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
            props.abrirItemBarraLateralAction(props, "isOpenTHL");
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

            if (!props.isOpenOrdersHoverMenu)
              props.mouseOverAction("isOpenOrdersHoverMenu");
          }}
          onMouseLeave={() => {
            if (props.isOpenOrdersHoverMenu)
              props.mouseLeaveAction("isOpenOrdersHoverMenu");
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
            props.abrirItemBarraLateralAction(props, "isOpenOrdersExec");
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
            props.abrirItemBarraLateralAction(props, "isOpenPosition");
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
            props.abrirItemBarraLateralAction(props, "isOpenDetailedReport");
          }}
        >
          <Icones viewBox="8 407 41 52" className="iconesBarraLateral"></Icones>
          <h6>HISTÓRICO</h6>
        </div>

        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("initialPlanner");
            props.abrirItemBarraLateralAction(props, "isOpenInitialPlanner");
          }}
        >
          <AiFillForward color="#8ba5c2" size={40} />
          <h6>PROJEÇÕES</h6>
        </div>
      </div>
    );
  }
}

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
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    { atualizarDivKeyAction, abrirFormAction },
    null,
    {
      context: GlobalContext,
    },
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      abrirItemBarraLateralAction,
      mouseOverAction,
      mouseLeaveAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(BarraLateral);

/*

 <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            props.atualizarDivKeyAction("posicao_custodia");
            props.abrirItemBarraLateralAction(props, "isOpenPosition");
          }}
          style={{ display: "none" }}
        >
          <img src={iconeListaCompleta} alt="Lista completa" />
          <h6>LISTA COMPLETA</h6>
        </div>


*/
