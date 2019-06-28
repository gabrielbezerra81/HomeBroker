import React from "react";
import "./css/App.css";
import { Button } from "react-bootstrap";
import BookOfertas from "././components/forms/BookOfertas";
import CompraAgendada from "./components/forms/CompraAgendada";
class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="primary" onClick={this.handleShow}>
            Abrir form
          </Button>
          <BookOfertas
            show={this.state.show}
            close={this.handleClose}
            tableDataVenda={dataOrdemVenda}
            tableDataCompra={dataOrdemCompra}
            headerTitle="PETR4, PETROBRAS PN N2"
          />
        </header>
      </div>
    );
  }
}
export default App;

/*
          <CompraAgendada
            show={this.state.show}
            close={this.handleClose}
            headerTitle="PETR4, PETROBRAS PN N2"
          />
*/

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
