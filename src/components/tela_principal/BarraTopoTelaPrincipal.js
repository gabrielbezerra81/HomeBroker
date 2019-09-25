import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import imgCaraFeliz from "img/iconeCaraFeliz.png";
import { abrirFecharMenuLateralAction } from "components/redux/actions/TelaPrincipalActions";
import { ocultarDIV, mostrarDIV } from "components/utils/MostrarOcultarDiv";
import { Animate } from "react-show";
import { ReactComponent as IconeAbrirMenu } from "img/IconeAbrirMenu.svg";
import { ReactComponent as IconeHome } from "img/IconeHome.svg";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

class BarraTopoTelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divBarraTopo">
        <Row>
          <Col md={1}>
            <div
              className="iconesMostrarMenu divClicavel"
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
              <IconeAbrirMenu className="ml-2" fill="#aaa" height="40"></IconeAbrirMenu>
            </div>
          </Col>
          <Col md={0}>
            <IconeHome height="25" fill="#eee"></IconeHome>
          </Col>
          <Col md={1}>
            <h6>HOME</h6>
          </Col>

          <Col md={3}>
            <Animate
              show={this.props.logado}
              duration={100}
              transitionOnMount
              stayMounted
              preMount
              start={startStyle}
            >
              {" "}
              <h6>CONTA: {this.props.usuarioConectado.toUpperCase()}</h6>
            </Animate>
          </Col>
          <Col md={0}>
            <img src={imgCaraFeliz} alt="cara feliz" className="mr-1" />
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
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto,
  logado: state.telaPrincipalReducer.logado
});

export default connect(
  mapStateToProps,
  { abrirFecharMenuLateralAction }
)(BarraTopoTelaPrincipal);
