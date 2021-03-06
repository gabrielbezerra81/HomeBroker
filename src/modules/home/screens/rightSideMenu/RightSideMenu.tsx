import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { MDBIcon } from "mdbreact";
import React, { useCallback, useMemo } from "react";
import { updateOneSystemStateAction } from "redux/actions/system/SystemActions";

// import { ReactComponent as FavoritesIcon } from "assets/menuLateralDireito/favoritos.svg";
// import { ReactComponent as AlertIcon } from "assets/menuLateralDireito/alerta.svg";
// import { ReactComponent as OrdersIcon } from "assets/menuLateralDireito/ordens.svg";
// import { ReactComponent as PositionIcon } from "assets/menuLateralDireito/posicao.svg";

import alertIcon from "assets/menuLateralDireito/alerta.png";
import ordersIcon from "assets/menuLateralDireito/ordensExecucao.png";
import positionIcon from "assets/menuLateralDireito/carteira.png";

import Alert from "./Alert/Alert";
import ResumedPosition from "./ResumedPosition/ResumedPosition";
import ResumedOrder from "./ResumedOrder/ResumedOrder";
import { usePermissions } from "context/PermissionContext";

const RightSideMenu: React.FC = () => {
  const {
    systemReducer: { isOpenRightSideMenu, activeItemRightSideMenu: activeItem },
  } = useStateStorePrincipal();

  const { permissions } = usePermissions();

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

  const hiddenSideBarClass = useMemo(() => {
    return isOpenRightSideMenu ? "" : "hiddenSideBar";
  }, [isOpenRightSideMenu]);

  const menuCollapsedClass = useMemo(() => {
    return isOpenRightSideMenu ? "" : " collapsed";
  }, [isOpenRightSideMenu]);

  const activeItemTitleStyle = useMemo(() => {
    const style: React.CSSProperties = {
      backgroundColor: "transparent",
    };

    switch (activeItem) {
      case "POSIÇÃO RESUMIDA":
        style.backgroundColor = "#207FA5";
        break;
      case "ORDENS EM EXECUÇÃO":
        style.backgroundColor = "#0F8E46";
        break;
      default:
        break;
    }

    return style;
  }, [activeItem]);

  return (
    <div className={`rightSideMenu${menuCollapsedClass}`}>
      <div>
        <div
          className="barVisibilityButton"
          tabIndex={0}
          onClick={handleChangeMenuVisibility}
        >
          <MDBIcon className={arrowRotationClass} icon="angle-left" size="lg" />
        </div>
        <div className={`rightSideBar ${hiddenSideBarClass}`}>
          {permissions.rightSideMenu.alerts && (
            <div
              className={`${menuItemOpacity} ${isItemActive("ALERTAS")}`}
              tabIndex={0}
              data-name="ALERTAS"
              onClick={handleMenuItemSelect}
            >
              <img src={alertIcon} alt="" />
              ALERTAS
            </div>
          )}
          {permissions.rightSideMenu.ordersExecuting && (
            <div
              className={`${menuItemOpacity} ${isItemActive(
                "ORDENS EM EXECUÇÃO",
              )}`}
              tabIndex={0}
              data-name="ORDENS EM EXECUÇÃO"
              onClick={handleMenuItemSelect}
            >
              {/* <OrdersIcon /> */}
              <img src={ordersIcon} alt="" />
              ORDENS
            </div>
          )}

          {permissions.rightSideMenu.position && (
            <div
              className={`${menuItemOpacity} ${isItemActive(
                "POSIÇÃO RESUMIDA",
              )}`}
              tabIndex={0}
              data-name="POSIÇÃO RESUMIDA"
              onClick={handleMenuItemSelect}
            >
              {/* <PositionIcon /> */}
              <img src={positionIcon} alt="" />
              CARTEIRA
            </div>
          )}
        </div>
      </div>
      <div className={`menuContent ${closedMenuContentClass}`}>
        {activeItem === "ORDENS EM EXECUÇÃO" &&
          permissions.rightSideMenu.ordersExecuting && (
            <>
              <span style={activeItemTitleStyle}>{activeItem}</span>
              <ResumedOrder />
            </>
          )}

        {activeItem === "POSIÇÃO RESUMIDA" &&
          permissions.rightSideMenu.position && (
            <>
              <span style={activeItemTitleStyle}>{activeItem}</span>
              <ResumedPosition />
            </>
          )}

        {activeItem === "ALERTAS" && permissions.rightSideMenu.alerts && (
          <Alert />
        )}
      </div>
    </div>
  );
};

export default RightSideMenu;
