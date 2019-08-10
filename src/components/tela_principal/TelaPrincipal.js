import React from "react";
import { Row, Col } from "react-bootstrap";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";
import iconeCompra from "img/IconeCompra.png";
import iconeCompra2 from "img/iconeCompra2.png";
import iconeCompra3 from "img/iconeCompra3.png";
import iconeCompra4 from "img/iconeCompra4.png";
import iconeCompra5 from "img/iconeCompra5.png";
import iconeCompra6 from "img/iconeCompra6.png";
import iconeVenda from "img/iconeVenda.png";
import iconeVenda2 from "img/iconeVenda2.png";
import iconeVenda3 from "img/iconeVenda3.png";
import iconeVenda4 from "img/iconeVenda4.png";
import iconeVenda5 from "img/iconeVenda5.png";
import iconeVenda6 from "img/iconeVenda6.png";

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
