import React from "react";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { useDispatchGlobalStore } from "redux/StoreCreation";
import { abrirFormAction } from "redux/actions/GlobalAppActions";
import useStateGlobalStore from "hooks/useStateGlobalStore";

export const IconeConfigAbrirFormulario = ({ nomeFormulario }) => {
  const stateGlobalStore = useStateGlobalStore();
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
