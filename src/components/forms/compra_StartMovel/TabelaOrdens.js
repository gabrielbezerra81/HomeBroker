import React from "react";
import { Table } from "react-bootstrap";

class TabelaOrdens extends React.Component {
  renderItems(tableData) {
    return tableData.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}º</td>
        <td>{Number(item.disparo).toFixed(2)}</td>
        <td>{Number(item.ajuste).toFixed(2)}</td>
        <td>{Number(item.stop).toFixed(2)}</td>
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
            <th>Ajuste</th>
            <th>Stop</th>
          </tr>
        </thead>
        <tbody>{this.renderItems(this.props.tableDataOrdens)}</tbody>
      </Table>
    );
  }
}

export default TabelaOrdens;
