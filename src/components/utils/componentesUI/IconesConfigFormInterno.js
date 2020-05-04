import React from "react";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import {
  useSelectorGlobalStore,
  useDispatchGlobalStore,
} from "components/redux/StoreCreation";
import { abrirFormAction } from "components/redux/actions/MainAppActions";

export const IconeConfigAbrirFormulario = ({ nomeFormulario }) => {
  const stateGlobalStore = useSelectorGlobalStore(
    (state) => state.MainAppReducer
  );
  const dispatchGlobal = useDispatchGlobalStore();

  return (
    <Button
      variant="link"
      className="operation-icons"
      onClick={(event) => {
        event.stopPropagation();
        if (nomeFormulario)
          dispatchGlobal(abrirFormAction(event, { ...stateGlobalStore }, ""));
      }}
      data-name={nomeFormulario}
    >
      <MDBIcon
        icon="cog"
        size="2x"
        className="labelInput-verticalAlign"
        data-name={nomeFormulario}
      />
    </Button>
  );
};
