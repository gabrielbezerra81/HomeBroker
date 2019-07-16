import React from "react";
import { Table, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

class TabelaOrdens extends React.Component {
  renderItems(tableData) {
    return tableData.map((item, index) => (
      <tr key={index}>
       <td>{index + 1}º</td>
        <td>{Number(item.disparo).toFixed(2)}</td>
        <td>{Number(item.stopAtual).toFixed(2)}</td>
        <td>{Number(item.ajuste).toFixed(2)}</td>
        <td>{Number(item.novoStop).toFixed(2)}</td>
        <td>
          <Button variant="" onClick={() => false} className="operation-icons">
            <MDBIcon icon="times" size="1x" />
          </Button>
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <Table
        striped
        variant="dark"
        borderless
        className="tableBook text-center"
      >
        <thead>
          <tr>
          <th>Ord</th>
            <th>Disparo</th>
            <th>Stop Atual</th>
            <th>Ajuste</th>
            <th>Novo Stop</th>
            <th />
          </tr>
        </thead>
        <tbody>{this.renderItems(this.props.tableDataOrdens)}</tbody>
      </Table>
    );
  }
}

export default TabelaOrdens;
