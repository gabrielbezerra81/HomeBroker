import { BoletaNamespace } from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";
import React, { useCallback } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { mudarAssinaturaAction, mudarCheckSalvarAssinaturaAction } from "../duck/actions/boletaActions";

interface Props {
  namespace: BoletaNamespace;
}

const BoletaSignature: React.FC<Props> = ({ namespace }) => {
  const boletaState = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  const { assinatura, checkSalvarAssinatura } = boletaState;

  const handleSignatureChange = useCallback(
    (event) => {
      dispatch(mudarAssinaturaAction(event, namespace));
    },
    [dispatch, namespace],
  );

  const handleCheckboxChange = useCallback(() => {
    dispatch(
      mudarCheckSalvarAssinaturaAction(checkSalvarAssinatura, namespace),
    );
  }, [checkSalvarAssinatura, dispatch, namespace]);

  return (
    <Row className="rowAssinaturaEletronica">
      <Col md={8}>
        <Form>
          <Form.Group>
            <Form.Label>Assinatura eletrônica</Form.Label>
            <Form.Control
              className="textInput"
              type="password"
              value={assinatura}
              onChange={handleSignatureChange}
              autoComplete="current-password"
            />
          </Form.Group>
        </Form>
      </Col>
      <Col>
        <Form>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Salvar assinatura"
              checked={checkSalvarAssinatura}
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default BoletaSignature;
