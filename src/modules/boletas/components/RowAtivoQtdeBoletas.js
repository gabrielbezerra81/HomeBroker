import React from "react";
import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import CustomInput from "shared/componentes/CustomInput";
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
          <CustomInput
            type={tipoInputQtde}
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
            props.pesquisarAtivoOnEnterAction(namespace);
          }
        }}
      />
      <InputGroup.Append>
        <span
          className="appendedSearchIcon divClicavel iconePesquisarBoletas"
          onClick={() => props.pesquisarAtivoOnEnterAction(namespace)}
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
