import React from "react";
import "../css";
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

import { Row } from "react-bootstrap";

export default class App extends React.Component {
  componentDidUpdate() {
    if (this.props.divkey !== "")
      document.getElementById(this.props.divkey).style.zIndex =
        this.props.zIndex + 1;
  }

  render() {
    return (
      <div className="App">
        <Row className="appbody">
          {this.props.show[this.props.indiceShow].book ? (
            <div
              id={`book${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `book${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].book
                )
              }
            >
              <BookOfertas
                close={() => {
                  this.props.fecharFormAction(this.props, "book");
                }}
                name="book"
              />
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_agendada ? (
            <div
              id={`compra_agendada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_agendada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_agendada
                )
              }
            >
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
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_limitada ? (
            <div
              id={`compra_limitada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_limitada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_limitada
                )
              }
            >
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
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_mercado ? (
            <div
              id={`compra_mercado${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_mercado${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_mercado
                )
              }
            >
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
            </div>
          ) : null}

          {this.props.show[this.props.indiceShow].compra_startstop ? (
            <div
              id={`compra_startstop${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_startstop${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_startstop
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].compra_startmovel ? (
            <div
              id={`compra_startmovel${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_startmovel${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_startmovel
                )
              }
            >
              <CompraStartMovel
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_startmovel");
                }}
                headerTitle="COMPRA START MÓVEL"
                name="compra_startmovel"
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].compra_gainreducao ? (
            <div
              id={`compra_gainreducao${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `compra_gainreducao${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].compra_gainreducao
                )
              }
            >
              <CompraGainReducao
                close={() => {
                  this.props.fecharFormAction(this.props, "compra_gainreducao");
                }}
                headerTitle="GAIN / REDUÇÃO DE COMPRA"
                name="compra_gainreducao"
              />
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_agendada ? (
            <div
              id={`venda_agendada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_agendada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_agendada
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_limitada ? (
            <div
              id={`venda_limitada${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_limitada${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_limitada
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_mercado ? (
            <div
              id={`venda_mercado${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_mercado${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_mercado
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_startstop ? (
            <div
              id={`venda_startstop${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_startstop${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_startstop
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_stop_movel ? (
            <div
              id={`venda_stop_movel${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_stop_movel${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_stop_movel
                )
              }
            >
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
            </div>
          ) : null}
          {this.props.show[this.props.indiceShow].venda_gainreducao ? (
            <div
              id={`venda_gainreducao${this.props.appkey}`}
              onClick={() =>
                this.props.aumentarZindexAction(
                  `venda_gainreducao${this.props.appkey}`,
                  this.props.zIndex,
                  this.props.show[this.props.indiceShow].venda_gainreducao
                )
              }
            >
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
            </div>
          ) : null}
        </Row>
      </div>
    );
  }
}
