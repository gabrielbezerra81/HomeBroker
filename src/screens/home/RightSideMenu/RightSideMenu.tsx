import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { MDBIcon } from "mdbreact";
import React, { useCallback, useMemo, useState } from "react";
import { updateOneSystemStateAction } from "redux/actions/system/SystemActions";

// import { ReactComponent as FavoritesIcon } from "assets/menuLateralDireito/favoritos.svg";
// import { ReactComponent as AlertIcon } from "assets/menuLateralDireito/alerta.svg";
// import { ReactComponent as OrdersIcon } from "assets/menuLateralDireito/ordens.svg";
// import { ReactComponent as PositionIcon } from "assets/menuLateralDireito/posicao.svg";

import favoritesIcon from "assets/menuLateralDireito/favoritos.png";
import alertIcon from "assets/menuLateralDireito/alerta.png";
import ordersIcon from "assets/menuLateralDireito/ordensExecucao.png";
import positionIcon from "assets/menuLateralDireito/posicaoResumida.png";
import Alert from "./Alert";

const RightSideMenu: React.FC = () => {
  const {
    systemReducer: { isOpenRightSideMenu, activeItemRightSideMenu: activeItem },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

  const handleChangeMenuVisibility = useCallback(() => {
    dispatch(
      updateOneSystemStateAction("isOpenRightSideMenu", !isOpenRightSideMenu),
    );
  }, [dispatch, isOpenRightSideMenu]);

  const handleMenuItemSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const itemKey = event.currentTarget.getAttribute("data-name");
      if (itemKey) {
        dispatch(
          updateOneSystemStateAction("activeItemRightSideMenu", itemKey),
        );
      }
    },
    [dispatch],
  );

  const isItemActive = useCallback(
    (itemKey: string) => {
      return itemKey === activeItem ? "activeItem" : "";
    },
    [activeItem],
  );

  const arrowRotationClass = useMemo(() => {
    return isOpenRightSideMenu ? "arrowRotateToRight" : "";
  }, [isOpenRightSideMenu]);

  const closedMenuContentClass = useMemo(() => {
    return isOpenRightSideMenu ? "" : "closedRightMenu";
  }, [isOpenRightSideMenu]);

  const menuItemOpacity = useMemo(() => {
    return isOpenRightSideMenu ? "" : "menuItemHidden";
  }, [isOpenRightSideMenu]);

  return (
    <div className="rightSideMenu">
      <div className="rightSideBar">
        <div tabIndex={0} onClick={handleChangeMenuVisibility}>
          <MDBIcon className={arrowRotationClass} icon="angle-left" size="lg" />
        </div>

        <div
          className={`${menuItemOpacity} ${isItemActive("FAVORITOS")}`}
          tabIndex={0}
          data-name="FAVORITOS"
          onClick={handleMenuItemSelect}
        >
          {/* <FavoritesIcon /> */}
          <img src={favoritesIcon} alt="" />
        </div>
        <div
          className={`${menuItemOpacity} ${isItemActive("ALERTAS")}`}
          tabIndex={0}
          data-name="ALERTAS"
          onClick={handleMenuItemSelect}
        >
          {/* <AlertIcon /> */}
          <img src={alertIcon} alt="" />
        </div>
        <div
          className={`${menuItemOpacity} ${isItemActive("ORDENS EM EXECUÇÃO")}`}
          tabIndex={0}
          data-name="ORDENS EM EXECUÇÃO"
          onClick={handleMenuItemSelect}
        >
          {/* <OrdersIcon /> */}
          <img src={ordersIcon} alt="" />
        </div>
        <div
          className={`${menuItemOpacity} ${isItemActive("POSIÇÃO RESUMIDA")}`}
          tabIndex={0}
          data-name="POSIÇÃO RESUMIDA"
          onClick={handleMenuItemSelect}
        >
          {/* <PositionIcon /> */}
          <img src={positionIcon} alt="" />
        </div>
      </div>
      <div className={`menuContent ${closedMenuContentClass}`}>
        <span>{activeItem}</span>

        {activeItem === "ALERTAS" && <Alert />}
      </div>
    </div>
  );
};

export default RightSideMenu;
