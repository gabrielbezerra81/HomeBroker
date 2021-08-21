import React, { useCallback } from "react";

import { Button } from "react-bootstrap";

import CustomButton from "shared/components/CustomButton";

import { updateMultilegTabAction } from "../../duck/actions/MultilegActions";
import {
  createMultilegPositionAction,
  sendMultilegOrderAction,
} from "../../duck/actions/MultilegAPIAction";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import MultilegAlertButtons from "./MultilegAlertButtons";
import { usePermissions } from "context/PermissionContext";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";

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

  const handleExecute = useCallback(async () => {
    await dispatch(sendMultilegOrderAction(tabIndex));
  }, [dispatch, tabIndex]);

  const handleCreatePosition = useCallback(async () => {
    await dispatch(createMultilegPositionAction(tabIndex));
  }, [dispatch, tabIndex]);

  // const handleAddBox = useCallback(() => {
  //   dispatch(addQuoteBoxFromMultilegAction(tabIndex));
  // }, [dispatch, tabIndex]);

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

          <PopConfirm
            onConfirm={handleExecute}
            title="Confirmar conta"
            message="Você possui mais de uma conta ativa. Tem certeza que a ordem é para
          esta conta?"
            cancelButtonStyle={{
              variant: "secondary",
            }}
          >
            <CustomButton
              defaultClassName={false}
              className="btn btn-primary btn-block btn-sm"
            >
              EXECUTAR
            </CustomButton>
          </PopConfirm>
        </div>
        <div className="operationButtonRow">
          <PopConfirm
            onConfirm={handleCreatePosition}
            title="Confirmar conta"
            message="Você possui mais de uma conta ativa. Tem certeza que a posição é para
          esta conta?"
            cancelButtonStyle={{
              variant: "secondary",
            }}
          >
            <Button variant="primary" size="sm" block>
              CRIAR POSIÇÃO
            </Button>
          </PopConfirm>
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

// const ConfirmAlert: React.FC<any> = ({ children, onConfirm }: any) => {
//   return (
//     <Popconfirm
//       okText="Sim"
//       cancelText="Não"
//       onConfirm={onConfirm}
//       title={
//         <div style={{ width: "260px" }}>
//           Você possui mais de uma conta ativa. Tem certeza que a ordem é para
//           esta conta?
//         </div>
//       }
//     >
//       {children}
//     </Popconfirm>
//   );
// };
