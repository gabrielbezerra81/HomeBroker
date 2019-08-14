import React from "react";
import { Row } from "react-bootstrap";
import "../css";
import BookOfertas from "./forms/book_Ofertas/BookOfertas";
import CompraAgendada from "components/forms/compra/compra_Agendada/CompraAgendada";
import CompraLimitada from "components/forms/compra/compra_Limitada/CompraLimitada";
import CompraMercado from "components/forms/compra/compra_Mercado/CompraMercado";
import CompraStartStop from "components/forms/compra/compra_StartStop/CompraStartStop";
import CompraStartMovel from "components/forms/compra/compra_StartMovel/CompraStartMovel";
import CompraGainReducao from "components/forms/compra/compra_GainReducao/CompraGainReducao";
import VendaAgendada from "./forms/venda/venda_Agendada/VendaAgendada";
import VendaLimitada from "./forms/venda/venda_Limitada/VendaLimitada";
import VendaMercado from "./forms/venda/venda_Mercado/VendaMercado";
import VendaStartStop from "./forms/venda/venda_StartStop/VendaStartStop";
import VendaStopMovel from "./forms/venda/venda_StopMovel/VendaStopMovel";
import VendaGainReducao from "./forms/venda/venda_GainReducao/VendaGainReducao";
import { Animate } from "react-show";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

const leave = {
  // these styles will be applied when the component leaves
  opacity: 0,
  pointerEvents: "none"
};

const enter = {
  // These styles will be applied when the component enters
};

const animate = (props, componente) => {
  return (
    <Animate
      show={props.show[props.indiceShow][componente.props.name]}
      duration={250}
      transitionOnMount
      preMount
      leave={leave}
      start={startStyle}
      enter={enter}
      id={`${componente.props.name}${props.appkey}`}
      onClick={() =>
        props.aumentarZindexAction(
          `${componente.props.name}${props.appkey}`,
          props.zIndex,
          props.show[props.indiceShow][componente.props.name]
        )
      }
    >
      {componente}
    </Animate>
  );
};

export default class App extends React.Component {
  componentDidUpdate() {
    if (this.props.divkey !== "")
      document.getElementById(this.props.divkey).style.zIndex =
        this.props.zIndex + 1;

    this.props.receberAppPropsAction(this.props);
  }

  componentDidMount() {
    this.props.receberAppPropsAction(this.props);
  }

  render() {
    return (
      <div className="App">
        <Row className="appbody">
          {animate(
            this.props,
            <BookOfertas
              close={() => {
                this.props.fecharFormAction(this.props, "book");
              }}
              name="book"
            />
          )}
          {animate(
            this.props,
            <CompraAgendada
              close={() => {
                this.props.fecharFormAction(this.props, "compra_agendada");
              }}
              headerTitle="COMPRA AGENDADA"
              name="compra_agendada"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <CompraLimitada
              close={() => {
                this.props.fecharFormAction(this.props, "compra_limitada");
              }}
              headerTitle="COMPRA LIMITADA"
              name="compra_limitada"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}

          {animate(
            this.props,
            <CompraMercado
              close={() => {
                this.props.fecharFormAction(this.props, "compra_mercado");
              }}
              headerTitle="COMPRA A MERCADO"
              name="compra_mercado"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}

          {animate(
            this.props,
            <CompraStartStop
              close={() => {
                this.props.fecharFormAction(this.props, "compra_startstop");
              }}
              headerTitle="COMPRA START STOP"
              name="compra_startstop"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}

          {animate(
            this.props,
            <CompraStartMovel
              close={() => {
                this.props.fecharFormAction(this.props, "compra_startmovel");
              }}
              headerTitle="COMPRA START MÓVEL"
              name="compra_startmovel"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}

          {animate(
            this.props,
            <CompraGainReducao
              close={() => {
                this.props.fecharFormAction(this.props, "compra_gainreducao");
              }}
              headerTitle="GAIN / REDUÇÃO DE COMPRA"
              name="compra_gainreducao"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}

          {animate(
            this.props,
            <VendaAgendada
              close={() => {
                this.props.fecharFormAction(this.props, "venda_agendada");
              }}
              headerTitle="VENDA AGENDADA"
              name="venda_agendada"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <VendaLimitada
              close={() => {
                this.props.fecharFormAction(this.props, "venda_limitada");
              }}
              headerTitle="VENDA LIMITADA"
              name="venda_limitada"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <VendaMercado
              close={() => {
                this.props.fecharFormAction(this.props, "venda_mercado");
              }}
              headerTitle="VENDA MERCADO"
              name="venda_mercado"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <VendaStartStop
              close={() => {
                this.props.fecharFormAction(this.props, "venda_startstop");
              }}
              headerTitle="VENDA START STOP"
              name="venda_startstop"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <VendaStopMovel
              close={() => {
                this.props.fecharFormAction(this.props, "venda_stop_movel");
              }}
              headerTitle="VENDA STOP MÓVEL"
              name="venda_stop_movel"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
          {animate(
            this.props,
            <VendaGainReducao
              close={() => {
                this.props.fecharFormAction(this.props, "venda_gainreducao");
              }}
              headerTitle="GAIN / REDUÇÃO DE VENDA"
              name="venda_gainreducao"
              handleShow={event => {
                this.props.abrirFormAction(event, this.props);
              }}
            />
          )}
        </Row>
      </div>
    );
  }
}
