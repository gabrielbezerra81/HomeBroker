import React from "react";
import {} from "react-bootstrap";
import { connect } from "react-redux";
import iconeAbrirOrdens from "img/iconeAbrirOrdens.png";
import iconeOrdensEmExecucao from "img/iconeOrdensEmExecucao.png";
import iconePosicao from "img/iconePosicao.png";
import iconeRelatorioDetalhado from "img/iconeRelatorioDetalhado.png";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import iconeMultileg from "img/iconeMultileg.png";

class BarraLateral extends React.Component {
  render() {
    return (
      <div className="divBarraLateral">
        <div className="itemDivBarraLateral">
          <img src={iconeAbrirOrdens} />
          <h6>ORDENS</h6>
        </div>
        <div className="itemDivBarraLateral">
          <img src={iconeOrdensEmExecucao} />
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
        <div className="itemDivBarraLateral">
          <img src={iconePosicao} />
          <h6>POSIÇÃO</h6>
        </div>
        <div className="itemDivBarraLateral">
          <img src={iconeRelatorioDetalhado} />
          <h6>RELATÓRIO DETALHADO DA OPERAÇÃO</h6>
        </div>
        <div className="itemDivBarraLateral">
          <img src={iconeListaCompleta} />
          <h6>LISTA COMPLETA</h6>
        </div>
        <div className="itemDivBarraLateral">
          <img src={iconeMultileg} />
          <h6>MULTILEG</h6>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(BarraLateral);
