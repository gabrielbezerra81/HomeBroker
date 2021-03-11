import React, { useState, useMemo } from "react";
import { Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Select } from "antd";

import CustomInput from "shared/components/CustomInput";
import {
  cond_findMultilegQuote,
  cond_findMultilegBook,
} from "../duck/actions/utils";
import { formatarNumDecimal, formatExpiration } from "shared/utils/Formatacoes";
import modelEUImage from "assets/modeloEU.png";
import modelUSAImage from "assets/modeloUSA2.svg";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  ConditionalMultilegQuote,
  ConditionalMultilegOffer,
  ConditionalMultilegOption,
} from "../types/conditionalMultileg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  cond_removeMultilegOfferAction,
  cond_updateMultilegOfferAction,
} from "../duck/actions/ConditionalMultilegActions";
import { FiX } from "react-icons/fi";

interface MultilegOfferProps {
  lineIndex: number;
  tabIndex: number;
  offer: ConditionalMultilegOffer;
}

const MultilegOfferItem: React.FC<MultilegOfferProps> = ({
  lineIndex,
  tabIndex,
  offer,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    conditionalMultilegReducer: { cotacoesMultileg, multileg },
  } = useStateStorePrincipal();

  const [isOpenCodeDropdown, setIsOpenCodeDropdown] = useState(false);

  const quote = getQuote(cotacoesMultileg, offer);

  const { offerValue, highlightLast } = useMemo(() => {
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
          const parsedOption = option as ConditionalMultilegOption;
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

  const isOption = useMemo(() => {
    return offer.ativoAtual !== offer.codigoSelecionado;
  }, [offer.ativoAtual, offer.codigoSelecionado]);

  const qttyInputConfig = useMemo(() => {
    const config = {
      step: 100,
      type: "quantidade",
    };

    if (multileg[tabIndex].market === "Forex") {
      config.step = 0.01;
      config.type = "preco";
    }

    return config;
  }, [multileg, tabIndex]);

  return (
    <tr key={lineIndex} id={`ofertaMultileg${lineIndex}`}>
      <td
        className="divClicavel closeColumn"
        onClick={() =>
          dispatch(
            cond_removeMultilegOfferAction({
              tabIndex,
              lineIndex,
            }),
          )
        }
      >
        <FiX size={12} strokeWidth={3} color="#666" />
      </td>
      <td>
        <CV offerCV={offer.cv} lineIndex={lineIndex} tabIndex={tabIndex} />
      </td>
      <td className="qtdeColumn">
        <Form.Group>
          <CustomInput
            type={qttyInputConfig.type as any}
            step={qttyInputConfig.step}
            autoSelect
            value={offer.qtde}
            onChange={(value: any) =>
              dispatch(
                cond_updateMultilegOfferAction({
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
                cond_updateMultilegOfferAction({
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
                {formatExpiration(serie)}
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
                cond_updateMultilegOfferAction({
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
              cond_updateMultilegOfferAction({
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
        {isOption && (
          <div
            className="divClicavel"
            tabIndex={0}
            onClick={() =>
              dispatch(
                cond_updateMultilegOfferAction({
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
        )}
      </td>
      <td>{isOption && <Model model={offer.modelo} />}</td>
      <td>
        <Form.Group>
          <CustomInput
            type="quantidade"
            step={100}
            value={offer.despernamento}
            onChange={(value: any) =>
              dispatch(
                cond_updateMultilegOfferAction({
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
                cond_updateMultilegOfferAction({
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
      <td className="">
        <span className={highlightLast ? "neutralBorderColor" : ""}>
          {quote}
        </span>
      </td>
      <td>
        <span style={{ color: offer.cv === "compra" ? "#a5746b" : "#098fc7" }}>
          {offerValue}
        </span>
      </td>
    </tr>
  );
};

export default MultilegOfferItem;

const calculateOfferValue = (
  multilegQuotes: ConditionalMultilegQuote[],
  offer: ConditionalMultilegOffer,
) => {
  let value;
  let highlightLast = false;
  const book = cond_findMultilegBook({
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
    highlightLast = true;
  }

  return {
    offerValue: formatarNumDecimal(offer.qtde * value),
    highlightLast,
  };
};

interface CVProps {
  offerCV: ConditionalMultilegOffer["cv"];
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
            cond_updateMultilegOfferAction({
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
            cond_updateMultilegOfferAction({
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
  model: ConditionalMultilegOffer["modelo"];
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
  options: ConditionalMultilegOffer["opcoes"];
  type: ConditionalMultilegOffer["tipo"];
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
  else if (isDropdownOpen) {
    options.forEach((option, indice) => {
      const parsedOption = option as ConditionalMultilegOption;
      if (indice % 2 === 0) {
        const formattedStrike = formatarNumDecimal(parsedOption.strike, 2, 2);

        let strikeWithSymbols =
          parsedOption.type === "CALL"
            ? parsedOption.symbol +
              " " +
              formattedStrike +
              " " +
              options[indice + 1].symbol
            : options[indice + 1].symbol +
              " " +
              formattedStrike +
              " " +
              parsedOption.symbol;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  } else {
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

const getQuote = (
  multilegQuotes: ConditionalMultilegQuote[],
  offer: ConditionalMultilegOffer,
) => {
  const quote = cond_findMultilegQuote({
    multilegQuotes,
    symbol: offer.codigoSelecionado,
  });

  if (quote) return formatarNumDecimal(quote);
  return "";
};
