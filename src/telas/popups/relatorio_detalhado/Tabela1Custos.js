import React from "react";
import { Table } from "react-bootstrap";

export default class Tabela1Custos extends React.Component {
  render() {
    return (
      <Table
        variant="dark"
        borderless
        striped
        className="text-center tabela1Custo"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th>Custos</th>
            <th>Resultado</th>
            <th>Lucro</th>
            <th>Prejuízo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="colunaDividida">
                <div>Total: </div>
                <div>2.500,00</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>Total: </div>
                <div>2.500,00</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>Máx</div>
                <div>Mín</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>Máx</div>
                <div>Mín</div>
              </div>
            </td>
          </tr>
          {/* */}
          <tr>
            <td>
              <div className="colunaDividida">
                <div>Mensal: </div>
                <div>0,15</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>Mensal: </div>
                <div>0,15</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div></div>
                <div></div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div></div>
                <div></div>
              </div>
            </td>
          </tr>
          {/* */}
          <tr>
            <td>
              <div className="colunaDividida">
                <div>Semanal: </div>
                <div>0,15</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>Semanal: </div>
                <div>0,15</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div></div>
                <div></div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div></div>
                <div></div>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
