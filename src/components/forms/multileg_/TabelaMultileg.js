import React from "react";
import { Table, Form } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA2.svg";
import { connect } from "react-redux";
import {
  modificarAtributoTabelaAbaAction,
  excluirOfertaTabelaAction
} from "components/redux/actions/menu_actions/MultilegActions";
import { MDBIcon } from "mdbreact";
import {
  formatarNumDecimal,
  formatarVencimento
} from "components/utils/Formatacoes";
import InputFormatado from "components/utils/InputFormatado";

class TabelaMultileg extends React.Component {
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
              return (
                <tr key={indiceLinha}>
                  <td
                    className="divClicavel"
                    onClick={() =>
                      props.excluirOfertaTabelaAction(
                        props,
                        indiceAba,
                        indiceLinha
                      )
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
                        onChange={valor =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "qtde",
                            valor,
                            indiceLinha
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
                        value={item.serieSelecionada}
                        onChange={event =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "serieSelecionada",
                            event.currentTarget.value,
                            indiceLinha
                          )
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
                        onChange={event =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "strikeSelecionado",
                            Number(event.currentTarget.value),
                            indiceLinha
                          )
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
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput inputCodigo"
                        value={item.codigoSelecionado}
                        onChange={e => {
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "codigoSelecionado",
                            e.currentTarget.value,
                            indiceLinha
                          );
                        }}
                        onFocus={() =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "codigoAberto",
                            true,
                            indiceLinha
                          )
                        }
                        onBlur={() =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "codigoAberto",
                            false,
                            indiceLinha
                          )
                        }
                      >
                        {renderCodigoOferta(
                          item.opcoes,
                          props.multileg[indiceAba].tabelaMultileg[indiceLinha]
                            .codigoAberto,
                          item.tipo.toUpperCase()
                        )}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>
                    <div
                      className="divClicavel"
                      tabIndex={0}
                      onClick={event =>
                        props.modificarAtributoTabelaAbaAction(
                          props,
                          indiceAba,
                          "tipo",
                          item.tipo,
                          indiceLinha
                        )
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
                        onChange={valor =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "despernamento",
                            valor,
                            indiceLinha
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
                        value={item.prioridade}
                        onChange={event =>
                          props.modificarAtributoTabelaAbaAction(
                            props,
                            indiceAba,
                            "prioridade",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }

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
                  <td>{formatarNumDecimal(item.cotacao)}</td>
                  <td>{formatarNumDecimal(item.qtde * item.cotacao)}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  multileg: state.multilegReducer.multileg,
  eventSource: state.multilegReducer.eventSource,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao
});

export default connect(
  mapStateToProps,
  { modificarAtributoTabelaAbaAction, excluirOfertaTabelaAction }
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
            props.modificarAtributoTabelaAbaAction(
              props,
              props.indice,
              "cv",
              "compra",
              indiceLinha
            )
          }
        >
          C
        </h6>
        <h6
          className={`${cvVenda} divClicavel`}
          onClick={() =>
            props.modificarAtributoTabelaAbaAction(
              props,
              props.indice,
              "cv",
              "venda",
              indiceLinha
            )
          }
        >
          V
        </h6>
      </div>
    </td>
  );
};

const renderModelo = modelo => {
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

const renderCodigoOferta = (listaOpcoes, codigoAberto, tipoAtual) => {
  let listaCodigos = [];

  if (codigoAberto)
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
          <option key={Math.random()} value={value}>
            {codigo}
          </option>
        );
      }
    });
  else {
    return listaOpcoes.map(opcao => (
      <option key={Math.random()} value={opcao.symbol}>
        {opcao.symbol}
      </option>
    ));
  }

  return listaCodigos;
};
