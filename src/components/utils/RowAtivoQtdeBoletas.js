import React from "react";
import { Row, Col, Form } from "react-bootstrap";

export default (props, namespace) => {
  return (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">Ativo</h6>
      </Col>
      <Col className="formAtivo colTextInput">
        <Form.Group>
          <Form.Label />
          <Form.Control
            className="textInput"
            type="text"
            placeholder=""
            name="ativo"
            value={props.ativo}
            onChange={event => props.mudarAtivoAction(event, namespace)}
            onKeyPress={event => {
              //event.preventDefault();
              if (event.key === "Enter") {
                props.pesquisarAtivoOnEnterAction(props.ativo, namespace);
              }
            }}
          />
        </Form.Group>
      </Col>

      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Qtde</Form.Label>
          <Form.Control
            className="textInput"
            type="number"
            step={100}
            min={0}
            value={props.qtde}
            onChange={event => props.mudarQtdAction(event, namespace)}
            name="qtde"
            onBlur={() => qtdeMultiplo100(props)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const qtdeMultiplo100 = props => {
  if (props.dadosPesquisa && props.dadosPesquisa.qtdeMultiplo100) {
    return props.mostrarErroQtdeOnBlurAction(props.erro);
  } else return false;
};
