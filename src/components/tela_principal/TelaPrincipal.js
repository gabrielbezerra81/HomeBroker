import React from "react";
import MenuLateral from "components/tela_principal/MenuLateral";
import {
  MainAppConectado,
  OrdensExecucaoConectada,
  BarraLateralConectada,
  MultilegConectado,
  PosicaoEmCustodiaConectada,
  RelatorioDetalhadoConectado,
  TelaTHLConectada
} from "components/redux/ElementosConectadosRedux";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import { Animate } from "react-show";

const startStyle = {
  opacity: 0,
  pointerEvents: "none"
};

export default class TelaPrincipal extends React.Component {
  render() {
    const { props } = this;
    return (
      <div>
        <div className="divTelaPrincipal">
          <MenuLateral />
          <div className="conteudoMenuPrincipal">
            <BarraTopoTelaPrincipal />
            <div style={{ display: "flex", height: "100%" }}>
              <BarraLateralConectada />
              <div id="menusTelaPrincipal">
                <MainAppConectado />
                <Animate
                  show={props.ordensExecucaoAberto}
                  duration={100}
                  transitionOnMount
                  stayMounted={false}
                  start={startStyle}
                  onClick={() =>
                    props.aumentarZindexAction(
                      "ordens_execucao",
                      props.zIndex,
                      props.ordensExecucaoAberto
                    )
                  }
                >
                  <OrdensExecucaoConectada
                    close={() => {
                      props.abrirItemBarraLateralAction(
                        props,
                        "ordensExecucaoAberto"
                      );
                    }}
                    headerTitle="HISTÓRICO DE OPERAÇÕES"
                  />
                </Animate>
                <Animate
                  show={props.relatorioDetalhadoAberto}
                  duration={100}
                  transitionOnMount
                  stayMounted={false}
                  start={startStyle}
                  onClick={() =>
                    props.aumentarZindexAction(
                      "relatorio_detalhado",
                      props.zIndex,
                      props.relatorioDetalhadoAberto
                    )
                  }
                >
                  <RelatorioDetalhadoConectado
                    close={() => {
                      props.abrirItemBarraLateralAction(
                        props,
                        "relatorioDetalhadoAberto"
                      );
                    }}
                    headerTitle="RELATÓRIO DETALHADO"
                  />
                </Animate>
                <Animate
                  show={props.listaCompletaAberta}
                  duration={100}
                  transitionOnMount
                  stayMounted={false}
                  start={startStyle}
                  onClick={() =>
                    props.aumentarZindexAction(
                      "posicao_custodia",
                      props.zIndex,
                      props.listaCompletaAberta
                    )
                  }
                >
                  <PosicaoEmCustodiaConectada
                    close={() => {
                      props.abrirItemBarraLateralAction(
                        props,
                        "listaCompletaAberta"
                      );
                    }}
                    headerTitle="POSIÇÃO EM CUSTÓDIA"
                  />
                </Animate>
                <Animate
                  show={props.multilegAberto}
                  duration={100}
                  transitionOnMount
                  stayMounted={false}
                  start={startStyle}
                  onClick={() =>
                    props.aumentarZindexAction(
                      "multileg",
                      props.zIndex,
                      props.multilegAberto
                    )
                  }
                >
                  <MultilegConectado
                    close={() => {
                      props.abrirItemBarraLateralAction(
                        props,
                        "multilegAberto"
                      );
                    }}
                    headerTitle="MULTI ATIVOS"
                  />
                </Animate>
                {/* THL */}
                <Animate
                  show={props.thlAberta}
                  duration={100}
                  transitionOnMount
                  stayMounted={false}
                  start={startStyle}
                  onClick={() =>
                    props.aumentarZindexAction(
                      "thl",
                      props.zIndex,
                      props.thlAberta
                    )
                  }
                >
                  <TelaTHLConectada
                    close={() => {
                      props.abrirItemBarraLateralAction(props, "thlAberta");
                    }}
                    headerTitle="VENCIMENTOS"
                  />
                </Animate>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/*

<Animate
                show={props.ordensExecucaoAberto}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                id="ordens_execucao"
                onClick={() =>
                  props.aumentarZindexAction(
                    "ordens_execucao",
                    props.zIndex,
                    props.ordensExecucaoAberto
                  )
                }
              >
                <OrdensExecucaoConectada
                  close={() => {
                    props.abrirItemBarraLateralAction(
                      props,
                      "ordensExecucaoAberto"
                    );
                  }}
                  headerTitle="ORDENS EM EXECUÇÃO"
                />
              </Animate>
              <Animate
                show={props.multilegAberto}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                id="multileg"
                onClick={() =>
                  props.aumentarZindexAction(
                    "multileg",
                    props.zIndex,
                    props.multilegAberto
                  )
                }
              >
                <MultilegConectado
                  close={() => {
                    props.abrirItemBarraLateralAction(
                      props,
                      "multilegAberto"
                    );
                  }}
                  headerTitle="MULTILEG"
                />
              </Animate>


*/
