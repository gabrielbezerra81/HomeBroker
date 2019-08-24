import React from "react";
import { Table, Form, Button } from "react-bootstrap";
import imgModeloEU from "img/modeloEU.png";
import imgModeloUSA from "img/modeloUSA.png";

const capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class AbaMultileg extends React.Component {
  render() {
    return (
      <div className="containerAbaMultileg">
        <div className="divDetalhesAbaMultileg">
          <div className="divColunaDetalhes">
            <h6>PETR4</h6>
            <h6 className="textoValor">-27,43</h6>
            <Form.Group>
              <Form.Label>Juros</Form.Label>
              <Form.Control
                className="textInput"
                type="number"
                step={0.01}
                //value={1}
                onChange={() => false}
              />
            </Form.Group>
          </div>
          <div className="divColunaDetalhes modoPreco">
            <Form.Group>
              <Form.Label>Modo de preços</Form.Label>
              <Form.Control
                className="textInput"
                as="select"
                //value={1}
                //onChange={() => false}
              >
                <option value="live">Live</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="divColunaDetalhes">
            <div className="divFlexRowDetalhesAba">
              <Form.Label>Agregar pernas</Form.Label>
              <div>
                <Button variant="primary" size="sm">
                  +Ativo
                </Button>
                <Button variant="primary" size="sm">
                  +Call
                </Button>
                <Button variant="primary" size="sm">
                  +Put
                </Button>
              </div>
            </div>
          </div>
          <div className="divColunaDetalhes">
            <div className="divFlexRowDetalhesAba">
              <Form.Label>Execução</Form.Label>
              <div>
                <Button variant="success" size="sm">
                  Montar
                </Button>
                <Button variant="danger" size="sm">
                  Reverter
                </Button>
              </div>
            </div>
          </div>
          <div className="divColunaDetalhes book">
            <h6>Book</h6>
          </div>
        </div>
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
            {tabelaMultileg.map((item, index) => {
              return (
                <tr key={index}>
                  {renderCV(item.cv)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento"
                        type="number"
                        min={0}
                        step={100}
                        //value={item.qtde}
                      />
                    </Form.Group>
                  </td>
                  <td>{item.serie}</td>
                  <td>{item.strike}</td>
                  <td>{item.codigo}</td>
                  <td>{capitalize(item.tipo)}</td>
                  {renderModelo(item.modelo)}
                  <td>
                    <Form.Group>
                      <Form.Control
                        className="textInput formDespernamento"
                        type="number"
                        min={0}
                        step={100}
                        //value={item.despernamento}
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        className="textInput formPrioridade"
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
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AbaMultileg;

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

const tabelaMultileg = [
  {
    cv: "compra",
    qtde: 1000,
    serie: "2019-08",
    strike: 27.48,
    codigo: "PETRH275",
    tipo: "call",
    modelo: "EU",
    despernamento: 100,
    prioridade: -1,
    cotacao: "15,25",
    valor: "-40,00"
  },
  {
    cv: "venda",
    qtde: 2000,
    serie: "2019-08",
    strike: 27.48,
    codigo: "PETRH275",
    tipo: "call",
    modelo: "USA",
    despernamento: 500,
    prioridade: 2,
    cotacao: "10,30",
    valor: "-40,00"
  }
];
