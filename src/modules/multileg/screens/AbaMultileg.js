import React from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "assets/down-arrow.svg";
// @ts-ignore
import { ReactComponent as ArrowUp } from "assets/up-arrow.svg";
import { MDBIcon } from "mdbreact";
import TabelaMultileg from "./TabelaMultileg";
import { connect } from "react-redux";
import {
  updateMultilegTabAction,
  addMultilegOfferAction,
} from "../duck/actions/MultilegActions";
import { findMultilegQuote } from "../duck/actions/utils";
import { formatarNumDecimal, formatExpiration } from "shared/utils/Formatacoes";
import { searchMultilegSymbolAPIAction } from "../duck/actions/MultilegAPIAction";
import Book from "./Book/Book";
import { Select } from "antd";
import { StorePrincipalContext } from "redux/StoreCreation";

import MultilegGraph from "./MultilegGraph";

class AbaMultileg extends React.Component {
  constructor(props) {
    super();

    this.state = {
      searchingAPI: false,
    };

    this.searchMultilegSymbol = this.searchMultilegSymbol.bind(this);
  }

  async searchMultilegSymbol() {
    this.setState({ searchingAPI: true });

    const tabIndex = this.props.indice;

    await this.props.searchMultilegSymbolAPIAction(tabIndex);

    this.setState({ searchingAPI: false });
  }

  render() {
    const { props } = this;
    const { indice } = props;
    const arrayStrike = renderSerie(props);

    const cotacao = findMultilegQuote({
      multilegQuotes: props.cotacoesMultileg,
      symbol: props.multileg[indice].ativo,
    });

    return (
      <div className="containerAbaMultileg">
        <div>
          <div className="divDetalhesAbaMultileg">
            <div className="divColunaDetalhes">
              <InputGroup className="inputGroupPesquisaMultileg">
                <Form.Control
                  className="inputWithSearchIcon"
                  type="text"
                  value={props.multileg[indice].ativo}
                  onChange={(event) => {
                    props.updateMultilegTabAction({
                      tabIndex: indice,
                      attributeName: "ativo",
                      attributeValue: event.target.value,
                    });
                  }}
                  onKeyPress={(event) => {
                    //event.preventDefault();
                    if (event.key === "Enter") {
                      this.searchMultilegSymbol();
                    }
                  }}
                />
                <InputGroup.Append>
                  <span
                    className="input-group-text appendedSearchIcon divClicavel"
                    onClick={this.searchMultilegSymbol}
                  >
                    {this.state.searchingAPI ? (
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
              {renderSeta(props.multileg[indice].variacao)}
              {renderValorPorcentagem(props.multileg[indice].variacao)}
            </div>
            <div className="divColunaDetalhes">
              <Form.Group className="inputGroupStrike">
                <Form.Label>Strike</Form.Label>
                <Select
                  dropdownClassName="inputCodigoDropdown"
                  size="small"
                  value={props.multileg[indice].strikeSelecionado}
                  showSearch
                  optionFilterProp="children"
                  notFoundContent={
                    arrayStrike.length > 0
                      ? "Código não encontrado"
                      : "Pesquise um ativo"
                  }
                  className="inputCodigo"
                  suffixIcon={<MDBIcon icon="caret-down" />}
                  onChange={(value) => {
                    props.updateMultilegTabAction({
                      tabIndex: indice,
                      attributeName: "strikeSelecionado",
                      attributeValue: value,
                    });
                  }}
                >
                  {arrayStrike}
                </Select>
              </Form.Group>

              <Form.Group className="wrapperVencimento ml-1">
                <Form.Label>Vencimento</Form.Label>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={props.multileg[indice].vencimentoSelecionado}
                  onChange={(event) =>
                    props.updateMultilegTabAction({
                      tabIndex: indice,
                      attributeName: "vencimentoSelecionado",
                      attributeValue: event.currentTarget.value,
                    })
                  }
                >
                  {props.multileg[indice].vencimento.map(
                    (vencimento, indice) => (
                      <option
                        key={vencimento + indice + Math.random()}
                        value={vencimento}
                      >
                        {formatExpiration(vencimento)}
                      </option>
                    ),
                  )}
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
                      props.addMultilegOfferAction({
                        tabIndex: props.indice,
                        offerType: "acao",
                      });
                    }}
                  >
                    +Ativo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      props.addMultilegOfferAction({
                        tabIndex: props.indice,
                        offerType: "call",
                      });
                    }}
                  >
                    +Call
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      props.addMultilegOfferAction({
                        tabIndex: props.indice,
                        offerType: "put",
                      });
                    }}
                  >
                    +Put
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <TabelaMultileg indice={indice}></TabelaMultileg>

          <MultilegGraph tabIndex={indice} />
        </div>
        <Book indice={indice}></Book>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  cotacoesMultileg: state.multilegReducer.cotacoesMultileg,
  cotacoesMultilegID: state.multilegReducer.cotacoesMultilegID,
});

export default connect(
  mapStateToProps,
  {
    updateMultilegTabAction,
    searchMultilegSymbolAPIAction,
    addMultilegOfferAction,
  },
  null,
  { context: StorePrincipalContext },
)(AbaMultileg);

const renderSeta = (valor) => {
  valor = Number(valor);
  if (valor > 0) return <ArrowUp fill="#138342" className="mr-1" width="35" />;
  else if (valor < 0)
    return <ArrowDown fill="red" className="mr-1" width="35" />;
};

const renderValorPorcentagem = (porcentagem) => {
  if (porcentagem > 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <h6 className="porcentagemPositiva">+{porcentagem}%</h6>;
  } else if (porcentagem < 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <h6 className="porcentagemNegativa">{porcentagem}%</h6>;
  } else {
    porcentagem = formatarNumDecimal(porcentagem);
    return <h6>+{porcentagem}%</h6>;
  }
};

const renderSerie = (props) => {
  const { indice } = props;
  let listaSerie = [];

  props.multileg[indice].opcoes.forEach((item, index) => {
    if (index % 2 === 0) {
      let strikeSymbol = renderStrikeSymbol(
        item,
        index,
        props.multileg[indice].opcoes,
      );

      listaSerie.push(strikeSymbol);
    }
  });

  return listaSerie;
};

const renderStrikeSymbol = (item, indice, listaOpcoes) => {
  const texto =
    item.type === "CALL"
      ? item.symbol + " " + item.strike + " " + listaOpcoes[indice + 1].symbol
      : listaOpcoes[indice + 1].symbol + " " + item.strike + " " + item.symbol;

  return (
    <Select.Option
      className="optionInputCodigo"
      key={Math.random()}
      value={item.strike}
    >
      {texto}
    </Select.Option>
  );
};
