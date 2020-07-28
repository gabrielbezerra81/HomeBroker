import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiaSemana, getDiaEMes } from "components/utils/Formatacoes";
import { MDBIcon } from "mdbreact";
import { deslogarUsuarioAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";
import { StorePrincipalContext } from "redux/StoreCreation";

class MenuLateralUsuario extends React.Component {
  render() {
    const { menuLateralAberto } = this.props;
    return (
      <div
        className={`divMenuLateral${visibilidade(menuLateralAberto)}`}
        id="divMenuLateral"
      >
        <div className="itemMenuLateral corAlternada">
          <h6>Menu</h6>
        </div>
        <div className="itemMenuLateral">
          <Row>
            <Col>
              <h6>{this.props.usuarioConectado}</h6>
            </Col>
          </Row>
        </div>
        {renderDivLogin(this.props)}
        <div className="itemMenuLateral">
          <h6>
            {getDiaSemana()}
            <br /> {getDiaEMes()}
          </h6>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  usuarioConectado: state.telaPrincipalReducer.usuarioConectado,
  logado: state.telaPrincipalReducer.logado,
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto,
  // Ordens Exec reativa
  eventSourceOrdensExec_OrdensExec:
    state.ordensExecReducer.eventSourceOrdensExec,
  // Posicao Reativa
  eventSourcePosicao_Posicao: state.posicaoReducer.eventSourcePosicao,
  eventSourceEmblema_Posicao: state.posicaoReducer.eventSourceEmblema,
  eventSourceCotacoes_Posicao: state.posicaoReducer.eventSourceCotacoes,
  setIntervalEmblema_Posicao: state.posicaoReducer.setIntervalEmblema,
  setIntervalCotacoes_Posicao: state.posicaoReducer.setIntervalCotacoesPosicao,
  // Multileg Reativo:
  eventSourceCotacao_Multileg: state.multilegReducer.eventSourceCotacao,
  setIntervalCotacoes_Multileg:
    state.multilegReducer.setIntervalCotacoesMultileg,
  eventSourcePrecos_THL: state.THLReducer.eventSourcePrecos,
  setIntervalPrecos_THL: state.THLReducer.setIntervalPrecosTHL,
});

export default connect(
  mapStateToProps,
  {
    deslogarUsuarioAction,
  },
  null,
  { context: StorePrincipalContext }
)(MenuLateralUsuario);

const renderDivLogin = (props) => {
  if (props.logado) {
    return (
      <div
        className="divClicavel itemMenuLateral corAlternada"
        onClick={() => props.deslogarUsuarioAction(props)}
        tabIndex={0}
      >
        <Row className="botaoDeslogar">
          <Col md={"0"} className="colLogout">
            <MDBIcon icon="power-off" className="iconeDeslogar" />
          </Col>
          <Col md={4} className="colLogout">
            <h6>LOGOUT</h6>
          </Col>
        </Row>
        <Row>
          <Col md={"0"} className="colLogout">
            <MDBIcon
              icon="circle"
              className="iconeStatusCirculo iconeStatusConectado"
            />
          </Col>
          <Col md={4} className="colLogout">
            <h6 className="textoConectado">CONECTADO</h6>
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div
        tabIndex={0}
        className="divClicavel itemMenuLateral corAlternada"
        onClick={() => props.deslogarUsuarioAction(props)}
      >
        <Row className="botaoDeslogar">
          <Col md={"0"} className="colLogout">
            <MDBIcon icon="power-off" className="iconeDeslogar" />
          </Col>
          <Col md={3} className="colLogout">
            <h6>LOGIN</h6>
          </Col>
        </Row>
        <Row>
          <Col md={"0"} className="colLogout">
            <MDBIcon
              icon="circle"
              className="iconeStatusCirculo iconeStatusDesconectado"
            />
          </Col>
          <Col md={4} className="colLogout">
            <h6 className="textoConectado">DESCONECTADO</h6>
          </Col>
        </Row>
      </div>
    );
  }
};

const visibilidade = (menuAberto) => {
  if (menuAberto) return " visible";
  return " hide";
};
