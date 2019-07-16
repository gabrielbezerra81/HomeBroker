import React from "react";
import "../css";
import { Button } from "react-bootstrap";
import BookOfertas from "./forms/book_Ofertas/BookOfertas";
import CompraAgendada from "./forms/compra_Agendada/CompraAgendada";
import CompraLimitada from "./forms/compra_Limitada/CompraLimitada";
import CompraMercado from "./forms/compra_Mercado/CompraMercado";
import CompraStartStop from "./forms/compra_StartStop/CompraStartStop";
import CompraStartMovel from "./forms/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "./forms/compra_GainReducao/CompraGainReducao";

import VendaAgendada from "./forms/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./forms/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./forms/venda/venda_Mercado/VendaMercado";
import VendaStopMovel from "./forms/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./forms/venda/venda_GainReducao/VendaGainReducao";

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
      startstop: true,
      startmovel: true,
      gainreducao: true,
      venda_agendada: true,
      venda_limitada: true,
      venda_mercado: true,
      venda_stop_movel: true,
      venda_gain_reducao: true
    };
  }

  handleShow(event) {
    console.log(event.target);
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
            size="sm"
            onClick={() => this.props.removerApp(this.props.appkey)}
          >
            <h6>Fechar</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="book"
          >
            <h6 name="book">Book de Ofertas</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="agendada"
          >
            <h6 name="agendada">Compra Agendada</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="limitada"
          >
            <h6 name="limitada">Compra Limitada</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="mercado"
          >
            <h6 name="mercado">Compra a Mercado</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="startstop"
          >
            <h6 name="startstop">Compra Start/Stop</h6>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleShow}
            name="startmovel"
          >
            <h6 name="startmovel">Compra Start Móvel</h6>
          </Button>
          <Button variant="primary" size="sm" name="reducao">
            <h6 name="reducao">Gain/Redução de compra</h6>
          </Button>
        </header>
        <Row className="appbody">
          {this.state.book ? (
            <BookOfertas
              close={this.handleClose}
              tableDataVenda={dataOrdemVenda}
              tableDataCompra={dataOrdemCompra}
              name="bookofertas"
            />
          ) : null}

          {this.state.agendada ? (
            <CompraAgendada
              close={this.handleClose}
              headerTitle="COMPRA AGENDADA"
              name="compraagendada"
            />
          ) : null}

          {this.state.limitada ? (
            <CompraLimitada
              close={this.handleClose}
              headerTitle="COMPRA LIMITADA"
              name="compralimitada"
            />
          ) : null}

          {this.state.mercado ? (
            <CompraMercado
              close={this.handleClose}
              headerTitle="COMPRA A MERCADO"
              name="compramercado"
            />
          ) : null}

          {this.state.startstop ? (
            <CompraStartStop
              close={this.handleClose}
              headerTitle="COMPRA START STOP"
              name="comprastartstop"
            />
          ) : null}
          {this.state.startmovel ? (
            <CompraStartMovel
              close={this.handleClose}
              headerTitle="COMPRA START MÓVEL"
              name="comprastartmovel"
            />
          ) : null}
          {this.state.gainreducao ? (
            <CompraGainReducao
              close={this.handleClose}
              headerTitle="GAIN / REDUÇÃO DE COMPRA"
              name="compragainreducao"
            />
          ) : null}
          {this.state.venda_agendada ? (
            <VendaAgendada
              close={this.handleClose}
              headerTitle="VENDA AGENDADA"
              name="vendaagendada"
            />
          ) : null}
          {this.state.venda_limitada ? (
            <VendaLimitada
              close={this.handleClose}
              headerTitle="VENDA LIMITADA"
              name="vendalimitada"
            />
          ) : null}
          {this.state.venda_mercado ? (
            <VendaMercado
              close={this.handleClose}
              headerTitle="VENDA MERCADO"
              name="vendamercado"
            />
          ) : null}
          {this.state.venda_stop_movel ? (
            <VendaStopMovel
              close={this.handleClose}
              headerTitle="VENDA STOP MÓVEL"
              name="vendastopmovel"
            />
          ) : null}
          {this.state.venda_gain_reducao ? (
            <VendaGainReducao
              close={this.handleClose}
              headerTitle="GAIN / REDUÇÃO DE VENDA"
              name="vendagainreducao"
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
