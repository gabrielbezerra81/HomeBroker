import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import {
  MainAppConectado,
  OrdensExecucaoConectada,
  BarraLateralConectada,
  MultilegConectado,
  PosicaoEmCustodiaConectada,
  RelatorioDetalhadoConectado
} from "components/redux/ElementosConectadosRedux";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import { Animate } from "react-show";

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
                  headerTitle="HISTÓRICO DE OPERAÇÕES"
                />
              </Animate>
              <Animate
                show={this.props.relatorioDetalhadoAberto}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                onClick={() =>
                  this.props.aumentarZindexAction(
                    "relatorio_detalhado",
                    this.props.zIndex,
                    this.props.relatorioDetalhadoAberto
                  )
                }
              >
                <RelatorioDetalhadoConectado
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "relatorioDetalhadoAberto"
                    );
                  }}
                  headerTitle="RELATÓRIO DETALHADO"
                />
              </Animate>
              <Animate
                show={this.props.listaCompletaAberta}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                onClick={() =>
                  this.props.aumentarZindexAction(
                    "posicao_custodia",
                    this.props.zIndex,
                    this.props.listaCompletaAberta
                  )
                }
              >
                <PosicaoEmCustodiaConectada
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "listaCompletaAberta"
                    );
                  }}
                  headerTitle="POSIÇÃO EM CUSTÓDIA"
                />
              </Animate>
              <Animate
                show={this.props.multilegAberto}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                onClick={() =>
                  this.props.aumentarZindexAction(
                    "multileg",
                    this.props.zIndex,
                    this.props.multilegAberto
                  )
                }
              >
                <MultilegConectado
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "multilegAberto"
                    );
                  }}
                  headerTitle="MULTI ATIVOS"
                />
              </Animate>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/*

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
                id="multileg"
                onClick={() =>
                  this.props.aumentarZindexAction(
                    "multileg",
                    this.props.zIndex,
                    this.props.multilegAberto
                  )
                }
              >
                <MultilegConectado
                  close={() => {
                    this.props.abrirItemBarraLateralAction(
                      this.props,
                      "multilegAberto"
                    );
                  }}
                  headerTitle="MULTILEG"
                />
              </Animate>


*/
