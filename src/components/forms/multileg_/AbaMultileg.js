import React from "react";
import { Row, Col, Table, Form, Button } from "react-bootstrap";

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

class AbaMultileg extends React.Component {
  render() {
    return (
      <div className="containerAbaMultileg">
        <div className="divDetalhesAbaMultileg">
          <div className="divColunaDetalhes">
            <h6>PETR4</h6>
            <h6 className="textoValor">27,43-</h6>
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
                type="number"
                step={0.01}
                //value={1}
                onChange={() => false}
              />
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
                  <td>{item.qtde}</td>
                  <td>{item.serie}</td>
                  <td>{item.strike}</td>
                  <td>{item.codigo}</td>
                  <td>{item.tipo.capitalize()}</td>
                  <td>{item.modelo}</td>
                  <td>{item.despernamento}</td>
                  <td>{item.prioridade}</td>
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

const tabelaMultileg = [
  {
    cv: "compra",
    qtde: 1000,
    serie: "2019-08",
    strike: 27.48,
    codigo: "PETRH275",
    tipo: "call",
    modelo: "V",
    despernamento: "",
    prioridade: "",
    cotacao: "",
    valor: "-40,00"
  },
  {
    cv: "venda",
    qtde: 1000,
    serie: "2019-08",
    strike: 27.48,
    codigo: "PETRH275",
    tipo: "call",
    modelo: "V",
    despernamento: "",
    prioridade: "",
    cotacao: "",
    valor: "-40,00"
  }
];

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
