import React from "react";
import "./css/";
import { Button } from "react-bootstrap";
import BookOfertas from "./components/forms/book_Ofertas/BookOfertas";
import CompraAgendada from "./components/forms/compra_Agendada/CompraAgendada";
import CompraLimitada from "./components/forms/compra_Limitada/CompraLimitada";
class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShowAgend = this.handleShowAgend.bind(this);
    this.handleCloseAgend = this.handleCloseAgend.bind(this);

    this.state = {
      book: true,
      agendada: true
    };
  }

  handleClose() {
    this.setState({ book: false });
  }

  handleShow() {
    this.setState({ book: true });
  }

  handleCloseAgend() {
    this.setState({ agendada: false });
  }

  handleShowAgend() {
    this.setState({ agendada: true });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="primary" onClick={this.handleShow}>
            Abrir Book
          </Button>
          <Button variant="primary" onClick={this.handleShowAgend}>
            Abrir Compra Agendada
          </Button>
          <BookOfertas
            show={this.state.book}
            close={this.handleClose}
            tableDataVenda={dataOrdemVenda}
            tableDataCompra={dataOrdemCompra}
            name="book"
          />
          <CompraAgendada
            show={this.state.agendada}
            close={this.handleCloseAgend}
            headerTitle="COMPRA AGENDADA"
            name="compraagendada"
            id="compraagendada"
          />
          <CompraLimitada
            show={this.state.agendada}
            close={this.handleCloseAgend}
            headerTitle="COMPRA LIMITADA"
            name="compralimitada"
            id="compralimitada"
          />
        </header>
      </div>
    );
  }
}
export default App;

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
