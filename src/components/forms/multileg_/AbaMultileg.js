import React from "react";
import { Table, Form, Button, InputGroup, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { MDBIcon } from "mdbreact";
import TabelaMultileg from "components/forms/multileg_/TabelaMultileg";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";

class AbaMultileg extends React.Component {
  render() {
    return (
      <div className="containerAbaMultileg">
        <div>
          <div className="divDetalhesAbaMultileg">
            <div className="divColunaDetalhes">
              <InputGroup>
                <Form.Control
                  className="inputAtivo"
                  type="text"
                  value="PETR4"
                  onChange={() => false}
                />
                <InputGroup.Append className="inputAtivoAppend">
                  <span className="input-group-text iconeProcurar divClicavel">
                    <MDBIcon icon="search" />
                  </span>
                </InputGroup.Append>
              </InputGroup>
              <h5 className="textoValor">-27,43</h5>
              {renderSeta(2)}
              {renderValorPorcentagem(5.35)}
            </div>
            <div className="divColunaDetalhes">
              <Form.Group>
                <Form.Label>Strike</Form.Label>
                <Form.Control
                  className="textInput"
                  type="number"
                  step={0.01}
                  //value={1}
                  onChange={() => false}
                />
              </Form.Group>
              <Form.Group className="wrapperVencimento ml-1">
                <Form.Label>Vencimento</Form.Label>
                <DatePicker
                  className="form-control textInput"
                  //selected={props.date}
                  onChange={() => false}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="top-start"
                ></DatePicker>
              </Form.Group>
            </div>
            <div className="divColunaDetalhes">
              <div className="divFlexRowDetalhesAba">
                <Form.Label>Incluir</Form.Label>
                <div className="botoesIncluir">
                  <Button variant="primary" size="sm">
                    +Ativo
                  </Button>
                  <Button variant="primary" size="sm">
                    +Call
                  </Button>
                  <Button variant="primary" size="sm">
                    +Put
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <TabelaMultileg></TabelaMultileg>
        </div>
        <div>
          <Row>
            <Col className="text-align-center mb-2">
              <h6>Book</h6>
            </Col>
            <IconeConfigGrafico
              handleShow={() => false}
              name="config_complementar"
              id="icone_config_complementar"
            />
          </Row>
          <Row>
            <Col className="text-align-center">
              <h6 className="textoCompra">Compra</h6>
            </Col>
            <Col className="text-align-center">
              <h6 className="textoVenda">Venda</h6>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                variant="dark"
                borderless
                striped
                className="tabelaBook text-center"
              >
                <thead>
                  <tr>
                    <th>Qtde.</th>
                    <th>Preço</th>
                    <th>Preço</th>
                    <th>Qtde.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>3,7K</td>
                    <td>2,40</td>
                    <td>2,50</td>
                    <td>0,7K</td>
                  </tr>
                  <tr>
                    <td>3,7K</td>
                    <td>1,50</td>
                    <td>1,60</td>
                    <td>1,7K</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="ml-3 mr-1 rowTextoInputRange">
            <Col md={4}>
              <span>Min</span>
            </Col>
            <Col md={4}>
              <span>Med</span>
            </Col>
            <Col md={4}>
              <span>Max</span>
            </Col>
          </Row>
          <Row className="ml-3 mr-3">
            <Col className="colInputRange">
              <input
                type="range"
                className={`custom-range inputRangeMultileg`}
              />
            </Col>
          </Row>
          <Row className="ml-3 mr-1 mb-2 rowTextoInputRange">
            <Col md={4}>
              <span>0,80</span>
            </Col>
            <Col md={4}>
              <span>0,90</span>
            </Col>
            <Col md={4}>
              <span>1,00</span>
            </Col>
          </Row>
          <Row className="mr-2 mb-2">
            <Col md={4} className="ml-2">
              <h6>Preço</h6>
            </Col>
            <Col className="mr-1">
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={1}
                onChange={() => false}
              />
            </Col>
          </Row>
          <Row className="mr-2 mb-2">
            <Col md={4} className="ml-2">
              <h6>Total</h6>
            </Col>
            <Col className="mr-1">
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={1}
                onChange={() => false}
              />
            </Col>
          </Row>
          <Row className="mr-2 mb-2">
            <Col md={4} className="ml-2">
              <h6>Validade</h6>
            </Col>
            <Col className="mr-1 wrapperVencimento">
              <DatePicker
                className="form-control textInput"
                //selected={props.date}
                onChange={() => false}
                dateFormat="dd/MM/yyyy"
                popperPlacement="top-start"
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4} className="ml-4">
              <Button variant="secondary" size="sm">
                LIMPAR
              </Button>
            </Col>
            <Col className="botoesIncluir mr-1">
              <Button variant="primary" size="sm">
                EXECUTAR
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AbaMultileg;

const renderSeta = valor => {
  valor = Number(valor);
  if (valor >= 0) return <ArrowUp fill="#138342" className="mr-1" width="35" />;
  else return <ArrowDown fill="red" className="mr-1" width="35" />;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6 className="porcentagemPositiva">+{porcentagem}%</h6>;
  } else if (porcentagem < 0) {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6 className="porcentagemNegativa">{porcentagem}%</h6>;
  } else {
    porcentagem = porcentagem.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
    return <h6>+{porcentagem}%</h6>;
  }
};
