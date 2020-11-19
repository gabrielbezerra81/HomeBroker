import React from "react";

import { BoletaNamespace } from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";
import { Row, Col, Form } from "react-bootstrap";
import CustomInput, { boxShadowInput } from "../CustomInput";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";

interface Props {
  namespace: BoletaNamespace;
}

const InputGroupStopMovel: React.FC<Props> = ({ namespace }) => {
  const dispatch = useDispatchBoletas();

  const boletasState = useStateBoletas();

  const currentBoleta = boletasState[namespace];

  return (
    <div>
      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">Início</h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <CustomInput
              type="preco"
              step={0.01}
              className={`inicioDisparo_Movel ${boxShadowInput(
                "inicioDisparo_Movel",
              )}`}
              value={currentBoleta.inicioDisparo}
              onChange={(valor) =>
                dispatch(
                  mudarAtributoBoletaAction(valor, namespace, "inicioDisparo"),
                )
              }
            />
          </Form.Group>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Ajuste padrão</Form.Label>
            <CustomInput
              type="preco"
              step={0.01}
              value={currentBoleta.ajustePadrao}
              onChange={(valor) =>
                dispatch(
                  mudarAtributoBoletaAction(valor, namespace, "ajustePadrao"),
                )
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">Stop</h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <CustomInput
              type="preco"
              step={0.01}
              className={`stopDisparo_Movel ${boxShadowInput(
                "stopDisparo_Movel",
              )}`}
              value={currentBoleta.stopDisparo}
              onChange={(valor) =>
                dispatch(
                  mudarAtributoBoletaAction(valor, namespace, "stopDisparo"),
                )
              }
            />
          </Form.Group>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Execução</Form.Label>
            <CustomInput
              type="preco"
              className={`stopExec_Movel ${boxShadowInput("stopExec_Movel")}`}
              step={0.01}
              value={currentBoleta.stopExec}
              onChange={(valor) =>
                dispatch(
                  mudarAtributoBoletaAction(valor, namespace, "stopExec"),
                )
              }
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default InputGroupStopMovel;
