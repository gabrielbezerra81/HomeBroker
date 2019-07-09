import React from "react";
import "../css";
import { Button } from "react-bootstrap";
import BookOfertas from "./forms/book_Ofertas/BookOfertas";
import CompraAgendada from "./forms/compra_Agendada/CompraAgendada";
import CompraLimitada from "./forms/compra_Limitada/CompraLimitada";
import CompraMercado from "./forms/compra_Mercado/CompraMercado";
import CompraStartStop from "./forms/compra_StartStop/CompraStartStop";
import { Row } from "react-bootstrap";
class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      book: true,
      agendada: true,
      limitada: true,
      mercado: true,
      startstop: true
    };
  }

  handleShow(event) {
    this.setState({ [event.target.getAttribute("name")]: true });
  }

  handleClose(event) {
    this.setState({ [event.target.getAttribute("name")]: false });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button
            variant="primary"
            onClick={() => this.props.removerApp(this.props.appkey)}
          >
            Fechar
          </Button>
          <Button variant="primary" onClick={this.handleShow} name="book">
            Abrir Book
          </Button>
          <Button variant="primary" onClick={this.handleShow} name="agendada">
            Abrir Compra Agendada
          </Button>
          <Button variant="primary" onClick={this.handleShow} name="limitada">
            Abrir Compra Limitada
          </Button>
          <Button variant="primary" onClick={this.handleShow} name="mercado">
            Abrir Compra a Mercado
          </Button>
          <Button variant="primary" onClick={this.handleShow} name="startstop">
            Abrir Compra Start/Stop
          </Button>
          <Button variant="primary">Abrir Compra Start Móvel</Button>
          <Button variant="primary">Abrir Gain/Redução de compra</Button>
        </header>
        <Row className="appbody">
          {this.state.book ? (
            <BookOfertas
              show={this.state.book}
              close={this.handleClose}
              tableDataVenda={dataOrdemVenda}
              tableDataCompra={dataOrdemCompra}
              name="bookofertas"
            />
          ) : null}
          {this.state.agendada ? (
            <CompraAgendada
              show={this.state.agendada}
              close={this.handleClose}
              headerTitle="COMPRA AGENDADA"
              name="compraagendada"
            />
          ) : null}

          {this.state.limitada ? (
            <CompraLimitada
              show={this.state.limitada}
              close={this.handleClose}
              headerTitle="COMPRA LIMITADA"
              name="compralimitada"
            />
          ) : null}

          {this.state.mercado ? (
            <CompraMercado
              show={this.state.mercado}
              close={this.handleClose}
              headerTitle="COMPRA A MERCADO"
              name="compramercado"
            />
          ) : null}

          {this.state.startstop ? (
            <CompraStartStop
              show={this.state.startstop}
              close={this.handleClose}
              headerTitle="COMPRA START STOP"
              name="comprastartstop"
            />
          ) : null}
        </Row>
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
  }
];
