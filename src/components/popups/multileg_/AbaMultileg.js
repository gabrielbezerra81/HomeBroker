import React from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
// @ts-ignore
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { MDBIcon } from "mdbreact";
import TabelaMultileg from "components/popups/multileg_/TabelaMultileg";
import { connect } from "react-redux";
import {
  modificarAtributoAbaAction,
  adicionarOfertaTabelaAction,
  buscaCotacao,
} from "redux/actions/menu_actions/MultilegActions";
import {
  formatarNumDecimal,
  formatarVencimento,
} from "components/utils/Formatacoes";
import { pesquisarAtivoMultilegAction } from "redux/actions/api_actions/MultilegAPIAction";
import Book from "components/popups/multileg_/Book";
import { Select } from "antd";
import { StorePrincipalContext } from "redux/StoreCreation";

class AbaMultileg extends React.Component {
  render() {
    const { props } = this;
    const { indice, pesquisandoAtivo } = props;
    const arrayStrike = renderSerie(props);

    const cotacao = buscaCotacao(
      props.cotacoesMultileg,
      props.multileg[indice].ativo
    );
    return (
      <div className="containerAbaMultileg">
        <div>
          <div className="divDetalhesAbaMultileg">
            <div className="divColunaDetalhes">
              <InputGroup className="inputGroupPesquisaMultileg">
                <Form.Control
                  className="inputAtivo"
                  type="text"
                  value={props.multileg[indice].ativo}
                  onChange={(event) =>
                    props.modificarAtributoAbaAction(
                      props.multileg,
                      indice,
                      "ativo",
                      event.target.value
                    )
                  }
                  onKeyPress={(event) => {
                    //event.preventDefault();
                    if (event.key === "Enter")
                      props.pesquisarAtivoMultilegAction(props, indice);
                  }}
                />
                <InputGroup.Append className="inputAtivoAppend">
                  <span
                    className="input-group-text iconeProcurar divClicavel"
                    onClick={() => {
                      props.pesquisarAtivoMultilegAction(props, indice);
                    }}
                  >
                    {pesquisandoAtivo ? (
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
                    props.modificarAtributoAbaAction(
                      props.multileg,
                      indice,
                      "strikeSelecionado",
                      value
                    );
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
                    props.modificarAtributoAbaAction(
                      props.multileg,
                      indice,
                      "vencimentoSelecionado",
                      event.currentTarget.value,
                      props
                    )
                  }
                >
                  {props.multileg[indice].vencimento.map(
                    (vencimento, indice) => (
                      <option
                        key={vencimento + indice + Math.random()}
                        value={vencimento}
                      >
                        {formatarVencimento(vencimento)}
                      </option>
                    )
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
                      props.adicionarOfertaTabelaAction(props, "acao");
                    }}
                  >
                    +Ativo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      props.adicionarOfertaTabelaAction(props, "call");
                    }}
                  >
                    +Call
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      props.adicionarOfertaTabelaAction(props, "put");
                    }}
                  >
                    +Put
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <TabelaMultileg indice={indice}></TabelaMultileg>
        </div>
        <Book indice={indice}></Book>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao,
  cotacoesMultileg: state.multilegReducer.cotacoesMultileg,
  pesquisandoAtivo: state.multilegReducer.pesquisandoAtivo,
  setIntervalCotacoesMultileg:
    state.multilegReducer.setIntervalCotacoesMultileg,
  cotacoesMultilegID: state.multilegReducer.cotacoesMultilegID,
});

export default connect(
  mapStateToProps,
  {
    modificarAtributoAbaAction,
    pesquisarAtivoMultilegAction,
    adicionarOfertaTabelaAction,
  },
  null,
  { context: StorePrincipalContext }
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
    let strikeSymbol = renderStrikeSymbol(
      item,
      index,
      props.multileg[indice].opcoes
    );
    if (strikeSymbol) listaSerie.push(strikeSymbol);
  });

  return listaSerie;
};

const renderStrikeSymbol = (item, indice, listaOpcoes) => {
  if (indice % 2 === 0) {
    const texto =
      item.type === "CALL"
        ? item.symbol + " " + item.strike + " " + listaOpcoes[indice + 1].symbol
        : listaOpcoes[indice + 1].symbol +
          " " +
          item.strike +
          " " +
          item.symbol;

    return (
      <Select.Option
        className="optionInputCodigo"
        key={Math.random()}
        value={item.strike}
      >
        {texto}
      </Select.Option>
    );
  }
};
