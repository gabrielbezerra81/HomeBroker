import React, { useCallback, useMemo, useState } from "react";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

import boxIcon from "assets/boxIcon.png";
import boxMenuArrow from "assets/boxMenuArrow.png";

import { IoMdAddCircle } from "react-icons/io";
import { addMultiBoxAction } from "redux/actions/multiBox/multiBoxActions";
import { usePermissions } from "context/PermissionContext";

const AddBoxMenu: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

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
    return menuVisibility ? "showBoxMenu" : "";
  }, [menuVisibility]);

  if (!permissions.box) {
    return <div className="hiddenAddBoxMenu"></div>;
  }

  return (
    <div className="BoxMenuMainScreen">
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
    </div>
  );
};

export default AddBoxMenu;
