import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import InputFormatado from "components/utils/InputFormatado";

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
                props.pesquisarAtivoOnEnterAction(props, namespace);
              }
            }}
          />
        </Form.Group>
      </Col>

      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Qtde</Form.Label>
          <InputFormatado
            tipoInput="quantidade"
            step={100}
            value={props.qtde}
            onChange={valor => props.mudarQtdAction(valor, namespace)}
            name="qtde"
            onBlur={() => qtdeMultiplo100(props)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const qtdeMultiplo100 = props => {
  let erro = "";
  if (Number(props.qtde) % 100 !== 0)
    erro = "Quantidade deve ser múltiplo de 100";
  if (props.dadosPesquisa && props.dadosPesquisa.qtdeMultiplo100) {
    return props.mostrarErroQtdeOnBlurAction(erro);
  } else return false;
};
