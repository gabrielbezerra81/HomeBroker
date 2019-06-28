import React from "react";
import DraggableModal from "../DraggableModal";
import "../../css/BookOfertas.css";

class BookOfertas extends React.Component {
  render() {
    return (
        <DraggableModal
          show={this.props.show}
          close={this.props.close}
          id="bookofertas"
          headerTitle="PETR4, PETROBRAS PN N2"
          tableDataVenda={dataOrdemVenda}
          tableDataCompra={dataOrdemCompra}
        />
    );
  }
}

export default BookOfertas;

/*<DraggableModal
          show={this.props.show}
          close={this.props.handleClose}
          id="compraagendada"
        />*/
const dataOrdemVenda = [
  {
    qtde: 43300,
    valor: 26.75
  },
  {
    qtde: 9800,
    valor: 26.74
  },
  {
    qtde: 1000,
    valor: 26.73
  },
  {
    qtde: 10900,
    valor: 26.72
  },
  {
    qtde: 43300,
    valor: 26.71
  }
];

const dataOrdemCompra = [
  {
    qtde: 9800,
    valor: 26.7
  },
  {
    qtde: 1000,
    valor: 26.68
  },
  {
    qtde: 10900,
    valor: 26.66
  },
  {
    qtde: 1000,
    valor: 26.68
  },
  {
    qtde: 10900,
    valor: 26.66
  }
];
