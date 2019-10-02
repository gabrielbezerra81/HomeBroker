import React from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Form, Button } from "react-bootstrap";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import DatePicker from "react-datepicker";
import { formatarNumDecimal } from "components/utils/Formatacoes";

class Book extends React.Component {
  render() {
    const indice = this.props.indice,
      max = calculoPrecoMax(this.props),
      min = calculoPrecoMin(this.props);
    return (
      <div>
        <Row>
          <Col className="text-align-center mb-2">
            <h6>Book</h6>
          </Col>
          <IconeConfigGrafico
            handleShow={() =>
              this.props.abrirFecharConfigComplAction(
                this.props.configComplementarAberto
              )
            }
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
                {this.props.multileg[indice].tabelaMultileg.map(
                  (item, indiceLinha) => (
                    <tr key={indiceLinha}>
                      <td>{formatarNumDecimal(item.compra.qtty / 1000)}K</td>
                      <td>{formatarNumDecimal(item.compra.price)}</td>
                      <td>{formatarNumDecimal(item.venda.price)}</td>
                      <td>{formatarNumDecimal(item.venda.qtty / 1000)}K</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="ml-1 mr-1 rowTextoInputRange">
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
            <input type="range" className={`custom-range inputRangeMultileg`} />
          </Col>
        </Row>
        <Row className="ml-1 mr-1 mb-2 rowTextoInputRange">
          <Col md={4}>
            <span>{max}</span>
          </Col>
          <Col md={4}>
            <span>{(max + min) / 2}</span>
          </Col>
          <Col md={4}>
            <span>{min}</span>
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
              value={this.props.multileg[indice].preco}
              onChange={event =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  event.currentTarget.value
                )
              }
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
              value={this.props.multileg[indice].total}
              onChange={event =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "total",
                  event.currentTarget.value
                )
              }
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
              selected={this.props.multileg[indice].validade}
              onChange={data =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "validade",
                  data
                )
              }
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
    );
  }
}

const mapStateToProps = state => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg
});

export default connect(
  mapStateToProps,
  {}
)(Book);

const calculoPrecoMax = props => {
  let max = 0;
  let aba = props.multileg[props.indice];
  let arrayQtde = [];

  aba.tabelaMultileg.map((oferta, index) => {
    arrayQtde.push(oferta.qtde);
  });
  const mdc = gcd(arrayQtde);

  if (mdc > 0)
    aba.tabelaMultileg.map((oferta, index) => {
      if (oferta.cv === "compra") {
        max += oferta.venda.price * (oferta.qtde / mdc);
      } else if (oferta.cv === "venda") {
        max -= oferta.compra.price * (oferta.qtde / mdc);
      }
    });

  return max;
};

const calculoPrecoMin = props => {
  let min = 0;
  let aba = props.multileg[props.indice];
  let arrayQtde = [];

  aba.tabelaMultileg.map((oferta, index) => {
    arrayQtde.push(oferta.qtde);
  });
  const mdc = gcd(arrayQtde);

  if (mdc > 0)
    aba.tabelaMultileg.map((oferta, index) => {
      if (oferta.cv === "compra") {
        min += oferta.compra.price * (oferta.qtde / mdc);
      } else if (oferta.cv === "venda") {
        min -= oferta.venda.price * (oferta.qtde / mdc);
      }
    });

  return min;
};

var gcd2 = function(a, b) {
  return !b ? a : gcd2(b, a % b);
};
var gcd = function(nums) {
  var factor = nums[0];
  for (var i = 1; i < nums.length; i++) {
    factor = gcd2(factor, nums[i]);
  }
  return factor;
};
