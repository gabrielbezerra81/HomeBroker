import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import { connect } from "react-redux";
import { MainAppConectado } from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";
import { Animate } from "react-show";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import Multileg from "components/forms/multileg_/Multileg";

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
            <div>
              <Animate
                show={this.props.ordensAberto}
                duration={250}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
              >
                <MainAppConectado />
              </Animate>
              <Animate
                show={this.props.ordensExecucaoAberto}
                duration={250}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
              >
                <OrdensExecucao
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "ordensExecucaoAberto"
                    );
                  }}
                  headerTitle="ORDENS EM EXECUÇÃO"
                />
              </Animate>
              <Animate
                show={this.props.multilegAberto}
                duration={250}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
              >
                <Multileg
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "multilegAberto"
                    );
                  }}
                  headerTitle="MULTILEG"
                />
              </Animate>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  posicaoAberta: state.telaPrincipalReducer.posicaoAberta,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  multilegAberto: state.telaPrincipalReducer.multilegAberto
});

export default connect(
  mapStateToProps,
  { abrirItemBarraLateralAction }
)(TelaPrincipal);
