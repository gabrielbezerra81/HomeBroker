import React, { useEffect, useMemo } from "react";
import { Table, Row, Col } from "react-bootstrap";
import IconeConfigGrafico from "shared/components/IconeConfigGrafico";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import {
  cond_updateMultilegPriceAction,
  cond_updateMultilegTabAction,
} from "../../duck/actions/ConditionalMultilegActions";
import { cond_findMultilegBook } from "../../duck/actions/utils";
import {
  calculoPreco,
  verificaCalculoSemBook,
} from "../../duck/actions/CalculoPreco";
import { formatarNumero } from "shared/utils/Formatacoes";
import { aviso_calculo_preco_multileg } from "constants/AlertaErros";
import OperationButtons from "./OperationButtons";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";

interface Props {
  indice: number;
}

const Book: React.FC<Props> = ({ indice: tabIndex }) => {
  const {
    conditionalMultilegReducer: { cotacoesMultileg, multileg },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const tab = useMemo(() => {
    return multileg[tabIndex];
  }, [multileg, tabIndex]);

  const min = useMemo(() => {
    return calculoPreco(tab, "min", cotacoesMultileg);
  }, [cotacoesMultileg, tab]);

  const max = useMemo(() => {
    return calculoPreco(tab, "max", cotacoesMultileg);
  }, [cotacoesMultileg, tab]);

  const condicaoMed = useMemo(() => {
    return (
      (min && max) ||
      (min === 0 && max) ||
      (min && max === 0) ||
      (min === 0 && max === 0)
    );
  }, [max, min]);

  const calculoSemBook = useMemo(() => {
    return verificaCalculoSemBook(tab.tabelaMultileg, cotacoesMultileg);
  }, [cotacoesMultileg, tab.tabelaMultileg]);

  const previousMultileg = usePrevious(multileg);

  const rangeValue = useMemo(() => {
    const price = multileg[tabIndex].preco;

    if (typeof price === "string") {
      return Number(price.replace(",", "."));
    }

    return multileg[tabIndex].preco;
  }, [multileg, tabIndex]);

  useEffect(() => {
    if (
      previousMultileg &&
      previousMultileg[tabIndex].tabelaMultileg.length >
        multileg[tabIndex].tabelaMultileg.length
    ) {
      dispatch(cond_updateMultilegPriceAction(tabIndex));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, multileg, tabIndex]);

  const multilegBooks = useMemo(() => {
    return multileg[tabIndex].tabelaMultileg.map((offerItem, lineIndex) => {
      const offerBook = {
        buy: {
          price: "",
          qtty: "",
          highlight: false,
        },
        sell: {
          price: "",
          qtty: "",
          highlight: false,
        },
      };

      const symbolBook = cond_findMultilegBook({
        multilegQuotes: cotacoesMultileg,
        symbol: offerItem.codigoSelecionado,
      });

      if (symbolBook) {
        if (symbolBook.compra && symbolBook.compra.price !== null) {
          offerBook.buy.qtty = renderQtdeBook(symbolBook.compra) || "";
          offerBook.buy.price = formatarNumDecimal(symbolBook.compra.price);
          if (offerItem.cv === "venda") {
            offerBook.buy.highlight = true;
          }
        }
        if (symbolBook.venda && symbolBook.venda.price !== null) {
          offerBook.sell.price = formatarNumDecimal(symbolBook.venda.price);
          offerBook.sell.qtty = renderQtdeBook(symbolBook.venda) || "";
          if (offerItem.cv === "compra") {
            offerBook.sell.highlight = true;
          }
        }
      }

      return offerBook;
    });
  }, [cotacoesMultileg, multileg, tabIndex]);

  return (
    <div className="divBook">
      <Row>
        <Col className="text-align-center mb-2">
          <h6>Book</h6>
        </Col>
        <IconeConfigGrafico
          name="config_complementar_conditional_multileg"
          className="configIcon"
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
              {multilegBooks.map((bookItem, lineIndex) => {
                return (
                  <tr key={lineIndex}>
                    <td>{bookItem.buy.qtty}</td>
                    <td className="priceColumn">
                      <span
                        className={
                          bookItem.buy.highlight ? "buyBorderColor" : ""
                        }
                      >
                        {bookItem.buy.price}
                      </span>
                    </td>
                    <td className="priceColumn">
                      <span
                        className={
                          bookItem.sell.highlight ? "sellBorderColor" : ""
                        }
                      >
                        {bookItem.sell.price}
                      </span>
                    </td>
                    <td>{bookItem.sell.qtty}</td>
                  </tr>
                );
              })}
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
            value={rangeValue}
            onChange={(event) => {
              dispatch(
                cond_updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumDecimal(
                    Number(event.currentTarget.value),
                  ),
                }),
              );
            }}
          />
        </Col>
      </Row>
      <Row className="ml-1 mr-1 mb-2 rowTextoInputRange">
        <Col md={4}>
          <span
            onClick={() =>
              dispatch(
                cond_updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumero(
                    Number(min).toFixed(2),
                    2,
                    ".",
                    ",",
                  ),
                }),
              )
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
                    dispatch(
                      cond_updateMultilegTabAction({
                        tabIndex,
                        attributeName: "preco",
                        attributeValue: formatarNumero(
                          Number((max + min) / 2).toFixed(2),
                          2,
                          ".",
                          ",",
                        ),
                      }),
                    )
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
              dispatch(
                cond_updateMultilegTabAction({
                  tabIndex,
                  attributeName: "preco",
                  attributeValue: formatarNumero(
                    Number(max).toFixed(2),
                    2,
                    ".",
                    ",",
                  ),
                }),
              )
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

      {tab.tabType === "ORDEM" && <OperationButtons tabIndex={tabIndex} />}
    </div>
  );
};

export default Book;

const renderQtdeBook = (itemBook: any) => {
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
