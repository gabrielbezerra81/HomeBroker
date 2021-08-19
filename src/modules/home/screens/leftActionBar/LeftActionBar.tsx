/* eslint-disable no-restricted-globals */
import React, { useCallback } from "react";

import { AiFillForward } from "react-icons/ai";

import { ReactComponent as Icones } from "assets/IconesBarraLateral.svg";
import {
  mouseOverAction,
  mouseLeaveAction,
} from "redux/actions/system/SystemActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import {
  atualizarDivKeyAction,
  abrirFormAction,
} from "redux/actions/GlobalAppActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import { usePermissions } from "context/PermissionContext";

/*
<img src={iconeAbrirOrdens} alt="Ordens" />

Icone Ordens

*/
const margemParaMenuLateral = (isOpenLeftUserMenu: boolean) => {
  if (isOpenLeftUserMenu) return " leftBarWithMarginLeft";
  return "";
};

const LeftActionBar: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

  const dispatchGlobal = useDispatchGlobalStore();

  const {
    systemReducer: {
      isOpenLeftUserMenu,
      isOpenOrdersHoverMenu,
      connectedUser,
      isOpenProjectionsHoverMenu,
    },
  } = useStateStorePrincipal();

  const { permissions } = usePermissions();

  const globalProps = useStateGlobalStore();

  const handleOpenBook = useCallback(
    (event) => {
      dispatchGlobal(abrirFormAction(event, globalProps));
    },
    [dispatchGlobal, globalProps],
  );

  const handleOpenMenu = useCallback(
    (e) => {
      const divKey = e.currentTarget.getAttribute("data-name");
      const isOpen = e.currentTarget.getAttribute("data-isopen");

      if (
        divKey === "initialPlanner" &&
        connectedUser === "Gabriel" &&
        location.hostname === "localhost"
      ) {
        setTimeout(() => {
          dispatchGlobal(atualizarDivKeyAction("detailedPlanner"));
          dispatch(abrirItemBarraLateralAction("isOpenDetailedPlanner"));
        }, 250);
      }

      dispatchGlobal(atualizarDivKeyAction(divKey));
      dispatch(abrirItemBarraLateralAction(isOpen));
    },
    [connectedUser, dispatch, dispatchGlobal],
  );

  const onOrdersMouseOver = useCallback(() => {
    dispatchGlobal(atualizarDivKeyAction("divOrdens"));

    if (!isOpenOrdersHoverMenu)
      dispatch(mouseOverAction("isOpenOrdersHoverMenu"));
  }, [dispatch, dispatchGlobal, isOpenOrdersHoverMenu]);

  const onOrdersMouseLeave = useCallback(() => {
    if (isOpenOrdersHoverMenu)
      dispatch(mouseLeaveAction("isOpenOrdersHoverMenu"));
  }, [dispatch, isOpenOrdersHoverMenu]);

  const onProjectionsMouseOver = useCallback(() => {
    dispatchGlobal(atualizarDivKeyAction("projectionsHoverMenu"));

    if (!isOpenProjectionsHoverMenu) {
      dispatch(mouseOverAction("isOpenProjectionsHoverMenu"));
    }
  }, [dispatch, dispatchGlobal, isOpenProjectionsHoverMenu]);

  const onProjectionsMouseLeave = useCallback(() => {
    if (isOpenProjectionsHoverMenu) {
      dispatch(mouseLeaveAction("isOpenProjectionsHoverMenu"));
    }
  }, [dispatch, isOpenProjectionsHoverMenu]);

  return (
    <div
      className={`leftActionBar${margemParaMenuLateral(isOpenLeftUserMenu)}`}
      id="leftActionBar"
    >
      {permissions.book && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onClick={handleOpenBook}
          data-name="book"
        >
          <Icones viewBox="9 0 36 39"></Icones>
          <h6>BOOK</h6>
        </div>
      )}
      {permissions.thl.listing && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onClick={handleOpenMenu}
          data-name="thl"
          data-isopen="isOpenTHL"
        >
          <Icones viewBox="7 70 42 49"></Icones>
          <h6>ANÁLISE</h6>
        </div>
      )}

      {permissions.boletas && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onMouseOver={onOrdersMouseOver}
          onMouseLeave={onOrdersMouseLeave}
        >
          <Icones viewBox="11 145 41 45"></Icones>
          <h6>ORDENS</h6>
        </div>
      )}
      {permissions.ordersExecuting && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onClick={handleOpenMenu}
          data-name="ordens_execucao"
          data-isopen="isOpenOrdersExec"
        >
          <Icones viewBox="11 233 36 43"></Icones>
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
      )}

      {permissions.position && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onClick={handleOpenMenu}
          data-name="posicao_custodia"
          data-isopen="isOpenPosition"
        >
          <Icones viewBox="5 326 41 52"></Icones>
          <h6>POSIÇÃO</h6>
        </div>
      )}

      {permissions.history && (
        <div
          tabIndex={0}
          className="popupButton divClicavel"
          onClick={handleOpenMenu}
          data-name="relatorio_detalhado"
          data-isopen="isOpenDetailedReport"
        >
          <Icones viewBox="8 407 41 52"></Icones>
          <h6>HISTÓRICO</h6>
        </div>
      )}

      {permissions.planner && (
        <div
          className="popupButton divClicavel"
          onMouseOver={onProjectionsMouseOver}
          onMouseLeave={onProjectionsMouseLeave}
          id="projectionsHoverButton"
        >
          <AiFillForward color="#8ba5c2" size={40} />
          <h6>PROJEÇÕES</h6>
        </div>
      )}

      {permissions.optionsTable && (
        <div
          className="popupButton divClicavel"
          data-name="optionsTable"
          data-isopen="isOpenOptionsTable"
          onClick={handleOpenMenu}
        >
          <h6>TÁBUA DE OPÇÕES</h6>
        </div>
      )}
    </div>
  );
};

export default LeftActionBar;

/*

 <div
          tabIndex={0}
          className="popupButton divClicavel"
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
