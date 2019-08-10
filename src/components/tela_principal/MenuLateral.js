import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiaSemana, getDiaEMes } from "components/utils/FormatacoesData";
import { MDBIcon } from "mdbreact";

class MenuLateral extends React.Component {
  render() {
    return (
      <div className="divMenuLateral" id="divMenuLateral">
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
const mapStateToProps = state => ({
  usuarioConectado: state.telaPrincipalReducer.usuarioConectado,
  logado: state.telaPrincipalReducer.logado
});

export default connect(
  mapStateToProps,
  {}
)(MenuLateral);

const renderDivLogin = props => {
  if (props.logado) {
    return (
      <Button variant="" className="itemMenuLateral corAlternada">
        <div>
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
      </Button>
    );
  } else {
    return (
      <Button variant="" className="itemMenuLateral corAlternada">
        <div>
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
      </Button>
    );
  }
};
