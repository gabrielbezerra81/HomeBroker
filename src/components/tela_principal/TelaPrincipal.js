import React from "react";
import {} from "react-bootstrap";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";

class TelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divTelaPrincipal">
        {this.props.menuLateralAberto ? <MenuLateral /> : null}
        <div className="conteudoMenuPrincipal" />
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
