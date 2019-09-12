import React from "react";
import {} from "react-bootstrap";
import iconeAbrirOrdens from "img/iconeAbrirOrdens.png";
import iconeOrdensEmExecucao from "img/iconeOrdensEmExecucao.png";
import iconePosicao from "img/iconePosicao.png";
import iconeRelatorioDetalhado from "img/iconeRelatorioDetalhado.png";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import iconeMultileg from "img/iconeMultileg.png";
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
          <img src={iconeRelatorioDetalhado} alt="Relatório detalhado" />
          <h6>RELATÓRIO DETALHADO DA OPERAÇÃO</h6>
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
        >
          <img src={iconeListaCompleta} alt="Lista completa" />
          <h6>LISTA COMPLETA</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            this.props.atualizarDivKeyAction("multileg");
            this.props.abrirItemBarraLateralAction(
              this.props,
              "multilegAberto"
            );
          }}
        >
          <img src={iconeMultileg} alt="Multileg" />
          <h6>MULTILEG</h6>
        </div>
      </div>
    );
  }
}
