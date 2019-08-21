import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import {
  MainAppConectado,
  OrdensExecucaoConectada,
  BarraLateralConectada
} from "MainApp";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import BarraLateral from "components/tela_principal/BarraLateral";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";
import { Animate } from "react-show";
import Multileg from "components/forms/multileg_/Multileg";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

export default class TelaPrincipal extends React.Component {
  render() {
    return (
      <div className="divTelaPrincipal">
        <MenuLateral />
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <div style={{ display: "flex", height: "100%" }}>
            <BarraLateralConectada />
            <div>
              <MainAppConectado />
              <Animate
                show={this.props.ordensExecucaoAberto}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                id="ordens_execucao"
                onClick={() =>
                  this.props.aumentarZindexAction(
                    "ordens_execucao",
                    this.props.zIndex,
                    this.props.ordensExecucaoAberto
                  )
                }
              >
                <OrdensExecucaoConectada
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
                duration={100}
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
