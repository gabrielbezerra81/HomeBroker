import React from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Form } from "react-bootstrap";
import IconeConfigGrafico from "shared/componentes/IconeConfigGrafico";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { updateMultilegTabAction } from "redux/actions/multileg/MultilegActions";
import {
  findMultilegQuote,
  findMultilegBook,
} from "redux/actions/multileg/utils";
import {
  calculoPreco,
  calcularTotal,
  verificaCalculoSemBook,
} from "screens/popups/multileg_/CalculoPreco";
import CustomInput from "shared/componentes/CustomInput";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import RowValidade from "screens/popups/multileg_/RowValidade";
import {
  sendMultilegOrderAction,
  createMultilegPositionAction,
  addQuoteBoxFromMultilegAction,
} from "redux/actions/multileg/MultilegAPIAction";
import NumberFormat from "react-number-format";
import { StorePrincipalContext } from "redux/StoreCreation";
import { aviso_calculo_preco_multileg } from "constants/AlertaErros";
import OperationButtons from "./OperationButtons";

class Book extends React.Component {
  componentDidUpdate(prevProps) {
    const { indice: tabIndex, multileg } = this.props;

    if (
      prevProps.multileg[tabIndex].tabelaMultileg.length >
      multileg[tabIndex].tabelaMultileg.length
    ) {
      atualizarPrecoDinamicante(this.props);
    }
  }

  render() {
    const { props } = this;
    const { indice: tabIndex, cotacoesMultileg, executionStrategies } = props;
    const aba = props.multileg[tabIndex];

    const total = calcularTotal(props);
    const min = calculoPreco(aba, "min", cotacoesMultileg);
    const max = calculoPreco(aba, "max", cotacoesMultileg);

    const condicaoMed =
      (min && max) ||
      (min === 0 && max) ||
      (min && max === 0) ||
      (min === 0 && max === 0);

    const calculoSemBook = verificaCalculoSemBook(
      aba.tabelaMultileg,
      cotacoesMultileg,
    );

    const renderPlaceholder = renderPlaceholderPreco(props);
    return (
      <div className="divBook">
        <Row>
          <Col className="text-align-center mb-2">
            <h6>Book</h6>
          </Col>
          <IconeConfigGrafico
            name="config_complementar"
            className="icone_config_complementar"
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
                {props.multileg[tabIndex].tabelaMultileg.map(
                  (item, indiceLinha) => {
                    const book = findMultilegBook({
                      multilegQuotes: props.cotacoesMultileg,
                      symbol: item.codigoSelecionado,
                    });
                    const cotacao = findMultilegQuote({
                      multilegQuotes: props.cotacoesMultileg,
                      symbol: item.codigoSelecionado,
                    });
                    if (book)
                      return (
                        <tr key={indiceLinha}>
                          <td>{renderQtdeBook(book.compra)}</td>
                          <td>
                            {(book.compra && book.compra.price) || cotacao
                              ? formatarNumDecimal(book.compra.price)
                              : null}
                          </td>
                          <td>
                            {(book.venda && book.venda.price) || cotacao
                              ? formatarNumDecimal(book.venda.price)
                              : null}
                          </td>
                          <td>{renderQtdeBook(book.venda)}</td>
                        </tr>
                      );
                    return null;
                  },
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
              value={Number(props.multileg[tabIndex].preco.replace(",", "."))}
              onChange={(event) => {
                props.updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumDecimal(
                    Number(event.currentTarget.value),
                  ),
                });
              }}
            />
          </Col>
        </Row>
        <Row className="ml-1 mr-1 mb-2 rowTextoInputRange">
          <Col md={4}>
            <span
              onClick={() =>
                props.updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumero(
                    Number(min).toFixed(2),
                    2,
                    ".",
                    ",",
                  ),
                })
              }
              className="divClicavel"
            >
              {min || min === 0 ? formatarNumDecimal(min) : ""}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={
                condicaoMed
                  ? () =>
                      props.updateMultilegTabAction({
                        tabIndex,
                        attributeName: "preco",
                        attributeValue: formatarNumero(
                          Number((max + min) / 2).toFixed(2),
                          2,
                          ".",
                          ",",
                        ),
                      })
                  : () => false
              }
              className="divClicavel"
            >
              {condicaoMed ? formatarNumDecimal((max + min) / 2) : ""}
            </span>
          </Col>
          <Col md={4}>
            <span
              onClick={() =>
                props.updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumero(
                    Number(max).toFixed(2),
                    2,
                    ".",
                    ",",
                  ),
                })
              }
              className="divClicavel"
            >
              {max || max === 0 ? formatarNumDecimal(max) : ""}
            </span>
          </Col>
        </Row>
        {calculoSemBook ? (
          <Row className="mb-2">
            <Col className="text-align-center textoAvisoCalculoSemBook">
              {aviso_calculo_preco_multileg}
            </Col>
          </Row>
        ) : null}
        <Row className="mr-2 mb-2 multilegInputGroup">
          <Col md={5} className="ml-2">
            <h6>Preço</h6>
          </Col>
          <Col className="mr-1 inputPaddingRight">
            <CustomInput
              placeholder={renderPlaceholder ? "Informe as qtdes" : ""}
              allowNegative
              autoSelect
              type="precoNegativo"
              step={0.01}
              value={renderPlaceholder ? "" : getPreco(props)}
              onChange={(valor) =>
                props.updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: valor,
                })
              }
            />
          </Col>
        </Row>
        <Row className="mr-2 rowPrecoTotal multilegInputGroup">
          <Col md={5} className="ml-2">
            <h6>Total</h6>
          </Col>
          <Col className="mr-0 text-align-center">
            <NumberFormat
              style={{ width: "112.28px" }}
              className={`form-control textInput`}
              thousandSeparator="."
              decimalSeparator=","
              readOnly
              value={
                renderPlaceholder
                  ? ""
                  : total < 0
                  ? formatarNumDecimal(total * -1)
                  : formatarNumDecimal(total)
              }
            />
            <span>
              {renderPlaceholder
                ? "Débito de R$ 0,00"
                : total < 0
                ? "Crédito de R$ " + formatarNumDecimal(total * -1)
                : "Débito de R$ " + formatarNumDecimal(total)}
            </span>
          </Col>
        </Row>
        <Row className="mr-2 mb-2">
          <Col className="mr-1"></Col>
        </Row>

        {RowValidade(props, props.multileg[tabIndex])}

        <Row className="mr-2 mb-2 multilegInputGroup">
          <Col md={5} className="ml-2">
            <h6>Modo Exec.</h6>
          </Col>

          <Col>
            <Form.Control
              as="select"
              value={props.multileg[tabIndex].selectedStrategy}
              className="textInput strategyInput"
              onChange={(e) =>
                props.updateMultilegTabAction({
                  tabIndex,
                  attributeName: "selectedStrategy",
                  attributeValue: Number(e.target.value),
                })
              }
            >
              {executionStrategies.map((strategyItem) => (
                <option key={strategyItem.sigla} value={strategyItem.id}>
                  {strategyItem.sigla}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>

        <OperationButtons tabIndex={tabIndex} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  cotacoesMultileg: state.multilegReducer.cotacoesMultileg,
  token: state.systemReducer.token,
  accounts: state.systemReducer.accounts,
  selectedAccount: state.systemReducer.selectedAccount,
  cotacoesMultilegID: state.multilegReducer.cotacoesMultilegID,
  executionStrategies: state.multilegReducer.executionStrategies,
});

export default connect(
  mapStateToProps,
  {
    updateMultilegTabAction,
    sendMultilegOrderAction,
    createMultilegPositionAction,
    addQuoteBoxFromMultilegAction,
  },
  null,
  { context: StorePrincipalContext },
)(Book);

const renderPlaceholderPreco = (props) => {
  let renderPlaceholder = false;
  let tabelaMultileg = props.multileg[props.indice].tabelaMultileg;

  tabelaMultileg.forEach((oferta) => {
    let qtde = oferta.qtde + "";
    qtde = qtde.split(".").join("");
    if (qtde === "" || qtde === "0") {
      renderPlaceholder = true;
    }
  });

  return renderPlaceholder;
};

const getPreco = (props) => {
  let preco = props.multileg[props.indice].preco;

  if (["0.00"].includes(preco)) return "";

  return preco;
};

const renderQtdeBook = (itemBook) => {
  if (itemBook) {
    if (itemBook.qtty > 1000000000)
      return formatarNumDecimal(itemBook.qtty / 1000000000) + "G";
    else if (itemBook.qtty > 1000000)
      return formatarNumDecimal(itemBook.qtty / 1000000) + "M";
    else if (itemBook.qtty < 1000000) {
      return formatarNumDecimal(itemBook.qtty / 1000) + "K";
    }
  }
  return null;
};

const atualizarPrecoDinamicante = (props) => {
  const aba = props.multileg[props.indice];
  const preco = aba.preco;

  let novoPreco = calculoPreco(aba, "ultimo", props.cotacoesMultileg).toFixed(
    2,
  );
  novoPreco = formatarNumero(novoPreco, 2, ".", ",");

  console.log("preco antigo", preco);
  console.log("preco atual", novoPreco);

  if (preco !== novoPreco && !Number.isNaN(novoPreco))
    props.updateMultilegTabAction({
      tabIndex: props.indice,
      attributeName: "preco",
      attributeValue: novoPreco,
    });
};
