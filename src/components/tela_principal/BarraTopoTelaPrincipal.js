import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import imgCaraFeliz from "img/iconeCaraFeliz.png";
import { abrirFecharMenuLateralAction } from "components/redux/actions/TelaPrincipalActions";
import { ocultarDIV, mostrarDIV } from "components/utils/MostrarOcultarDiv";

class BarraTopoTelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divBarraTopo">
        <Row>
          <Col md={1}>
            <Button
              variant=""
              className="iconesMostrarMenu"
              onClick={event => {
                if (this.props.menuLateralAberto === true) {
                  this.props.abrirFecharMenuLateralAction(
                    event,
                    this.props.menuLateralAberto
                  );
                  return ocultarDIV("divMenuLateral");
                } else {
                  this.props.abrirFecharMenuLateralAction(
                    event,
                    this.props.menuLateralAberto
                  );
                  return mostrarDIV("divMenuLateral");
                }
              }}
            >
              <span className="fa-stack">
                <MDBIcon
                  far
                  icon="circle"
                  className="fa-stack-2x iconeCirculo"
                />
                <MDBIcon
                  icon="ellipsis-h"
                  className="fa-stack-1x iconeCirculo"
                />
              </span>
            </Button>
          </Col>
          <Col md={0}>
            <MDBIcon icon="home" className="iconeHome" />
          </Col>
          <Col md={1}>
            <h6>HOME</h6>
          </Col>

          <Col md={3}>
            <h6>CONTA: {this.props.usuarioConectado.toUpperCase()}</h6>
          </Col>
          <Col md={0}>
            <img src={imgCaraFeliz} />
          </Col>
          <Col md={0}>
            <h6 className="">VALOR LIQUIDO:</h6>
          </Col>
          <Col md={2}>
            <h6 className="valorLiquido">{this.props.valorLiquido} R$</h6>
          </Col>
          <Col md={0}>
            <h6>COMPRAR:</h6>
          </Col>
          <Col>
            <h6 className="valorComprar">{this.props.valorComprar} R$</h6>
          </Col>
          <Col md={0}>
            <h4>{this.props.ativo}</h4>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  usuarioConectado: state.telaPrincipalReducer.usuarioConectado,
  valorLiquido: state.telaPrincipalReducer.valorLiquido,
  valorComprar: state.telaPrincipalReducer.valorComprar,
  ativo: state.telaPrincipalReducer.ativo,
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto
});

export default connect(
  mapStateToProps,
  { abrirFecharMenuLateralAction }
)(BarraTopoTelaPrincipal);
