import React from "react";
import { Row, Col, Table, Form, Button } from "react-bootstrap";

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
            <tr>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
            </tr>
            <tr>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
              <td>V</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AbaMultileg;
