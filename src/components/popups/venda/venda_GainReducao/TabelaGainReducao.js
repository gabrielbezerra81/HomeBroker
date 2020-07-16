import React from "react";
import { Table, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { removerItemTabelaAction } from "redux/actions/boletas/formInputActions";
import {
  VENDA_GAINREDUCAO_NAMESPACE,
  REMOVE_ITEM_TABELA_GAIN_REDUCAO,
} from "constants/ActionTypes";

class TabelaGainReducao extends React.Component {
  somaQtde = 0;
  somaTotal = 0;

  renderItems(tableData) {
    return tableData.map((item, index) => {
      this.somaQtde += item.qtde;
      this.somaTotal += item.total;

      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{Number(item.disparo).toFixed(2)}</td>
          <td>{Number(item.execucao).toFixed(2)}</td>
          <td>{Number(item.qtde).toFixed(0)}</td>
          <td>{Number(item.total).toFixed(2)}</td>
          <td>
            <Button
              variant="link"
              onClick={() =>
                this.props.removerItemTabelaAction(
                  REMOVE_ITEM_TABELA_GAIN_REDUCAO,
                  tableData,
                  index,
                  VENDA_GAINREDUCAO_NAMESPACE
                )
              }
              className="operation-icons"
            >
              <MDBIcon icon="times" size="1x" />
            </Button>
          </td>
        </tr>
      );
    });
  }

  render() {
    this.somaQtde = 0;
    this.somaTotal = 0;
    return (
      <Table
        striped
        variant="dark"
        borderless
        className="tabelaGainReducao text-center"
      >
        <thead>
          <tr>
            <th>Ord</th>
            <th>Disparo</th>
            <th>Execução</th>
            <th>Qtde</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.renderItems(this.props.tableDataOrdens)}
          {this.somaQtde !== 0 ? (
            <tr className="ultimaLinhaTabelaGainReducao">
              <td />
              <td />
              <td />
              <td>{this.somaQtde}</td>
              <td>{Number(this.somaTotal).toFixed(2)}</td>
              <td />
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { removerItemTabelaAction })(
  TabelaGainReducao
);
