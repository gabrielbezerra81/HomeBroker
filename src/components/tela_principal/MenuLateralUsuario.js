import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiaSemana, getDiaEMes } from "components/utils/Formatacoes";
import { MDBIcon } from "mdbreact";
import {
  logarUsuarioAction,
  deslogarUsuarioAction,
} from "components/redux/actions/TelaPrincipalActions";
import { StorePrincipalContext } from "components/redux/StoreCreation";

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
});

export default connect(
  mapStateToProps,
  {
    logarUsuarioAction,
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
        onClick={(event) => props.deslogarUsuarioAction(event, props)}
        tabIndex={0}
      >
        <Row className="botaoDeslogar">
          <Col md={0} className="colLogout">
            <MDBIcon icon="power-off" className="iconeDeslogar" />
          </Col>
          <Col md={4} className="colLogout">
            <h6>LOGOUT</h6>
          </Col>
        </Row>
        <Row>
          <Col md={0} className="colLogout">
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
        onClick={(event) => props.deslogarUsuarioAction(event, props)}
      >
        <Row className="botaoDeslogar">
          <Col md={0} className="colLogout">
            <MDBIcon icon="power-off" className="iconeDeslogar" />
          </Col>
          <Col md={3} className="colLogout">
            <h6>LOGIN</h6>
          </Col>
        </Row>
        <Row>
          <Col md={0} className="colLogout">
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
