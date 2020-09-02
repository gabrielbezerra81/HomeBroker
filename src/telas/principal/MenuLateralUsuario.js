import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiaSemana, getDiaEMes } from "shared/utils/Formatacoes";
import { MDBIcon } from "mdbreact";
import { deslogarUsuarioAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";
import { StorePrincipalContext } from "redux/StoreCreation";

class MenuLateralUsuario extends React.Component {
  render() {
    const { isOpenLeftUserMenu } = this.props;
    return (
      <div
        className={`divMenuLateral${visibilidade(isOpenLeftUserMenu)}`}
        id="divMenuLateral"
      >
        <div className="itemMenuLateral corAlternada">
          <h6>Menu</h6>
        </div>
        <div className="itemMenuLateral">
          <Row>
            <Col>
              <h6>{this.props.connectedUser}</h6>
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
  connectedUser: state.systemReducer.connectedUser,
  isLogged: state.systemReducer.isLogged,
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
  // Ordens Exec reativa
  eventSourceOrdensExec_OrdensExec:
    state.ordersExecReducer.eventSourceOrdensExec,
  // Posicao Reativa
  eventSourcePosicao_Posicao: state.positionReducer.eventSourcePosicao,
  eventSourceEmblema_Posicao: state.positionReducer.eventSourceEmblema,
  eventSourceCotacoes_Posicao: state.positionReducer.eventSourceCotacoes,
  setIntervalEmblema_Posicao: state.positionReducer.setIntervalEmblema,
  setIntervalCotacoes_Posicao: state.positionReducer.setIntervalCotacoesPosicao,
  // Multileg Reativo:
  eventSourceCotacao_Multileg: state.multilegReducer.eventSourceCotacao,
  setIntervalCotacoes_Multileg:
    state.multilegReducer.setIntervalCotacoesMultileg,
  eventSourcePrecos_THL: state.thlReducer.eventSourcePrecos,
  setIntervalPrecos_THL: state.thlReducer.setIntervalPrecosTHL,
});

export default connect(
  mapStateToProps,
  {
    deslogarUsuarioAction,
  },
  null,
  { context: StorePrincipalContext },
)(MenuLateralUsuario);

const renderDivLogin = (props) => {
  if (props.isLogged) {
    return (
      <div
        className="divClicavel itemMenuLateral corAlternada"
        onClick={() => props.deslogarUsuarioAction(props)}
        tabIndex={0}
      >
        <div className="flexCenterCenter">
          <MDBIcon icon="power-off" className="iconeDeslogar" />
          <h6 className="textoLogout">LOGOUT</h6>
        </div>
        <div className="flexCenterCenter">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusConectado"
          />
          <h6 className="textoConectado">CONECTADO</h6>
        </div>
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
