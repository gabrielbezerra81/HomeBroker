import React, { useEffect } from "react";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateOneMultilegState } from "redux/actions/multileg/utils";
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
    multilegReducer: { multilegButtonsVisibility },
  } = useStateStorePrincipal();

  useEffect(() => {
    if (!multilegButtonsVisibility) {
      dispatchGlobal(atualizarDivKeyAction("multileg"));
      dispatch(
        abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multilegButtonsVisibility]);

  return (
    <div className="BoxMenuMainScreen">
      <div>
        <img src={boxMenuArrow} alt="" />
        <span>MENU</span>
      </div>
      <div>
        <img src={boxIcon} height={17} alt="" color="#b1b2b1" />
        <span>Box de Cotação</span>
        <IoMdAddCircle
          size={16}
          onClick={() => {
            dispatch(
              updateOneMultilegState({
                attributeName: "multilegButtonsVisibility",
                attributeValue: false,
              }),
            );
          }}
        />
      </div>
    </div>
  );
};

export default AddBoxMenu;
