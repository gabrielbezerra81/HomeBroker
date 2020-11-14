import React from "react";

import { Button } from "react-bootstrap";

import CustomButton from "shared/componentes/Button";

import { updateMultilegTabAction } from "redux/actions/multileg/MultilegActions";
import {
  addQuoteBoxFromMultilegAction,
  createMultilegPositionAction,
  sendMultilegOrderAction,
} from "redux/actions/multileg/MultilegAPIAction";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import MultilegAlertButtons from "./MultilegAlertButtons";

interface Props {
  tabIndex: number;
}

const OperationButtons: React.FC<Props> = ({ tabIndex }) => {
  const {
    systemReducer: { createAlertButtonVisibility, multilegButtonsVisibility },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  // botões padrões com envio de ordem
  if (multilegButtonsVisibility && !createAlertButtonVisibility) {
    return (
      <>
        <div className="operationButtonRow">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              dispatch(
                updateMultilegTabAction({
                  tabIndex,
                  attributeName: "limpar",
                  attributeValue: "",
                }),
              )
            }
          >
            LIMPAR
          </Button>
          <CustomButton
            onClick={() => dispatch(sendMultilegOrderAction(tabIndex))}
          >
            EXECUTAR
          </CustomButton>
        </div>
        <div className="operationButtonRow">
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(createMultilegPositionAction(tabIndex))}
            block
          >
            CRIAR POSIÇÃO
          </Button>
        </div>
        <MultilegAlertButtons tabIndex={tabIndex} />
      </>
    );
  }

  if (!multilegButtonsVisibility && !createAlertButtonVisibility) {
    return (
      <div className="operationButtonRow">
        <Button
          variant="primary"
          size="sm"
          block
          className={`toggleAlertButton`}
          onClick={() => {
            dispatch(addQuoteBoxFromMultilegAction(tabIndex));
          }}
        >
          ADICIONAR BOX
        </Button>
      </div>
    );
  }

  if (!multilegButtonsVisibility && createAlertButtonVisibility) {
    return <MultilegAlertButtons tabIndex={tabIndex} />;
  }

  return null;
};

export default OperationButtons;
