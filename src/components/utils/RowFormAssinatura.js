import React from "react";
import { Row, Col, Form } from "react-bootstrap";

export default props => (
  <Row className="rowAssinaturaEletronica">
    <Col md={8}>
      <Form>
        <Form.Group>
          <Form.Label>Assinatura eletrônica</Form.Label>
          <Form.Control
            className="textInput"
            type="password"
            value={props.assinatura}
            onChange={event => props.mudarAssinaturaAction(event)}
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
            checked={props.checkSalvarAssinatura}
            onChange={() =>
              props.mudarCheckSalvarAssinaturaAction(
                props.checkSalvarAssinatura
              )
            }
          />
        </Form.Group>
      </Form>
    </Col>
  </Row>
);
