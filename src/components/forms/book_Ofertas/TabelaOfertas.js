import React from "react";
import OperationIcon from "./OperationIcon";
import { Table } from "react-bootstrap";

class TabelaOfertas extends React.Component {
  renderItems(data, tipo) {
    return data.map((item, index) => (
      <tr className={tipo} key={index}>
        <td>{item.qtde}</td>
        <td>{item.valor}</td>
        <td>
          <OperationIcon />
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <Table striped variant="dark" borderless className="tableBook text-center">
        <thead>
          <tr>
            <th>Qtde</th>
            <th>Preço</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody>
          {this.renderItems(
            this.props.tableDataVenda,
            "itemOrdemVenda tableItemBookOferta"
          )}
          {this.renderItems(
            this.props.tableDataCompra,
            "itemOrdemCompra tableItemBookOferta"
          )}
        </tbody>
      </Table>
    );
  }
}

export default TabelaOfertas;
