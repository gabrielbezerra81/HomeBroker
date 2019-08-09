import React from "react";
import {} from "react-bootstrap";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";

class TelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divTelaPrincipal">
        {this.props.menuLateralAberto ? <MenuLateral /> : null}
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <MainAppConectado />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto
});

export default connect(
  mapStateToProps,
  {}
)(TelaPrincipal);
