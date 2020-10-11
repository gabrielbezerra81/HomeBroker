import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import { updateManyMultilegState } from "redux/actions/multileg/utils";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

const Alert: React.FC = () => {
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();
  const {
    systemReducer: { isOpenMultileg },
  } = useStateStorePrincipal();

  const handleOpenMultileg = useCallback(() => {
    dispatch(
      updateManyMultilegState({
        multilegButtonsVisibility: false,
        createAlertButtonVisibility: true,
      }),
    );

    dispatchGlobal(atualizarDivKeyAction("multileg"));
    dispatch(abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"));
  }, [dispatch, dispatchGlobal, isOpenMultileg]);

  return <Button onClick={handleOpenMultileg}>Novo +</Button>;
};

export default Alert;
