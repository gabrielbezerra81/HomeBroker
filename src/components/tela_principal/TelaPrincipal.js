import React from "react";
import { Row, Col } from "react-bootstrap";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";

class TelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divTelaPrincipal">
        <MenuLateral />
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <div style={{ display: "flex", height: "100%" }}>
            <BarraLateral />
            <MainAppConectado />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(TelaPrincipal);
