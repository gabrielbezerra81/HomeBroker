import React from "react";
import { Row } from "react-bootstrap";

import { AiFillForward } from "react-icons/ai";

import { Animate } from "react-show";

import {
  mouseOverAction,
  mouseLeaveAction,
} from "redux/actions/system/SystemActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import { useCallback } from "react";
import { useEffect } from "react";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import { useState } from "react";
import { useMemo } from "react";

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const hoverButtonId = "projectionsHoverButton";

//Possui o menu de ordens e encapsula todos os sub-apps.
const ProjectionsHoverMenu = () => {
  const dispatchGlobal = useDispatchGlobalStore();

  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isOpenProjectionsHoverMenu },
  } = useStateStorePrincipal();

  const { divkey, zIndex } = useStateGlobalStore();

  const [offsetTop, setOffsetTop] = useState(0);

  const handleOpenMenu = useCallback(
    (e) => {
      const divKey = e.currentTarget.getAttribute("data-name");
      const isOpen = e.currentTarget.getAttribute("data-isopen");

      dispatchGlobal(atualizarDivKeyAction(divKey));
      dispatch(abrirItemBarraLateralAction(isOpen));
    },
    [dispatch, dispatchGlobal],
  );

  // open on mouse over
  const onMouseOver = useCallback(() => {
    if (isOpenProjectionsHoverMenu === false) {
      dispatch(mouseOverAction("isOpenProjectionsHoverMenu"));
    }
  }, [dispatch, isOpenProjectionsHoverMenu]);

  // close on mouse leave
  const onMouseLeave = useCallback(() => {
    if (isOpenProjectionsHoverMenu) {
      dispatch(mouseLeaveAction("isOpenProjectionsHoverMenu"));
    }
  }, [dispatch, isOpenProjectionsHoverMenu]);

  // increase zIndex on mount
  useEffect(() => {
    if (
      divkey !== "" &&
      divkey === "projectionsHoverMenu" &&
      isOpenProjectionsHoverMenu === true
    ) {
      const element = document.getElementById("projectionsHoverMenu");

      if (element) {
        element.style.zIndex = zIndex + 1;
      }

      dispatchGlobal(
        aumentarZindexAction("projectionsHoverMenu", zIndex, true),
      );
    }
  }, [dispatchGlobal, divkey, isOpenProjectionsHoverMenu, zIndex]);

  // get distance to top of hover button that opens this menu
  useEffect(() => {
    const hoverButton = document.getElementById(hoverButtonId);

    if (hoverButton) {
      setOffsetTop(hoverButton.offsetTop);
    }
  }, []);

  const style = useMemo(
    () => ({
      marginTop: offsetTop,
    }),
    [offsetTop],
  );

  return (
    <Animate
      show={isOpenProjectionsHoverMenu}
      duration={100}
      preMount
      transitionOnMount
      stayMounted={true}
      start={startStyle}
    >
      <div
        className="projectionsHoverMenu"
        id="projectionsHoverMenu"
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        <Row>
          <div
            className="divClicavel divBotaoFormulario"
            data-name="initialPlanner"
            data-isopen="isOpenInitialPlanner"
            onClick={handleOpenMenu}
          >
            <AiFillForward color="#8ba5c2" size={40} />
            <span>Simulador</span>
          </div>
          <div
            className="divClicavel divBotaoFormulario"
            data-name="detailedPlanner"
            data-isopen="isOpenDetailedPlanner"
            onClick={handleOpenMenu}
          >
            <AiFillForward color="#8ba5c2" size={40} />
            <span>Carteira de Investimentos</span>
          </div>
        </Row>
      </div>
    </Animate>
  );
};

export default ProjectionsHoverMenu;
