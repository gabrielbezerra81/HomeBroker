import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";
import { Animate, easings } from "react-show";
import { abrirFecharOrdensExecucaoAction } from "components/redux/actions/TelaPrincipalActions";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

class TelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divTelaPrincipal">
        <MenuLateral />
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <div style={{ display: "flex", height: "100%" }}>
            <BarraLateral />
            <Animate
              show={this.props.ordensAberto}
              duration={250}
              transitionOnMount
              start={startStyle}
              stayMounted={false}
            >
              <MainAppConectado />
            </Animate>
            <Animate
              show={this.props.ordensExecucaoAberto}
              duration={250}
              transitionOnMount
              stayMounted
              preMount
              start={startStyle}
              className="animateDiv"
            >
              <OrdensExecucao
                close={event => {
                  this.props.abrirFecharOrdensExecucaoAction(
                    event,
                    this.props.ordensExecucaoAberto
                  );
                }}
                headerTitle="ORDENS EM EXECUÇÃO"
                name="ordens_execucao"
              />
            </Animate>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto
});

export default connect(
  mapStateToProps,
  { abrirFecharOrdensExecucaoAction }
)(TelaPrincipal);
