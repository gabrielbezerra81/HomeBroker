import React from "react";
import {} from "react-bootstrap";
import { connect } from "react-redux";
import iconeAbrirOrdens from "img/iconeAbrirOrdens.png";
import iconeOrdensEmExecucao from "img/iconeOrdensEmExecucao.png";
import iconePosicao from "img/iconePosicao.png";
import iconeRelatorioDetalhado from "img/iconeRelatorioDetalhado.png";
import iconeListaCompleta from "img/iconeListaCompleta.png";
import iconeMultileg from "img/iconeMultileg.png";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";

class BarraLateral extends React.Component {
  render() {
    return (
      <div className="divBarraLateral">
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() =>
            this.props.abrirItemBarraLateralAction(this.props, "ordensAberto")
          }
        >
          <img src={iconeAbrirOrdens} alt="Ordens" />
          <h6>ORDENS</h6>
        </div>
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() =>
            this.props.abrirItemBarraLateralAction(
              this.props,
              "ordensExecucaoAberto"
            )
          }
        >
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
        <div
          tabIndex={0}
          className="itemDivBarraLateral divClicavel"
          onClick={() =>
            this.props.abrirItemBarraLateralAction(this.props, "multilegAberto")
          }
        >
          <img src={iconeMultileg} alt="Multileg" />
          <h6>MULTILEG</h6>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  posicaoAberta: state.telaPrincipalReducer.posicaoAberta,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  multilegAberto: state.telaPrincipalReducer.multilegAberto
});

export default connect(
  mapStateToProps,
  { abrirItemBarraLateralAction }
)(BarraLateral);