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
import {
  enviarOrdemMultilegAction,
  criarAlertaMultilegAction,
  criarPosicaoMultilegAction
} from "components/redux/actions/api_actions/MenuAPIAction";
import NumberFormat from "react-number-format";

class Book extends React.Component {
  render() {
    const { props } = this;
    const indice = props.indice,
      total = calcularTotal(props),
      min = calculoPreco(props.multileg[indice], "min"),
      max = calculoPreco(props.multileg[indice], "max");

    const renderPlaceholder = renderPlaceholderPreco(props);
    return (
      <div className="divBook">
        <Row>
          <Col className="text-align-center mb-2">
            <h6>Book</h6>
          </Col>
          <IconeConfigGrafico
            handleShow={() =>
              props.abrirFecharConfigComplAction(props.configComplementarAberto)
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
              style={{ tableLayout: "fixed" }}
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
                {props.multileg[indice].tabelaMultileg.map(
                  (item, indiceLinha) => (
                    <tr key={indiceLinha}>
                      <td>{renderQtdeBook(item.compra)}</td>
                      <td>
                        {item.compra
                          ? formatarNumDecimal(item.compra.price)
                          : null}
                      </td>
                      <td>
                        {item.venda
                          ? formatarNumDecimal(item.venda.price)
                          : null}
                      </td>
                      <td>{renderQtdeBook(item.venda)}</td>
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
            <input
              type="range"
              className={`custom-range inputRangeMultileg`}
              step="0.01"
              min={min}
              max={max}
              value={props.multileg[indice].preco}
              onChange={event =>
                props.modificarAtributoAbaAction(
                  props.multileg,
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
                props.modificarAtributoAbaAction(
                  props.multileg,
                  indice,
                  "preco",
                  formatarNumero(Number(min).toFixed(2), 2, ".", ",")
                )
              }
              className="divClicavel"
            >
              {min ? formatarNumDecimal(min) : ""}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={
                min && max
                  ? () =>
                      props.modificarAtributoAbaAction(
                        props.multileg,
                        indice,
                        "preco",
                        formatarNumero(
                          Number((max + min) / 2).toFixed(2),
                          2,
                          ".",
                          ","
                        )
                      )
                  : () => false
              }
              className="divClicavel"
            >
              {min && max ? formatarNumDecimal((max + min) / 2) : ""}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={() =>
                props.modificarAtributoAbaAction(
                  props.multileg,
                  indice,
                  "preco",
                  formatarNumero(Number(max).toFixed(2), 2, ".", ",")
                )
              }
              className="divClicavel"
            >
              {max ? formatarNumDecimal(max) : ""}
            </span>
          </Col>
        </Row>
        <Row className="mr-2 mb-2">
          <Col md={4} className="ml-2">
            <h6>Preço</h6>
          </Col>
          <Col className="mr-1">
            <InputFormatado
              placeholder={renderPlaceholder ? "Informe as qtdes" : ""}
              allowNegative
              autoSelect
              tipoInput="precoNegativo"
              step={0.01}
              value={getPreco(props)}
              onChange={valor =>
                props.modificarAtributoAbaAction(
                  props.multileg,
                  indice,
                  "preco",
                  valor
                )
              }
            />
          </Col>
        </Row>
        <Row className="mr-2">
          <Col md={4} className="ml-2">
            <h6>Total</h6>
          </Col>
          <Col className="mr-1 text-align-center">
            <NumberFormat
              style={{ width: "112.28px" }}
              className={`form-control textInput`}
              thousandSeparator="."
              decimalSeparator=","
              readOnly
              value={
                total < 0
                  ? formatarNumDecimal(total * -1)
                  : formatarNumDecimal(total)
              }
            />
            <span>
              {total < 0
                ? "Crédito de R$ " + formatarNumDecimal(total * -1)
                : "Débito de R$ " + formatarNumDecimal(total)}
            </span>
          </Col>
        </Row>
        <Row className="mr-2 mb-2">
          <Col className="mr-1"></Col>
        </Row>

        {RowValidade(props, props.multileg[indice])}

        <Row className="mb-2">
          <Col md={4} className="ml-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                props.modificarAtributoAbaAction(
                  props.multileg,
                  indice,
                  "limpar",
                  ""
                )
              }
            >
              LIMPAR
            </Button>
          </Col>
          <Col className="mr-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => props.enviarOrdemMultilegAction(props)}
            >
              EXECUTAR
            </Button>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={9} className="ml-4 pr-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => props.criarAlertaMultilegAction(props)}
              block
            >
              ALERTA DE OPERAÇÃO
            </Button>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={9} className="ml-4 pr-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => props.criarPosicaoMultilegAction(props)}
              block
            >
              CRIAR POSIÇÃO
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
    enviarOrdemMultilegAction,
    criarAlertaMultilegAction,
    criarPosicaoMultilegAction
  }
)(Book);

const calcularTotal = props => {
  let total = 0;
  let aba = props.multileg[props.indice];
  aba.tabelaMultileg.forEach(oferta => {
    if (oferta.cv === "compra") total += oferta.qtde * oferta.cotacao;
    else total -= oferta.qtde * oferta.cotacao;
  });
  return total;
};

const renderPlaceholderPreco = props => {
  let renderPlaceholder = false;
  let tabelaMultileg = props.multileg[props.indice].tabelaMultileg;

  tabelaMultileg.forEach(oferta => {
    let qtde = oferta.qtde + "";
    qtde = qtde.split(".").join("");
    if (!qtde || qtde === "0") {
      renderPlaceholder = true;
    }
  });

  return renderPlaceholder;
};

const getPreco = props => {
  let preco = props.multileg[props.indice].preco;

  if (["0,00", "0.00"].includes(preco)) return "";

  return preco;
};

const renderQtdeBook = itemBook => {
  if (itemBook) {
    if (itemBook.qtty > 1000000000)
      return formatarNumDecimal(itemBook.qtty / 1000000000) + "G";
    else if (itemBook.qtty > 1000000)
      return formatarNumDecimal(itemBook.qtty / 1000000) + "M";
    else if (itemBook.qtty > 1000) {
      return formatarNumDecimal(itemBook.qtty / 1000) + "K";
    }
  }
  return null;
};
