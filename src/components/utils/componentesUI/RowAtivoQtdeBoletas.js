import React from "react";
import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import InputFormatado from "components/utils/componentesUI/InputFormatado";
import { useSelector } from "react-redux";

export default RowAtivoQtdeBoletas;

function RowAtivoQtdeBoletas(props, namespace) {
  let tipoInputQtde = "quantidade";

  if (props.dadosPesquisa.stepQtde === 0.01) {
    tipoInputQtde = "preco";
  }

  return (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">Ativo</h6>
      </Col>
      <Col className="formAtivo colTextInput">
        <InputPesquisa props={props} namespace={namespace} />
      </Col>

      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Qtde</Form.Label>
          <InputFormatado
            tipoInput={tipoInputQtde}
            step={props.dadosPesquisa.stepQtde}
            value={props.qtde}
            onChange={(valor) => props.mudarQtdAction(valor, namespace)}
            name="qtde"
            onBlur={() => validacaoQtde(props)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
}

const validacaoQtde = (props) => {
  let erro = "";
  if (Number(props.qtde) % 100 !== 0)
    erro = "Quantidade deve ser múltiplo de 100";
  if (props.dadosPesquisa && props.dadosPesquisa.stepQtde === 100) {
    return props.mostrarErroQtdeOnBlurAction(erro);
  } else return false;
};

const InputPesquisa = ({ props, namespace }) => {
  const reduxState = useSelector((state) => state[namespace]);
  const { pesquisandoAtivo } = reduxState;

  return (
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
          className="iconeProcurar divClicavel iconePesquisarBoletas"
          onClick={() => props.pesquisarAtivoOnEnterAction(props, namespace)}
        >
          {pesquisandoAtivo ? (
            <Spinner
              className="spinnerBoleta"
              animation="border"
              variant="light"
              size="sm"
            />
          ) : (
            <MDBIcon icon="search" />
          )}
        </span>
      </InputGroup.Append>
    </InputGroup>
  );
};
