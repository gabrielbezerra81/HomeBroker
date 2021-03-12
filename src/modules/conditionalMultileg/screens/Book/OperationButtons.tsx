import React, { useCallback } from "react";

import { Button } from "react-bootstrap";

import CustomButton from "shared/components/CustomButton";

import { cond_updateMultilegTabAction } from "../../duck/actions/ConditionalMultilegActions";
import { cond_sendMultilegOrderAction } from "../../duck/actions/ConditionalMultilegAPIAction";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

interface Props {
  tabIndex: number;
}

const OperationButtons: React.FC<Props> = ({ tabIndex }) => {
  const dispatch = useDispatchStorePrincipal();

  const handleClean = useCallback(() => {
    dispatch(
      cond_updateMultilegTabAction({
        tabIndex,
        attributeName: "limpar",
        attributeValue: "",
      }),
    );
  }, [dispatch, tabIndex]);

  const handleExecute = useCallback(() => {
    dispatch(cond_sendMultilegOrderAction(tabIndex));
  }, [dispatch, tabIndex]);

  const handleCreateOrder = useCallback(() => {}, []);

  return (
    <>
      <div className="operationButtonRow firstRow">
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
        <Button variant="primary" size="sm" onClick={handleCreateOrder} block>
          CRIAR ORDEM
        </Button>
      </div>
    </>
  );
};

export default OperationButtons;
