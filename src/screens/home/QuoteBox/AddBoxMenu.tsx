import React, { useCallback, useMemo, useState } from "react";
import {
  abrirItemBarraLateralAction,
  updateOneSystemStateAction,
} from "redux/actions/system/SystemActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

import boxIcon from "assets/boxIcon.png";
import boxMenuArrow from "assets/boxMenuArrow.png";

import { IoMdAddCircle } from "react-icons/io";

const AddBoxMenu: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();
  const dispatchGlobal = useDispatchGlobalStore();

  const {
    systemReducer: { isOpenMultileg },
  } = useStateStorePrincipal();

  const [menuVisibility, setMenuVisibility] = useState(false);

  const handleOpenMultileg = useCallback(() => {
    dispatch(updateOneSystemStateAction("multilegButtonsVisibility", false));

    dispatchGlobal(atualizarDivKeyAction("multileg"));
    dispatch(abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"));
  }, [dispatch, dispatchGlobal, isOpenMultileg]);

  // useEffect(() => {
  //   if (!multilegButtonsVisibility) {
  //     dispatchGlobal(atualizarDivKeyAction("multileg"));
  //     dispatch(
  //       abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"),
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [multilegButtonsVisibility]);

  const handleShowOnHover = useCallback(() => setMenuVisibility(true), []);

  const handleHideOnLeave = useCallback(() => setMenuVisibility(false), []);

  const visibilityClass = useMemo(() => {
    return menuVisibility ? "showBoxMenu" : "";
  }, [menuVisibility]);

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
