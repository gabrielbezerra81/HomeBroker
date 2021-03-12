import React, { useState, useMemo, useCallback } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "assets/down-arrow.svg";
// @ts-ignore
import { ReactComponent as ArrowUp } from "assets/up-arrow.svg";
import { MDBIcon } from "mdbreact";
import TabelaMultileg from "./TabelaMultileg";
import {
  cond_updateMultilegTabAction,
  cond_addMultilegOfferAction,
} from "../duck/actions/ConditionalMultilegActions";
import { cond_findMultilegQuote } from "../duck/actions/utils";
import { formatarNumDecimal, formatExpiration } from "shared/utils/Formatacoes";
import { cond_searchMultilegSymbolAPIAction } from "../duck/actions/ConditionalMultilegAPIAction";
import Book from "./Book/Book";
import { Select } from "antd";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  ConditionalMultilegOption,
  ConditionalMultilegTab as CondMultilegTabType,
} from "../types/conditionalMultileg";

interface Props {
  tabIndex: number;
  tabTitle: string;
  titleColor: string;
}

const ConditionalMultilegTab: React.FC<Props> = ({
  tabIndex,
  tabTitle,
  titleColor,
}) => {
  const {
    conditionalMultilegReducer: {
      multileg,
      cotacoesMultileg,
      cotacoesMultilegID,
      configComplementarAberto,
    },
  } = useStateStorePrincipal();

  const tab = useMemo(() => {
    return multileg[tabIndex];
  }, [multileg, tabIndex]);

  const dispatch = useDispatchStorePrincipal();

  const [searchingAPI, setSearchingAPI] = useState(false);

  const cotacao = useMemo(() => {
    return cond_findMultilegQuote({
      multilegQuotes: cotacoesMultileg,
      symbol: tab.ativo,
    });
  }, [cotacoesMultileg, tab.ativo]);

  const searchMultilegSymbol = useCallback(async () => {
    setSearchingAPI(true);

    await dispatch(cond_searchMultilegSymbolAPIAction(tabIndex));

    setSearchingAPI(false);
  }, [dispatch, tabIndex]);

  const strikeOptions = useMemo(() => {
    return getStrikeOptions({ multilegTabs: multileg, tabIndex });
  }, [multileg, tabIndex]);

  return (
    <div className="containerAbaMultileg">
      <div style={{ backgroundColor: titleColor }} className="sectionTitle">
        {tabTitle}
      </div>
      <div className="tabMainContent">
        <div className="divDetalhesAbaMultileg">
          <div className="divColunaDetalhes">
            <InputGroup className="inputGroupPesquisaMultileg">
              <Form.Control
                className="inputWithSearchIcon"
                type="text"
                value={tab.ativo}
                onChange={(event) => {
                  dispatch(
                    cond_updateMultilegTabAction({
                      tabIndex,
                      attributeName: "ativo",
                      attributeValue: event.target.value,
                    }),
                  );
                }}
                onKeyPress={(event: any) => {
                  //event.preventDefault();
                  if (event.key === "Enter") {
                    searchMultilegSymbol();
                  }
                }}
              />
              <InputGroup.Append>
                <span
                  className="input-group-text appendedSearchIcon divClicavel"
                  onClick={searchMultilegSymbol}
                >
                  {searchingAPI ? (
                    <Spinner animation="border" variant="light" size="sm" />
                  ) : (
                    <MDBIcon icon="search" />
                  )}
                </span>
              </InputGroup.Append>
            </InputGroup>

            <h5 className="textoValor">
              {cotacao ? formatarNumDecimal(cotacao) : "0,00"}
            </h5>
            <OscilationArrow oscilation={tab.variacao} />
            <Oscilation oscilation={tab.variacao} />
          </div>
          <div className="divColunaDetalhes">
            <Form.Group className="inputGroupStrike">
              <Form.Label>Strike</Form.Label>
              <Select
                dropdownClassName="inputCodigoDropdown"
                size="small"
                value={tab.strikeSelecionado}
                showSearch
                optionFilterProp="children"
                notFoundContent={
                  strikeOptions.length > 0
                    ? "Código não encontrado"
                    : "Pesquise um ativo"
                }
                className="inputCodigo"
                suffixIcon={<MDBIcon icon="caret-down" />}
                onChange={(value: number) => {
                  dispatch(
                    cond_updateMultilegTabAction({
                      tabIndex,
                      attributeName: "strikeSelecionado",
                      attributeValue: value,
                    }),
                  );
                }}
              >
                {strikeOptions}
              </Select>
            </Form.Group>

            <Form.Group className="wrapperVencimento ml-1">
              <Form.Label>Vencimento</Form.Label>
              <Form.Control
                as="select"
                className="textInput"
                value={tab.vencimentoSelecionado}
                onChange={(event) => {
                  dispatch(
                    cond_updateMultilegTabAction({
                      tabIndex,
                      attributeName: "vencimentoSelecionado",
                      attributeValue: event.currentTarget.value,
                    }),
                  );
                }}
              >
                {tab.vencimento.map((vencimento, indice) => (
                  <option
                    key={vencimento + indice + Math.random()}
                    value={vencimento}
                  >
                    {formatExpiration(vencimento)}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="divColunaDetalhes">
            <div className="divFlexRowDetalhesAba">
              <Form.Label>Incluir</Form.Label>
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      cond_addMultilegOfferAction({
                        tabIndex,
                        offerType: "acao",
                      }),
                    );
                  }}
                >
                  +Ativo
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      cond_addMultilegOfferAction({
                        tabIndex,
                        offerType: "call",
                      }),
                    );
                  }}
                >
                  +Call
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      cond_addMultilegOfferAction({
                        tabIndex,
                        offerType: "put",
                      }),
                    );
                  }}
                >
                  +Put
                </Button>
              </div>
            </div>
          </div>
        </div>
        <TabelaMultileg indice={tabIndex}></TabelaMultileg>
      </div>
      <Book indice={tabIndex}></Book>
    </div>
  );
};

export default ConditionalMultilegTab;

const OscilationArrow = ({ oscilation }: { oscilation: number }) => {
  if (oscilation > 0) {
    return <ArrowUp fill="#138342" className="mr-1" width="35" />;
  } //
  else if (oscilation < 0) {
    return <ArrowDown fill="red" className="mr-1" width="35" />;
  }

  return null;
};

const Oscilation = ({ oscilation }: { oscilation: number }) => {
  let formattedOscilation = "";

  if (oscilation > 0) {
    formattedOscilation = formatarNumDecimal(oscilation);
    return <h6 className="porcentagemPositiva">+{formattedOscilation}%</h6>;
  } else if (oscilation < 0) {
    formattedOscilation = formatarNumDecimal(oscilation);
    return <h6 className="porcentagemNegativa">{formattedOscilation}%</h6>;
  } else {
    formattedOscilation = formatarNumDecimal(oscilation);
    return <h6>+{formattedOscilation}%</h6>;
  }
};

interface GetStrikeOptions {
  tabIndex: number;
  multilegTabs: Array<CondMultilegTabType>;
}

const getStrikeOptions = ({ tabIndex, multilegTabs }: GetStrikeOptions) => {
  let options: JSX.Element[] = [];

  multilegTabs[tabIndex].opcoes.forEach((item, optionIndex) => {
    if (optionIndex % 2 === 0) {
      let strikeSymbol = renderOption({
        optionIndex,
        options: multilegTabs[tabIndex].opcoes,
      });

      options.push(strikeSymbol);
    }
  });

  return options;
};

interface RenderOption {
  optionIndex: number;
  options: Array<ConditionalMultilegOption>;
}

const renderOption = ({ options, optionIndex }: RenderOption) => {
  const currentOption = options[optionIndex];

  const formattedStrike = formatarNumDecimal(currentOption.strike, 2, 2);

  const label =
    currentOption.type === "CALL"
      ? currentOption.symbol +
        " " +
        formattedStrike +
        " " +
        options[optionIndex + 1].symbol
      : options[optionIndex + 1].symbol +
        " " +
        formattedStrike +
        " " +
        currentOption.symbol;

  return (
    <Select.Option
      className="optionInputCodigo"
      key={Math.random()}
      value={currentOption.strike}
    >
      {label}
    </Select.Option>
  );
};
