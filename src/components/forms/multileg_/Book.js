import React from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Button } from "react-bootstrap";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import {
  abrirFecharConfigComplAction,
  modificarAtributoAbaAction
} from "components/redux/actions/menu_actions/MultilegActions";
import { calculoPreco } from "components/forms/multileg_/CalculoPreco";
import InputFormatado from "components/utils/InputFormatado";
import { formatarNumero } from "components/redux/reducers/formInputReducer";
import RowValidade from "components/forms/multileg_/RowValidade";
import { enviarOrdemMultilegAction } from "components/redux/actions/api_actions/MenuAPIAction";

class Book extends React.Component {
  render() {
    const indice = this.props.indice,
      max = calculoPreco(this.props.multileg[indice], "max"),
      min = calculoPreco(this.props.multileg[indice], "min");
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
                  (item, indiceLinha) => {
                    if (item.compra && item.venda)
                      return (
                        <tr key={indiceLinha}>
                          <td>
                            {formatarNumDecimal(item.compra.qtty / 1000)}K
                          </td>
                          <td>{formatarNumDecimal(item.compra.price)}</td>
                          <td>{formatarNumDecimal(item.venda.price)}</td>
                          <td>{formatarNumDecimal(item.venda.qtty / 1000)}K</td>
                        </tr>
                      );
                    else
                      return (
                        <tr key={indiceLinha}>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      );
                  }
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
            <input
              type="range"
              className={`custom-range inputRangeMultileg`}
              step="0.01"
              min={min}
              max={max}
              value={this.props.multileg[indice].preco}
              onChange={event =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  Number(event.currentTarget.value).toFixed(2)
                )
              }
            />
          </Col>
        </Row>
        <Row className="ml-1 mr-1 mb-2 rowTextoInputRange">
          <Col md={4}>
            <span
              onClick={() =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  formatarNumero(Number(min).toFixed(2), 2, ".", ",")
                )
              }
              className="divClicavel"
            >
              {formatarNumDecimal(min)}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={() =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  formatarNumero(
                    Number((max + min) / 2).toFixed(2),
                    2,
                    ".",
                    ","
                  )
                )
              }
              className="divClicavel"
            >
              {formatarNumDecimal((max + min) / 2)}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={() =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  formatarNumero(Number(max).toFixed(2), 2, ".", ",")
                )
              }
              className="divClicavel"
            >
              {formatarNumDecimal(max)}
            </span>
          </Col>
        </Row>
        <Row className="mr-2 mb-2">
          <Col md={4} className="ml-2">
            <h6>Preço</h6>
          </Col>
          <Col className="mr-1">
            <InputFormatado
              allowNegative
              autoSelect
              tipoInput="precoNegativo"
              step={0.01}
              value={this.props.multileg[indice].preco}
              onChange={valor =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "preco",
                  valor
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
            <InputFormatado
              tipoInput="preco"
              value={calcularTotal(this.props)}
              readOnly
              onChange={valor =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "total",
                  valor
                )
              }
            />
          </Col>
        </Row>

        {RowValidade(this.props, this.props.multileg[indice])}

        <Row className="mb-2">
          <Col md={4} className="ml-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                this.props.modificarAtributoAbaAction(
                  this.props.multileg,
                  indice,
                  "limpar",
                  ""
                )
              }
            >
              LIMPAR
            </Button>
          </Col>
          <Col className="botoesIncluir mr-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => this.props.enviarOrdemMultilegAction(this.props)}
            >
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
  {
    abrirFecharConfigComplAction,
    modificarAtributoAbaAction,
    enviarOrdemMultilegAction
  }
)(Book);

const calcularTotal = props => {
  let total = 0;
  let aba = props.multileg[props.indice];
  aba.tabelaMultileg.forEach(oferta => {
    total += oferta.qtde * oferta.cotacao;
  });
  return "R$ " + formatarNumDecimal(total);
};