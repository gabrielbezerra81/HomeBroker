import React, { useCallback } from "react";

import { Button } from "react-bootstrap";

import CustomButton from "shared/components/CustomButton";

import { updateMultilegTabAction } from "../../duck/actions/MultilegActions";
import {
  addQuoteBoxFromMultilegAction,
  createMultilegPositionAction,
  sendMultilegOrderAction,
} from "../../duck/actions/MultilegAPIAction";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import MultilegAlertButtons from "./MultilegAlertButtons";
import { usePermissions } from "context/PermissionContext";

interface Props {
  tabIndex: number;
}

const OperationButtons: React.FC<Props> = ({ tabIndex }) => {
  const {
    systemReducer: { createAlertButtonVisibility, multilegButtonsVisibility },
  } = useStateStorePrincipal();

  const { permissions } = usePermissions();

  const dispatch = useDispatchStorePrincipal();

  const handleClean = useCallback(() => {
    dispatch(
      updateMultilegTabAction({
        tabIndex,
        attributeName: "limpar",
        attributeValue: "",
      }),
    );
  }, [dispatch, tabIndex]);

  const handleExecute = useCallback(() => {
    dispatch(sendMultilegOrderAction(tabIndex));
  }, [dispatch, tabIndex]);

  const handleCreatePosition = useCallback(() => {
    dispatch(createMultilegPositionAction(tabIndex));
  }, [dispatch, tabIndex]);

  const handleAddBox = useCallback(() => {
    dispatch(addQuoteBoxFromMultilegAction(tabIndex));
  }, [dispatch, tabIndex]);

  // botões padrões com envio de ordem
  if (
    multilegButtonsVisibility &&
    !createAlertButtonVisibility &&
    permissions.boletas
  ) {
    return (
      <>
        <div className="operationButtonRow">
          <Button variant="secondary" size="sm" onClick={handleClean}>
            LIMPAR
          </Button>
          <CustomButton
            onClick={handleExecute}
            defaultClassName={false}
            className="btn btn-primary btn-block btn-sm"
          >
            EXECUTAR
          </CustomButton>
        </div>
        <div className="operationButtonRow">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreatePosition}
            block
          >
            CRIAR POSIÇÃO
          </Button>
        </div>
        <MultilegAlertButtons tabIndex={tabIndex} />
      </>
    );
  }

  if (
    (!multilegButtonsVisibility && !createAlertButtonVisibility) ||
    !permissions.boletas
  ) {
    return null;
    // return (
    //   <div className="operationButtonRow">
    //     <Button
    //       variant="primary"
    //       size="sm"
    //       block
    //       className={`toggleAlertButton`}
    //       onClick={handleAddBox}
    //     >
    //       ADICIONAR BOX
    //     </Button>
    //   </div>
    // );
  }

  if (!multilegButtonsVisibility && createAlertButtonVisibility) {
    return <MultilegAlertButtons tabIndex={tabIndex} />;
  }

  return null;
};

export default OperationButtons;
