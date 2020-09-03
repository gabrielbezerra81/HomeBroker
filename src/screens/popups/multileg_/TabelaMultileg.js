import React from "react";
import { Table, Form } from "react-bootstrap";
import imgModeloEU from "assets/modeloEU.png";
import imgModeloUSA from "assets/modeloUSA2.svg";
import { connect } from "react-redux";
import {
  updateMultilegOfferAction,
  removeMultilegOfferAction,
} from "redux/actions/multileg/MultilegActions";
import {
  findMultilegQuote,
  findMultilegBook,
} from "redux/actions/multileg/utils";
import { MDBIcon } from "mdbreact";
import {
  formatarNumDecimal,
  formatarVencimento,
} from "shared/utils/Formatacoes";
import InputFormatado from "shared/componentes/InputFormatado";
import { Select } from "antd";
import { StorePrincipalContext } from "redux/StoreCreation";

class TabelaMultileg extends React.Component {
  componentDidUpdate(prevProps) {
    const { props } = this;
    const indiceAba = props.indice;

    const currentLength = props.multileg[indiceAba].tabelaMultileg.length;

    if (
      prevProps.multileg[indiceAba].tabelaMultileg.length !== currentLength &&
      currentLength
    ) {
      const indiceLinha = currentLength - 1;
      const linha = document.getElementById("ofertaMultileg" + indiceLinha);
      const input = linha.children[2].getElementsByTagName("input");
      input[0].select();
    }
  }

  render() {
    const { props } = this;
    const indiceAba = props.indice;

    return (
      <Table
        variant="dark"
        bordered={false}
        borderless
        striped
        className="tableMultileg text-center"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th></th>
            <th>C/V</th>
            <th>Qtde.</th>
            <th>Série</th>
            <th>Strike</th>
            <th>Código</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Despernamento Máx.</th>
            <th>Prioridade de Execução</th>
            <th>Ult.Neg.</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {props.multileg[props.indice].tabelaMultileg.map(
            (item, indiceLinha) => {
              const cotacao = renderCotacao(props, item);
              return (
                <tr key={indiceLinha} id={`ofertaMultileg${indiceLinha}`}>
                  <td
                    className="divClicavel"
                    onClick={() =>
                      props.removeMultilegOfferAction({
                        tabIndex: indiceAba,
                        lineIndex: indiceLinha,
                      })
                    }
                  >
                    <MDBIcon icon="times" className="saldoOpNegativo" />
                  </td>
                  {renderCV(item.cv, props, indiceLinha)}
                  <td>
                    <Form.Group>
                      <InputFormatado
                        name="qtde"
                        tipoInput="quantidade"
                        step={100}
                        autoSelect
                        value={item.qtde}
                        onChange={(value) =>
                          props.updateMultilegOfferAction({
                            tabIndex: indiceAba,
                            attributeName: "qtde",
                            attributeValue: value,
                            lineIndex: indiceLinha,
                          })
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
                        value={item.serieSelecionada}
                        onChange={(event) =>
                          props.updateMultilegOfferAction({
                            tabIndex: indiceAba,
                            attributeName: "serieSelecionada",
                            attributeValue: event.currentTarget.value,
                            lineIndex: indiceLinha,
                          })
                        }
                      >
                        {item.serie.map((serie, indice) => (
                          <option key={serie + indice} value={serie}>
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
                        value={item.strikeSelecionado}
                        onChange={(event) =>
                          props.updateMultilegOfferAction({
                            tabIndex: indiceAba,
                            attributeName: "strikeSelecionado",
                            attributeValue: Number(event.currentTarget.value),
                            lineIndex: indiceLinha,
                          })
                        }
                      >
                        {item.opcoes.map((itemStrike, indice) => {
                          if (item.tipo && indice % 2 === 0)
                            return (
                              <option key={indice} value={itemStrike.strike}>
                                {itemStrike.strike}
                              </option>
                            );
                          return null;
                        })}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>
                    <Select
                      size="small"
                      dropdownClassName="inputCodigoDropdown"
                      value={item.codigoSelecionado}
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="Código não encontrado"
                      className="inputCodigo"
                      suffixIcon={<MDBIcon icon="caret-down" />}
                      onChange={(value) => {
                        props.updateMultilegOfferAction({
                          tabIndex: indiceAba,
                          attributeName: "codigoSelecionado",
                          attributeValue: value,
                          lineIndex: indiceLinha,
                        });
                      }}
                      onDropdownVisibleChange={(open) => {
                        props.updateMultilegOfferAction({
                          tabIndex: indiceAba,
                          attributeName: "codigoAberto",
                          attributeValue: open,
                          lineIndex: indiceLinha,
                        });
                      }}
                    >
                      {renderCodigoOferta(
                        item.opcoes,
                        props.multileg[indiceAba].tabelaMultileg[indiceLinha]
                          .codigoAberto,
                        item.tipo.toUpperCase(),
                        item,
                      )}
                    </Select>
                  </td>
                  <td>
                    <div
                      className="divClicavel"
                      tabIndex={0}
                      onClick={(event) =>
                        props.updateMultilegOfferAction({
                          tabIndex: indiceAba,
                          attributeName: "tipo",
                          attributeValue: item.tipo,
                          lineIndex: indiceLinha,
                        })
                      }
                    >
                      {item.tipo.toUpperCase()}
                    </div>
                  </td>
                  <td>{renderModelo(item.modelo)}</td>
                  <td>
                    <Form.Group>
                      <InputFormatado
                        name="qtde"
                        tipoInput="quantidade"
                        step={100}
                        value={item.despernamento}
                        onChange={(value) =>
                          props.updateMultilegOfferAction({
                            tabIndex: indiceAba,
                            attributeName: "despernamento",
                            attributeValue: value,
                            lineIndex: indiceLinha,
                          })
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
                        value={item.prioridade}
                        onChange={(event) => {
                          props.updateMultilegOfferAction({
                            tabIndex: indiceAba,
                            attributeName: "prioridade",
                            attributeValue: Number(event.currentTarget.value),
                            lineIndex: indiceLinha,
                          });
                        }}

                        //value={item.prioridade}
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
                  <td>{cotacao}</td>
                  <td>{calculaColunaValor(props, item)}</td>
                </tr>
              );
            },
          )}
        </tbody>
      </Table>
    );
  }
}

const calculaColunaValor = (props, oferta) => {
  let value;
  const book = findMultilegBook({
    multilegQuotes: props.cotacoesMultileg,
    symbol: oferta.codigoSelecionado,
  });
  if (oferta.cv === "compra" && book && book.venda.price) {
    value = book.venda.price;
  } //
  else if (oferta.cv === "venda" && book && book.compra.price) {
    value = book.compra.price;
  } //
  else {
    const cotacao = renderCotacao(props, oferta);
    value = Number(cotacao.replace(",", "."));
  }

  return formatarNumDecimal(oferta.qtde * value);
};

const mapStateToProps = (state) => ({
  multileg: state.multilegReducer.multileg,
  cotacoesMultileg: state.multilegReducer.cotacoesMultileg,
  cotacoesMultilegID: state.multilegReducer.cotacoesMultilegID,
});

export default connect(
  mapStateToProps,
  {
    updateMultilegOfferAction,
    removeMultilegOfferAction,
  },
  null,
  { context: StorePrincipalContext },
)(TabelaMultileg);

const renderCV = (cv, props, indiceLinha) => {
  let cvCompra = "",
    cvVenda = "";
  if (cv === "compra") {
    cvCompra = "cvCompra";
  } else {
    cvVenda = "cvVenda";
  }

  return (
    <td>
      <div className="divCV">
        <h6
          className={`${cvCompra} divClicavel`}
          onClick={() =>
            props.updateMultilegOfferAction({
              tabIndex: props.indice,
              attributeName: "cv",
              attributeValue: "compra",
              lineIndex: indiceLinha,
            })
          }
        >
          C
        </h6>
        <h6
          className={`${cvVenda} divClicavel`}
          onClick={() =>
            props.updateMultilegOfferAction({
              tabIndex: props.indice,
              attributeName: "cv",
              attributeValue: "venda",
              lineIndex: indiceLinha,
            })
          }
        >
          V
        </h6>
      </div>
    </td>
  );
};

const renderModelo = (modelo) => {
  if (modelo === "EUROPEAN")
    return (
      <div>
        <img src={imgModeloEU} alt="" className="imgModelo" />
      </div>
    );
  else if (modelo === "AMERICAN")
    return (
      <div>
        <img src={imgModeloUSA} alt="" className="imgModelo" />
      </div>
    );
  else return null;
};

const renderCodigoOferta = (listaOpcoes, codigoAberto, tipoAtual, item) => {
  let listaCodigos = [];

  if (listaOpcoes.length === 1) {
    listaCodigos.push(
      <Select.Option
        key={Math.random()}
        value={listaOpcoes[0].symbol}
        className="optionInputCodigo"
      >
        {listaOpcoes[0].symbol}
      </Select.Option>,
    );
  } //
  else if (codigoAberto)
    listaOpcoes.forEach((opcao, indice) => {
      if (indice % 2 === 0) {
        let codigo =
          opcao.type === "CALL"
            ? opcao.symbol +
              " " +
              opcao.strike +
              " " +
              listaOpcoes[indice + 1].symbol
            : listaOpcoes[indice + 1].symbol +
              " " +
              opcao.strike +
              " " +
              opcao.symbol;
        const callPut = codigo.split(" ");

        let value = tipoAtual === "CALL" ? callPut[0] : callPut[2];

        listaCodigos.push(
          <Select.Option
            key={Math.random()}
            value={value}
            className="optionInputCodigo"
          >
            {codigo}
          </Select.Option>,
        );
      }
    });
  else {
    return listaOpcoes.map((opcao) => (
      <Select.Option
        key={Math.random()}
        value={opcao.symbol}
        className="optionInputCodigo"
      >
        {opcao.symbol}
      </Select.Option>
    ));
  }

  return listaCodigos;
};

const renderCotacao = (props, oferta) => {
  const cotacao = findMultilegQuote({
    multilegQuotes: props.cotacoesMultileg,
    symbol: oferta.codigoSelecionado,
  });

  if (cotacao) return formatarNumDecimal(cotacao);
  return "";
};
