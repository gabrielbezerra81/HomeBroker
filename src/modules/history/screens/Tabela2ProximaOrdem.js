import React from "react";
import { Table, ProgressBar } from "react-bootstrap";

export default class Tabela2ProximaOrdem extends React.Component {
  render() {
    return (
      <Table
        variant="dark"
        borderless
        striped
        className="text-center tabela2ProximaOrdem"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th>Progresso</th>
            <th>Ativo</th>
            <th>Oferta</th>
            <th>Qtd</th>
            <th>Disparo</th>
            <th>Executado</th>
            <th>Últ</th>
            <th>Validade</th>
            <th>Roteador</th>
            <th>Msg</th>
          </tr>
        </thead>
        <tbody className="verticalAlignColunaTabela">
          <tr>
            <td>
              <ProgressBar
                animated
                variant="success"
                now={25}
                label={`25%`}
                className="barraProgresso"
              />
            </td>
            <td>
              <div>
                PETRG260
                <br />
                PETRH270
              </div>
            </td>
            <td>
              <div>
                V
                <br />C
              </div>
            </td>
            <td>
              <div>
                1.000
                <br />
                1.000
              </div>
            </td>
            <td>0,20</td>
            <td>0</td>
            <td></td>
            <td></td>
            <td>MT5</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
