import React from "react";
import {} from "react-bootstrap";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import { ReactComponent as Icones } from "img/Icones.svg";

/*
<img src={iconeAbrirOrdens} alt="Ordens" />

Icone Ordens

*/

export default class BarraLateral extends React.Component {
  render() {
    return (
      <div className="divBarraLateral">
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onMouseOver={() => {
            this.props.atualizarDivKeyAction("divOrdens");
            this.props.mouseOverAction(this.props, "ordensAberto");
          }}
          onMouseLeave={() =>
            this.props.mouseLeaveAction(this.props, "ordensAberto")
          }
        >
          <Icones viewBox="9 0 41 45" className="iconesBarraLateral"></Icones>
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
          <Icones viewBox="11 97 35 43" className="iconesBarraLateral"></Icones>
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("posicao");
            this.props.abrirItemBarraLateralAction(this.props, "posicaoAberta");
          }}
        >
          <Icones viewBox="5 190 45 52" className="iconesBarraLateral"></Icones>
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
          <Icones viewBox="8 277 41 52" className="iconesBarraLateral"></Icones>
          <h6>HISTÓRICO</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("lista_completa");
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
