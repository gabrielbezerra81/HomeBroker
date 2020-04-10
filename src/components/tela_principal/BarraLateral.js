import React from "react";
import {} from "react-bootstrap";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import { ReactComponent as Icones } from "img/IconesBarraLateral.svg";

/*
<img src={iconeAbrirOrdens} alt="Ordens" />

Icone Ordens

*/

export default class BarraLateral extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="divBarraLateral" id="divBarraLateral">
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={(event) => {
            this.props.abrirFormAction(event, this.props);
          }}
          data-name="book"
        >
          <Icones viewBox="9 0 36 39" className="iconesBarraLateral"></Icones>
          <h6>BOOK</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("thl");
            this.props.abrirItemBarraLateralAction(this.props, "thlAberta");
          }}
        >
          <Icones viewBox="7 70 42 49" className="iconesBarraLateral"></Icones>
          <h6>ANÁLISE</h6>
        </div>

        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onMouseOver={() => {
            this.props.atualizarDivKeyAction("divOrdens");

            if (!props.ordensAberto)
              this.props.mouseOverAction(this.props, "ordensAberto");
          }}
          onMouseLeave={() => {
            if (props.ordensAberto)
              this.props.mouseLeaveAction(this.props, "ordensAberto");
          }}
        >
          <Icones
            viewBox="11 145 41 45"
            className="iconesBarraLateral"
          ></Icones>
          <h6>ORDENS</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("ordens_execucao");
            this.props.abrirItemBarraLateralAction(
              this.props,
              "ordensExecucaoAberto"
            );
          }}
        >
          <Icones
            viewBox="11 233 36 43"
            className="iconesBarraLateral"
          ></Icones>
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("posicao_custodia");
            this.props.abrirItemBarraLateralAction(
              this.props,
              "listaCompletaAberta"
            );
          }}
        >
          <Icones viewBox="5 326 41 52" className="iconesBarraLateral"></Icones>
          <h6>POSIÇÃO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("relatorio_detalhado");
            this.props.abrirItemBarraLateralAction(
              this.props,
              "relatorioDetalhadoAberto"
            );
          }}
        >
          <Icones viewBox="8 407 41 52" className="iconesBarraLateral"></Icones>
          <h6>HISTÓRICO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("posicao_custodia");
            this.props.abrirItemBarraLateralAction(
              this.props,
              "listaCompletaAberta"
            );
          }}
          style={{ display: "none" }}
        >
          <img src={iconeListaCompleta} alt="Lista completa" />
          <h6>LISTA COMPLETA</h6>
        </div>
      </div>
    );
  }
}
