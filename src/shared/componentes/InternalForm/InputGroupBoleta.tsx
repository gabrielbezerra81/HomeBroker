import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import CustomInput, { boxShadowInput } from "shared/componentes/CustomInput";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import { IconeConfigAbrirFormulario } from "shared/componentes/IconesConfigFormInterno";
import {
  BoletaNamespace,
  COMPRA_STARTSTOP_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
} from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";

interface Props {
  namespace: BoletaNamespace;
  cv: "compra" | "venda";
  popupToOpenGain: string;
  popupToOpenStop: string;
}

const InputGroupBoleta: React.FC<Props> = ({
  namespace,
  cv,
  popupToOpenGain,
  popupToOpenStop,
}) => {
  const dispatch = useDispatchBoletas();

  const boletasState = useStateBoletas();

  const currentBoleta = boletasState[namespace];

  const rowGain = (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">
          {namespace === COMPRA_STARTSTOP_NAMESPACE ||
          namespace === VENDA_STARTSTOP_NAMESPACE
            ? "Start"
            : "Gain"}
        </h6>
      </Col>
      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Disparo</Form.Label>
          <CustomInput
            type="preco"
            className={`gainDisparo_Agendada ${boxShadowInput(
              "gainDisparo_Agendada",
            )}`}
            step={0.01}
            value={currentBoleta.gainDisparo}
            onChange={(valor) =>
              dispatch(
                mudarAtributoBoletaAction(valor, namespace, "gainDisparo"),
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
            step={0.01}
            className={`gainExec_Agendada ${boxShadowInput(
              "gainExec_Agendada",
            )}`}
            value={currentBoleta.gainExec}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "gainExec"))
            }
          />
        </Form.Group>
      </Col>
      <Col md={1} className="colIconeConfig">
        <IconeConfigAbrirFormulario nomeFormulario={popupToOpenGain} />
      </Col>
    </Row>
  );

  const rowStop = (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">Stop</h6>
      </Col>
      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Disparo</Form.Label>
          <CustomInput
            type="preco"
            className={`stopDisparo_Agendada ${boxShadowInput(
              "stopDisparo_Agendada",
            )}`}
            step={0.01}
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
            className={`stopExec_Agendada ${boxShadowInput(
              "stopExec_Agendada",
            )}`}
            step={0.01}
            value={currentBoleta.stopExec}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "stopExec"))
            }
          />
        </Form.Group>
      </Col>
      <Col md={1} className="colIconeConfig">
        <IconeConfigAbrirFormulario nomeFormulario={popupToOpenStop} />
      </Col>
    </Row>
  );

  return (
    <Form>
      {cv === "compra" ? (
        <div>
          {rowGain}
          {rowStop}
        </div>
      ) : (
        <div>
          {rowStop}
          {rowGain}
        </div>
      )}
    </Form>
  );
};

export default InputGroupBoleta;
