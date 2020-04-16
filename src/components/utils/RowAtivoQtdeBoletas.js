import React from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import InputFormatado from "components/utils/InputFormatado";

export default (props, namespace) => {
  let step = 0.01;
  let tipoInputQtde = "preco";

  if (props.dadosPesquisa.qtdeMultiplo100) {
    step = 100;
    tipoInputQtde = "quantidade";
  }

  return (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">Ativo</h6>
      </Col>
      <Col className="formAtivo colTextInput">
        <InputGroup>
          <Form.Control
            className="textInput"
            type="text"
            placeholder=""
            name="ativo"
            value={props.ativo}
            onChange={(event) => props.mudarAtivoAction(event, namespace)}
            onKeyPress={(event) => {
              //event.preventDefault();
              if (event.key === "Enter") {
                props.pesquisarAtivoOnEnterAction(props, namespace);
              }
            }}
          />
          <InputGroup.Append className="inputAtivoAppend">
            <span
              className="input-group-text iconeProcurar divClicavel iconePesquisarBoletas"
              onClick={() =>
                props.pesquisarAtivoOnEnterAction(props, namespace)
              }
            >
              <MDBIcon icon="search" />
            </span>
          </InputGroup.Append>
        </InputGroup>
      </Col>

      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Qtde</Form.Label>
          <InputFormatado
            tipoInput={tipoInputQtde}
            step={step}
            value={props.qtde}
            onChange={(valor) => props.mudarQtdAction(valor, namespace)}
            name="qtde"
            onBlur={() => qtdeMultiplo100(props)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const qtdeMultiplo100 = (props) => {
  let erro = "";
  if (Number(props.qtde) % 100 !== 0)
    erro = "Quantidade deve ser múltiplo de 100";
  if (props.dadosPesquisa && props.dadosPesquisa.qtdeMultiplo100) {
    return props.mostrarErroQtdeOnBlurAction(erro);
  } else return false;
};
