import React, { useCallback, useMemo, useState } from "react";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

import boxIcon from "assets/boxIcon.png";
import boxMenuArrow from "assets/boxMenuArrow.png";

import { IoMdAddCircle } from "react-icons/io";
import { addMultiBoxAction } from "modules/multiBox/duck/actions/multiBoxActions";
import { usePermissions } from "context/PermissionContext";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";

const TabBarHoverMenu: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();
  const dispatchGlobal = useDispatchGlobalStore();

  const { permissions } = usePermissions();

  const [menuVisibility, setMenuVisibility] = useState(false);

  const handleOpenMultileg = useCallback(() => {
    dispatch(addMultiBoxAction());
    // dispatch(
    //   updateManySystemState({
    //     multilegButtonsVisibility: false,
    //     createAlertButtonVisibility: false,
    //   }),
    // );

    // dispatchGlobal(atualizarDivKeyAction("multileg"));
    // dispatch(
    //   abrirItemBarraLateralAction("isOpenMultileg", true),
    // );
  }, [dispatch]);

  const handleOpenCategoryList = useCallback(() => {
    dispatchGlobal(atualizarDivKeyAction("categoryList"));
    dispatch(updateManySystemState({ isOpenCategoryList: true }));
  }, [dispatch, dispatchGlobal]);

  const handleOpenOptionsMatrix = useCallback(() => {
    dispatchGlobal(atualizarDivKeyAction("optionsMatrix"));
    dispatch(updateManySystemState({ isOpenOptionsMatrix: true }));
  }, [dispatch, dispatchGlobal]);

  // useEffect(() => {
  //   if (!multilegButtonsVisibility) {
  //     dispatchGlobal(atualizarDivKeyAction("multileg"));
  //     dispatch(
  //       abrirItemBarraLateralAction("isOpenMultileg"),
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [multilegButtonsVisibility]);

  const handleShowOnHover = useCallback(() => setMenuVisibility(true), []);

  const handleHideOnLeave = useCallback(() => setMenuVisibility(false), []);

  const visibilityClass = useMemo(() => {
    return menuVisibility ? "showTabBarHoverMenu" : "";
  }, [menuVisibility]);

  if (!permissions.box) {
    return <div className="hiddenTabBarHoverMenu"></div>;
  }

  return (
    <div className="tabBarHoverMenu">
      <div onMouseOver={handleShowOnHover} onMouseLeave={handleHideOnLeave}>
        <img src={boxMenuArrow} alt="" />
        <span>MENU</span>
      </div>
      <div
        className={visibilityClass}
        onMouseOver={handleShowOnHover}
        onMouseLeave={handleHideOnLeave}
        onClick={handleOpenMultileg}
      >
        <img src={boxIcon} height={17} alt="" color="#b1b2b1" />
        <span>Box de Cotação</span>
        <IoMdAddCircle size={16} />
      </div>

      <div
        className={visibilityClass}
        onMouseOver={handleShowOnHover}
        onMouseLeave={handleHideOnLeave}
        onClick={handleOpenCategoryList}
      >
        <span>Mapa de Ativos</span>
        <IoMdAddCircle size={16} />
      </div>

      <div
        className={visibilityClass}
        onMouseOver={handleShowOnHover}
        onMouseLeave={handleHideOnLeave}
        onClick={handleOpenOptionsMatrix}
      >
        <span>Matriz de Opções</span>
        <IoMdAddCircle size={16} />
      </div>
    </div>
  );
};

export default TabBarHoverMenu;
