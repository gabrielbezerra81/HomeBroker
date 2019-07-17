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
import VendaStartStop from "./forms/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./forms/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./forms/venda/venda_GainReducao/VendaGainReducao";

import { Row, Col } from "react-bootstrap";
import {
  abrirFormularioAction,
  fecharFormularioAction
} from "./redux/actions/AppActions";
import { connect } from "react-redux";

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    //Verificar names nos icones de fechar e nos componentes abaixo
    this.state = {
      book: false,
      compra_agendada: false,
      compra_limitada: false,
      compra_mercado: false,
      compra_startstop: false,
      compra_startmovel: false,
      compra_gainreducao: false,
      venda_agendada: false,
      venda_limitada: false,
      venda_mercado: false,
      venda_startstop: false,
      venda_stop_movel: false,
      venda_gainreducao: false
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
          <Row style={{ paddingBottom: "0.5rem" }}>
            <Col md={2}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => this.props.removerApp(this.props.appkey)}
              >
                <h6>Fechar</h6>
              </Button>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="book"
              >
                <h6 name="book">Book de Ofertas</h6>
              </Button>
            </Col>
          </Row>
          <Row style={{ paddingBottom: "0.5rem" }}>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="compra_agendada"
              >
                <h6 name="compra_agendada">Compra Agendada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="compra_limitada"
              >
                <h6 name="compra_limitada">Compra Limitada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="compra_mercado"
              >
                <h6 name="compra_mercado">Compra a Mercado</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="compra_startstop"
              >
                <h6 name="compra_startstop">Compra Start/Stop</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                onClick={this.props.abrirFormularioAction}
                name="compra_startmovel"
              >
                <h6 name="compra_startmovel">Compra Start Móvel</h6>
              </Button>
            </Col>

            <Col>
              {" "}
              <Button
                variant="primary"
                size="sm"
                name="compra_gainreducao"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="compra_gainreducao">Gain/Redução de compra</h6>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_agendada"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_agendada">Venda Agendada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_limitada"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_limitada">Venda Limitada</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_mercado"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_mercado">Venda a Mercado</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_startstop"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_startstop">Venda Start/Stop</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_stop_movel"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_stop_movel">Venda Stop Móvel</h6>
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                size="sm"
                name="venda_gainreducao"
                onClick={this.props.abrirFormularioAction}
              >
                <h6 name="venda_gainreducao">Gain/Redução de venda</h6>
              </Button>
            </Col>
          </Row>
        </header>
        <Row className="appbody">
          {this.props.book ? (
            <BookOfertas
              close={this.props.fecharFormularioAction}
              tableDataVenda={dataOrdemVenda}
              tableDataCompra={dataOrdemCompra}
              name="book"
            />
          ) : null}

          {this.props.compra_agendada ? (
            <CompraAgendada
              close={this.props.fecharFormularioAction}
              headerTitle="COMPRA AGENDADA"
              name="compra_agendada"
            />
          ) : null}

          {this.props.compra_limitada ? (
            <CompraLimitada
              close={this.props.fecharFormularioAction}
              headerTitle="COMPRA LIMITADA"
              name="compra_limitada"
            />
          ) : null}

          {this.props.compra_mercado ? (
            <CompraMercado
              close={this.props.fecharFormularioAction}
              headerTitle="COMPRA A MERCADO"
              name="compra_mercado"
            />
          ) : null}

          {this.props.compra_startstop ? (
            <CompraStartStop
              close={this.props.fecharFormularioAction}
              headerTitle="COMPRA START STOP"
              name="compra_startstop"
            />
          ) : null}
          {this.props.compra_startmovel ? (
            <CompraStartMovel
              close={this.props.fecharFormularioAction}
              headerTitle="COMPRA START MÓVEL"
              name="compra_startmovel"
            />
          ) : null}
          {this.props.compra_gainreducao ? (
            <CompraGainReducao
              close={this.props.fecharFormularioAction}
              headerTitle="GAIN / REDUÇÃO DE COMPRA"
              name="compra_gainreducao"
            />
          ) : null}
          {this.props.venda_agendada ? (
            <VendaAgendada
              close={this.props.fecharFormularioAction}
              headerTitle="VENDA AGENDADA"
              name="venda_agendada"
            />
          ) : null}
          {this.props.venda_limitada ? (
            <VendaLimitada
              close={this.props.fecharFormularioAction}
              headerTitle="VENDA LIMITADA"
              name="venda_limitada"
            />
          ) : null}
          {this.props.venda_mercado ? (
            <VendaMercado
              close={this.props.fecharFormularioAction}
              headerTitle="VENDA MERCADO"
              name="venda_mercado"
            />
          ) : null}
          {this.props.venda_startstop ? (
            <VendaStartStop
              close={this.props.fecharFormularioAction}
              headerTitle="VENDA START STOP"
              name="venda_startstop"
            />
          ) : null}
          {this.props.venda_stop_movel ? (
            <VendaStopMovel
              close={this.props.fecharFormularioAction}
              headerTitle="VENDA STOP MÓVEL"
              name="venda_stop_movel"
            />
          ) : null}
          {this.props.venda_gainreducao ? (
            <VendaGainReducao
              close={this.props.fecharFormularioAction}
              headerTitle="GAIN / REDUÇÃO DE VENDA"
              name="venda_gainreducao"
            />
          ) : null}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  book: state.appReducer.book,
  compra_agendada: state.appReducer.compra_agendada,
  compra_limitada: state.appReducer.compra_limitada,
  compra_mercado: state.appReducer.compra_mercado,
  compra_startstop: state.appReducer.compra_startstop,
  compra_startmovel: state.appReducer.compra_startmovel,
  compra_gainreducao: state.appReducer.compra_gainreducao,
  venda_agendada: state.appReducer.venda_agendada,
  venda_limitada: state.appReducer.venda_limitada,
  venda_mercado: state.appReducer.venda_mercado,
  venda_startstop: state.appReducer.venda_startstop,
  venda_stop_movel: state.appReducer.venda_stop_movel,
  venda_gainreducao: state.appReducer.venda_gainreducao
});

export default connect(
  mapStateToProps,
  { abrirFormularioAction, fecharFormularioAction }
)(App);

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

const True = {
  book: true,
  compra_agendada: true,
  compra_limitada: true,
  compra_mercado: true,
  compra_startstop: true,
  compra_startmovel: true,
  compra_gainreducao: true,
  venda_agendada: true,
  venda_limitada: true,
  venda_mercado: true,
  venda_startstop: true,
  venda_stop_movel: true,
  venda_gainreducao: true
};

const False = {
  book: false,
  compra_agendada: false,
  compra_limitada: false,
  compra_mercado: false,
  compra_startstop: false,
  compra_startmovel: false,
  compra_gainreducao: false,
  venda_agendada: false,
  venda_limitada: false,
  venda_mercado: false,
  venda_startstop: false,
  venda_stop_movel: false,
  venda_gainreducao: false
};
