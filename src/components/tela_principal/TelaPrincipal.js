import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";

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
            <OrdensExecucao
              /*close={() => {
                this.props.fecharFormAction(this.props, "compra_agendada");
              }}*/
              headerTitle="ORDENS EM EXECUÇÃO"
              name="ordens_execucao"
            />
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
