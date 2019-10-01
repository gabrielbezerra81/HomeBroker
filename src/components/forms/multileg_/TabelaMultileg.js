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

const capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class TabelaMultileg extends React.Component {
  render() {
    const indiceAba = this.props.indice;
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
            <th>Cotação</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {this.props.multileg[this.props.indice].tabelaMultileg.map(
            (item, indiceLinha) => {
              return (
                <tr key={indiceLinha}>
                  <td
                    className="divClicavel"
                    onClick={() =>
                      this.props.excluirOfertaTabelaAction(
                        this.props.multileg,
                        indiceAba,
                        indiceLinha
                      )
                    }
                  >
                    <MDBIcon icon="times" className="saldoOpNegativo" />
                  </td>
                  {renderCV(item.cv)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento "
                        type="number"
                        min={0}
                        step={100}
                        name="qtde"
                        value={item.qtde}
                        onChange={event =>
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
                            indiceAba,
                            "qtde",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput"
                        value={item.serieSelecionada}
                        onChange={event =>
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
                            indiceAba,
                            "serieSelecionada",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }
                      >
                        {item.serie.map((serie, indice) => (
                          <option key={serie + indice} value={serie}>
                            {serie}
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
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
                            indiceAba,
                            "strikeSelecionado",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }
                      >
                        {item.strike.map((strike, indice) => (
                          <option key={strike + indice} value={strike}>
                            {strike}
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
                        value={item.codigoSelecionado}
                        onChange={event =>
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
                            indiceAba,
                            "codigoSelecionado",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }
                      >
                        {item.codigo.map((codigo, indice) => (
                          <option key={codigo + indice} value={codigo}>
                            {codigo}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td>
                    <div
                      className="divClicavel"
                      tabIndex={0}
                      onClick={event =>
                        this.props.modificarAtributoTabelaAbaAction(
                          this.props.multileg,
                          indiceAba,
                          "tipo",
                          item.tipo,
                          indiceLinha
                        )
                      }
                    >
                      {capitalize(item.tipo)}
                    </div>
                  </td>
                  {renderModelo(item.modelo)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento"
                        type="number"
                        min={0}
                        step={100}
                        value={item.despernamento}
                        onChange={event =>
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
                            indiceAba,
                            "despernamento",
                            event.currentTarget.value,
                            indiceLinha
                          )
                        }
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
                          this.props.modificarAtributoTabelaAbaAction(
                            this.props.multileg,
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
                  <td>{item.cotacao}</td>
                  <td>{item.valor}</td>
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
  multileg: state.multilegReducer.multileg
});

export default connect(
  mapStateToProps,
  { modificarAtributoTabelaAbaAction, excluirOfertaTabelaAction }
)(TabelaMultileg);

const renderCV = cv => {
  return (
    <td>
      {cv === "compra" ? (
        <div className="divCV">
          <h6 className="cvCompra"> C </h6>
          <h6> V </h6>
        </div>
      ) : (
        <div className="divCV">
          <h6> C </h6>
          <h6 className="cvVenda"> V </h6>
        </div>
      )}
    </td>
  );
};

const renderModelo = modelo => {
  return (
    <td>
      {modelo === "EU" ? (
        <div>
          <img src={imgModeloEU} alt="" className="imgModelo" />
        </div>
      ) : (
        <div>
          <img src={imgModeloUSA} alt="" className="imgModelo" />
        </div>
      )}
    </td>
  );
};
