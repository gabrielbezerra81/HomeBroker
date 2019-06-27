import React from "react";
import OperationIcon from "./OperationIcon";
import { Table } from "react-bootstrap";

class TabelaCotacoes extends React.Component {
  render() {
    return (
      <Table
        striped
        variant="dark"
        hover
        borderless
        className="mytable text-center"
      >
        <thead>
          <tr>
            <th>Qtde</th>
            <th>Preço</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>43300</td>
            <td>26.75</td>
            <td>
              <OperationIcon />
            </td>
          </tr>
          <tr>
            <td>43300</td>
            <td>26.75</td>
            <td>
              <OperationIcon />
            </td>
          </tr>
          <tr>
            <td>43300</td>
            <td>26.75</td>
            <td>
              <OperationIcon />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default TabelaCotacoes;
