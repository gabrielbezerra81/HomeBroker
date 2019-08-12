import React from "react";
import {} from "react-bootstrap";
import { connect } from "react-redux";
import iconeAbrirOrdens from "img/iconeAbrirOrdens.png";
import iconeOrdensEmExecucao from "img/iconeOrdensEmExecucao.png";
import iconePosicao from "img/iconePosicao.png";
import iconeRelatorioDetalhado from "img/iconeRelatorioDetalhado.png";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import iconeMultileg from "img/iconeMultileg.png";
import { ocultarDIV, mostrarDIV } from "components/utils/MostrarOcultarDiv";

class BarraLateral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      divOrdens: false
    };
  }

  render() {
    return (
      <div className="divBarraLateral">
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() => {
            if (this.state.divOrdens) ocultarDIV("divOrdens");
            else mostrarDIV("divOrdens");
            this.setState({ divOrdens: !this.state.divOrdens });
          }}
        >
          <img src={iconeAbrirOrdens} alt="Ordens" />
          <h6>ORDENS</h6>
        </div>
        <div tabIndex={0} className="itemDivBarraLateral divClicavel">
          <img src={iconeOrdensEmExecucao} alt="Ordens em execução" />
          <h6>ORDENS EM EXECUÇÃO</h6>
        </div>
        <div tabIndex={0} className="itemDivBarraLateral divClicavel">
          <img src={iconePosicao} alt="Posição" />
          <h6>POSIÇÃO</h6>
        </div>
        <div tabIndex={0} className="itemDivBarraLateral divClicavel">
          <img src={iconeRelatorioDetalhado} alt="Relatório detalhado" />
          <h6>RELATÓRIO DETALHADO DA OPERAÇÃO</h6>
        </div>
        <div tabIndex={0} className="itemDivBarraLateral divClicavel">
          <img src={iconeListaCompleta} alt="Lista completa" />
          <h6>LISTA COMPLETA</h6>
        </div>
        <div tabIndex={0} className="itemDivBarraLateral divClicavel">
          <img src={iconeMultileg} alt="Multileg" />
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
