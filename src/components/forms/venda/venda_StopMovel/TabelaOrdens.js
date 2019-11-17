import React from "react";
import { Table, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  VENDA_STOPMOVEL_NAMESPACE,
  REMOVE_ITEM_TABELA_ORDENS_MOVEL
} from "constants/ActionTypes";
import { removerItemTabelaAction } from "components/redux/actions/formInputActions";

class TabelaOrdens extends React.Component {
  renderItems(tableData) {
    return tableData.map((item, index) => (
      <tr
        key={index}
        className={item.tipo === "simulacao" ? "itemSimulacaoVenda" : ""}
      >
        <td>
          {item.tipo === "real"
            ? index + 1
            : this.props.tableDataOrdens.length + index + 1}
          º
        </td>
        <td>{Number(item.disparo).toFixed(2)}</td>
        <td>{Number(item.stopAtual).toFixed(2)}</td>
        <td>{Number(item.ajuste).toFixed(2)}</td>
        <td>{Number(item.novoStop).toFixed(2)}</td>
        <td>
          <Button
            variant="link"
            onClick={() =>
              this.props.removerItemTabelaAction(
                REMOVE_ITEM_TABELA_ORDENS_MOVEL,
                tableData,
                index,
                VENDA_STOPMOVEL_NAMESPACE,
                item.tipo
              )
            }
            className="operation-icons"
          >
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
        <tbody>
          {this.renderItems(this.props.tableDataOrdens)}
          {this.renderItems(this.props.tableDataOrdensSimulacao)}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { removerItemTabelaAction })(
  TabelaOrdens
);
