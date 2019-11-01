import React from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { ReactComponent as ArrowDown } from "img/down-arrow.svg";
import { ReactComponent as ArrowUp } from "img/up-arrow.svg";
import { MDBIcon } from "mdbreact";
import TabelaMultileg from "components/forms/multileg_/TabelaMultileg";
import { connect } from "react-redux";
import {
  modificarAtributoAbaAction,
  adicionarOfertaTabelaAction,
  atualizarBookAction
} from "components/redux/actions/menu_actions/MultilegActions";
import {
  formatarNumDecimal,
  formatarVencimento
} from "components/utils/Formatacoes";
import { pesquisarAtivoMultilegAction } from "components/redux/actions/api_actions/MenuAPIAction";
import Book from "components/forms/multileg_/Book";
import { Dropdown } from "semantic-ui-react";

class AbaMultileg extends React.Component {
  render() {
    const indice = this.props.indice;
    return (
      <div className="containerAbaMultileg">
        <div>
          <div className="divDetalhesAbaMultileg">
            <div className="divColunaDetalhes">
              <InputGroup>
                <Form.Control
                  className="inputAtivo"
                  type="text"
                  value={this.props.multileg[indice].ativo}
                  onChange={event =>
                    this.props.modificarAtributoAbaAction(
                      this.props.multileg,
                      indice,
                      "ativo",
                      event.target.value
                    )
                  }
                />
                <InputGroup.Append className="inputAtivoAppend">
                  <span
                    className="input-group-text iconeProcurar divClicavel"
                    onClick={() => {
                      this.props.pesquisarAtivoMultilegAction(
                        this.props,
                        indice
                      );
                    }}
                  >
                    <MDBIcon icon="search" />
                  </span>
                </InputGroup.Append>
              </InputGroup>

              <h5 className="textoValor">
                {formatarNumDecimal(this.props.multileg[indice].valor)}
              </h5>
              {renderSeta(this.props.multileg[indice].variacao)}
              {renderValorPorcentagem(this.props.multileg[indice].variacao)}
            </div>
            <div className="divColunaDetalhes">
              <Form.Group>
                <Form.Label>Strike</Form.Label>{" "}
                {/* <Select
                  noOptionsMessage={() => ""}
                  placeholder=""
                  options={renderSerie(this.props)}
                  styles={inputSelect}
                /> */}
                <Dropdown
                  search
                  fluid
                  selection
                  options={renderSerie(this.props)}
                  value={this.props.multileg[indice].strikeSelecionado}
                  onChange={(event, data) => {
                    console.log(data);
                    this.props.modificarAtributoAbaAction(
                      this.props.multileg,
                      indice,
                      "strikeSelecionado",
                      Number(data.value)
                    );
                  }}
                />
              </Form.Group>
              {/* <Form.Group>
                <Form.Label>Strike</Form.Label>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.multileg[indice].strikeSelecionado}
                  onChange={event =>
                    this.props.modificarAtributoAbaAction(
                      this.props.multileg,
                      indice,
                      "strikeSelecionado",
                      Number(event.currentTarget.value)
                    )
                  }
                >
                  {this.props.multileg[indice].opcoes.map((item, index) =>
                    renderStrikeSymbol(
                      item,
                      index,
                      this.props.multileg[indice].opcoes
                    )
                  )}
                </Form.Control>
              </Form.Group> */}
              <Form.Group className="wrapperVencimento ml-1">
                <Form.Label>Vencimento</Form.Label>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.multileg[indice].vencimentoSelecionado}
                  onChange={event =>
                    this.props.modificarAtributoAbaAction(
                      this.props.multileg,
                      indice,
                      "vencimentoSelecionado",
                      event.currentTarget.value
                    )
                  }
                >
                  {this.props.multileg[indice].vencimento.map(
                    (vencimento, indice) => (
                      <option key={vencimento + indice} value={vencimento}>
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
                <div className="botoesIncluir">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      this.props.adicionarOfertaTabelaAction(
                        this.props,
                        "acao"
                      );
                    }}
                  >
                    +Ativo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      this.props.adicionarOfertaTabelaAction(
                        this.props,
                        "call"
                      );
                    }}
                  >
                    +Call
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      this.props.adicionarOfertaTabelaAction(this.props, "put");
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

const mapStateToProps = state => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  eventSource: state.multilegReducer.eventSource,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao
});

export default connect(
  mapStateToProps,
  {
    modificarAtributoAbaAction,
    pesquisarAtivoMultilegAction,
    adicionarOfertaTabelaAction,
    atualizarBookAction
  }
)(AbaMultileg);

const renderSeta = valor => {
  valor = Number(valor);
  if (valor > 0) return <ArrowUp fill="#138342" className="mr-1" width="35" />;
  else if (valor < 0)
    return <ArrowDown fill="red" className="mr-1" width="35" />;
};

const renderValorPorcentagem = porcentagem => {
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

const renderSerie = props => {
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
  if (indice % 2 === 0)
    return {
      text:
        item.type === "CALL"
          ? item.symbol +
            " " +
            item.strike +
            " " +
            listaOpcoes[indice + 1].symbol
          : listaOpcoes[indice + 1].symbol +
            " " +
            item.strike +
            " " +
            item.symbol,
      value: item.strike
    };
};

{
  /* <option key={indice} value={item.strike}>
{item.type === "CALL"
  ? item.symbol +
    " " +
    item.strike +
    " " +
    listaOpcoes[indice + 1].symbol
  : listaOpcoes[indice + 1].symbol +
    " " +
    item.strike +
    " " +
    item.symbol}
</option> */
}

const inputSelect = {
  option: (provided, state) => ({
    ...provided,
    color: "#ddd",
    fontSize: "0.7rem",
    padding: "1px 8px"
  }),
  control: provided => ({
    ...provided,
    width: 185,
    color: "blue",
    backgroundColor: "#333",
    borderColor: "#333",
    minHeight: 17,
    height: 17
  }),
  container: provided => ({
    ...provided,
    minHeight: 17,
    height: 17
  }),
  input: provided => ({
    ...provided,
    minHeight: 17,
    height: 17
  }),
  singleValue: provided => ({
    ...provided,
    color: "#ddd",
    top: "80%",
    marginLeft: "0",
    marginRight: "0"
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#333"
  }),
  menuList: provided => ({
    ...provided,
    backgroundColor: "#333",
    borderColor: "#333",
    borderRadius: 5
  }),
  valueContainer: provided => ({
    ...provided,
    minHeight: 17,
    height: 17,
    fontSize: "0.7rem"
  }),
  indicatorsContainer: provided => ({
    ...provided,
    minHeight: 15,
    height: 13
  })
};
