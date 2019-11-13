import React from "react";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export const iconeConfigAbrirFormulario = (handleShow, nomeFormulario) => (
  <Button
    variant="link"
    className="operation-icons"
    onClick={event => {
      event.stopPropagation();
      handleShow(event);
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
