import React, { useState, useMemo } from "react";
import { Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Select } from "antd";

import InputFormatado from "shared/componentes/InputFormatado";
import { formatarVencimento } from "shared/utils/Formatacoes";
import {
  findMultilegQuote,
  findMultilegBook,
} from "redux/actions/multileg/utils";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import modelEUImage from "assets/modeloEU.png";
import modelUSAImage from "assets/modeloUSA2.svg";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  MultilegQuote,
  MultilegOffer,
  MultilegOption,
} from "types/multileg/multileg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  removeMultilegOfferAction,
  updateMultilegOfferAction,
} from "redux/actions/multileg/MultilegActions";

interface MultilegOfferProps {
  lineIndex: number;
  tabIndex: number;
  offer: MultilegOffer;
}

const MultilegOfferItem: React.FC<MultilegOfferProps> = ({
  lineIndex,
  tabIndex,
  offer,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multilegReducer: { cotacoesMultileg },
  } = useStateStorePrincipal();

  const [isOpenCodeDropdown, setIsOpenCodeDropdown] = useState(false);

  const quote = getQuote(cotacoesMultileg, offer);

  const offerValue = useMemo(() => {
    return calculateOfferValue(cotacoesMultileg, offer);
  }, [cotacoesMultileg, offer]);

  const symbolOptionsDropdown = useMemo(
    () =>
      renderSymbolOptionsDropdown({
        options: offer.opcoes,
        isDropdownOpen: isOpenCodeDropdown,
        type: offer.tipo,
      }),
    [isOpenCodeDropdown, offer.opcoes, offer.tipo],
  );

  const strikeOptions = useMemo(
    () =>
      offer.opcoes
        .filter((_, index) => offer.tipo && index % 2 === 0)
        .map((option, index) => {
          const parsedOption = option as MultilegOption;
          if (parsedOption.strike) {
            return (
              <option key={index} value={parsedOption.strike}>
                {parsedOption.strike}
              </option>
            );
          }
          return null;
        }),
    [offer.opcoes, offer.tipo],
  );

  return (
    <tr key={lineIndex} id={`ofertaMultileg${lineIndex}`}>
      <td
        className="divClicavel"
        onClick={() =>
          dispatch(
            removeMultilegOfferAction({
              tabIndex,
              lineIndex,
            }),
          )
        }
      >
        <MDBIcon icon="times" className="saldoOpNegativo" />
      </td>
      <td>
        <CV offerCV={offer.cv} lineIndex={lineIndex} tabIndex={tabIndex} />
      </td>
      <td>
        <Form.Group>
          <InputFormatado
            name="qtde"
            tipoInput="quantidade"
            step={100}
            autoSelect
            value={offer.qtde}
            onChange={(value: any) =>
              dispatch(
                updateMultilegOfferAction({
                  tabIndex,
                  attributeName: "qtde",
                  attributeValue: value,
                  lineIndex,
                }),
              )
            }
            className="formDespernamento"
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group>
          <Form.Control
            as="select"
            className="textInput inputSerie"
            value={offer.serieSelecionada}
            onChange={(event) =>
              dispatch(
                updateMultilegOfferAction({
                  tabIndex,
                  attributeName: "serieSelecionada",
                  attributeValue: event.currentTarget.value,
                  lineIndex,
                }),
              )
            }
          >
            {offer.serie.map((serie, serieIndex) => (
              <option key={serie + serieIndex} value={serie}>
                {formatarVencimento(serie)}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </td>
      <td>
        <Form.Group>
          <Form.Control
            as="select"
            className="textInput"
            value={offer.strikeSelecionado}
            onChange={(event) =>
              dispatch(
                updateMultilegOfferAction({
                  tabIndex,
                  attributeName: "strikeSelecionado",
                  attributeValue: Number(event.currentTarget.value),
                  lineIndex,
                }),
              )
            }
          >
            {strikeOptions}
          </Form.Control>
        </Form.Group>
      </td>
      <td>
        <Select
          size="small"
          dropdownClassName="inputCodigoDropdown"
          value={offer.codigoSelecionado}
          showSearch
          optionFilterProp="children"
          notFoundContent="Código não encontrado"
          className="inputCodigo"
          suffixIcon={<MDBIcon icon="caret-down" />}
          onChange={(value: any) => {
            dispatch(
              updateMultilegOfferAction({
                tabIndex,
                attributeName: "codigoSelecionado",
                attributeValue: value,
                lineIndex,
              }),
            );
          }}
          onDropdownVisibleChange={setIsOpenCodeDropdown}
        >
          {symbolOptionsDropdown}
        </Select>
      </td>
      <td>
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() =>
            dispatch(
              updateMultilegOfferAction({
                tabIndex,
                attributeName: "tipo",
                attributeValue: offer.tipo,
                lineIndex,
              }),
            )
          }
        >
          {offer.tipo.toUpperCase()}
        </div>
      </td>
      <td>
        <Model model={offer.modelo} />
      </td>
      <td>
        <Form.Group>
          <InputFormatado
            name="qtde"
            tipoInput="quantidade"
            step={100}
            value={offer.despernamento}
            onChange={(value: any) =>
              dispatch(
                updateMultilegOfferAction({
                  tabIndex,
                  attributeName: "despernamento",
                  attributeValue: value,
                  lineIndex,
                }),
              )
            }
            className="formDespernamento"
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group>
          <Form.Control
            as="select"
            className="textInput formPrioridade"
            value={offer.prioridade}
            onChange={(event) => {
              dispatch(
                updateMultilegOfferAction({
                  tabIndex,
                  attributeName: "prioridade",
                  attributeValue: Number(event.currentTarget.value),
                  lineIndex,
                }),
              );
            }}
          >
            <option value={-1}>-1</option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </Form.Control>
        </Form.Group>
      </td>
      <td>{quote}</td>
      <td>{offerValue}</td>
    </tr>
  );
};

export default MultilegOfferItem;

const calculateOfferValue = (
  multilegQuotes: MultilegQuote[],
  offer: MultilegOffer,
) => {
  let value;
  const book = findMultilegBook({
    multilegQuotes,
    symbol: offer.codigoSelecionado,
  });
  if (offer.cv === "compra" && book && book.venda.price) {
    value = book.venda.price;
  } //
  else if (offer.cv === "venda" && book && book.compra.price) {
    value = book.compra.price;
  } //
  else {
    const quote = getQuote(multilegQuotes, offer);
    value = Number(quote.replace(",", "."));
  }

  return formatarNumDecimal(offer.qtde * value);
};

interface CVProps {
  offerCV: MultilegOffer["cv"];
  tabIndex: number;
  lineIndex: number;
}

const CV: React.FC<CVProps> = ({ offerCV, tabIndex, lineIndex }) => {
  const dispatch = useDispatchStorePrincipal();

  const cv = useMemo(() => {
    const cv = { buy: "", sell: "" };

    if (offerCV === "compra") {
      cv.buy = "cvCompra";
    } else {
      cv.sell = "cvVenda";
    }

    return cv;
  }, [offerCV]);

  return (
    <div className="divCV">
      <h6
        className={`${cv.buy} divClicavel`}
        onClick={() =>
          dispatch(
            updateMultilegOfferAction({
              tabIndex,
              attributeName: "cv",
              attributeValue: "compra",
              lineIndex,
            }),
          )
        }
      >
        C
      </h6>
      <h6
        className={`${cv.sell} divClicavel`}
        onClick={() =>
          dispatch(
            updateMultilegOfferAction({
              tabIndex,
              attributeName: "cv",
              attributeValue: "venda",
              lineIndex,
            }),
          )
        }
      >
        V
      </h6>
    </div>
  );
};

interface ModelProps {
  model: MultilegOffer["modelo"];
}

const Model: React.FC<ModelProps> = ({ model }) => {
  if (model === "EUROPEAN")
    return (
      <div>
        <img src={modelEUImage} alt="" className="imgModelo" />
      </div>
    );
  else if (model === "AMERICAN")
    return (
      <div>
        <img src={modelUSAImage} alt="" className="imgModelo" />
      </div>
    );
  else return null;
};

interface SymbolOptionsDropdownProps {
  isDropdownOpen: boolean;
  options: MultilegOffer["opcoes"];
  type: MultilegOffer["tipo"];
}

const renderSymbolOptionsDropdown = ({
  options,
  isDropdownOpen,
  type,
}: SymbolOptionsDropdownProps) => {
  const parsedType = type.toUpperCase();

  const symbolList = [];

  // se o código não for opção, terá apenas 1 elemento que é a ação: ex PETR4
  if (options.length === 1) {
    symbolList.push(
      <Select.Option
        key={Math.random()}
        value={options[0].symbol}
        className="optionInputCodigo"
      >
        {options[0].symbol}
      </Select.Option>,
    );
  } //
  // Se for opção, as visualizações são diferentes quando o dropdown está aberto. Quando o dropdown está aberto,
  // mostra os códigos de call e put junto com o strike. Caso contrário, mostra apenas o código selecionado.
  else if (isDropdownOpen)
    options.forEach((option, indice) => {
      const parsedOption = option as MultilegOption;
      if (indice % 2 === 0) {
        let strikeWithSymbols =
          parsedOption.type === "CALL"
            ? parsedOption.symbol +
              " " +
              parsedOption.strike +
              " " +
              options[indice + 1].symbol
            : options[indice + 1].symbol +
              " " +
              parsedOption.strike +
              " " +
              parsedOption.symbol;
        const [callSymbol, strike, putSymbol] = strikeWithSymbols.split(" ");

        let value = parsedType === "CALL" ? callSymbol : putSymbol;

        symbolList.push(
          <Select.Option
            key={Math.random()}
            value={value}
            className="optionInputCodigo"
          >
            {strikeWithSymbols}
          </Select.Option>,
        );
      }
    });
  else {
    options.forEach((option) => {
      symbolList.push(
        <Select.Option
          key={Math.random()}
          value={option.symbol}
          className="optionInputCodigo"
        >
          {option.symbol}
        </Select.Option>,
      );
    });
  }

  return symbolList;
};

const getQuote = (multilegQuotes: MultilegQuote[], offer: MultilegOffer) => {
  const quote = findMultilegQuote({
    multilegQuotes,
    symbol: offer.codigoSelecionado,
  });

  if (quote) return formatarNumDecimal(quote);
  return "";
};