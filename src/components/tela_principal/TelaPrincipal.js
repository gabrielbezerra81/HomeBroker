import React from "react";
import { Animate } from "react-show";
import MenuLateralUsuario from "components/tela_principal/MenuLateralUsuario";
import {
  MenuOrdensConectado,
  OrdensExecucaoConectada,
  BarraLateralConectada,
  MultilegConectado,
  PosicaoEmCustodiaConectada,
  RelatorioDetalhadoConectado,
} from "components/redux/ElementosConectadosRedux";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import TelaTHLConectada from "components/forms/thl/Tela_THL";

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

export default class TelaPrincipal extends React.Component {
  render() {
    const { props } = this;
    return (
      <div>
        <div className="divTelaPrincipal">
          <MenuLateralUsuario />
          <div className="conteudoMenuPrincipal">
            <BarraTopoTelaPrincipal />
            <div style={{ display: "flex", height: "100%" }}>
              <BarraLateralConectada />
              <div id="menusTelaPrincipal">
                <MenuOrdensConectado />
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
                  <OrdensExecucaoConectada headerTitle="HISTÓRICO DE OPERAÇÕES" />
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
                  <RelatorioDetalhadoConectado headerTitle="RELATÓRIO DETALHADO" />
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
                  <PosicaoEmCustodiaConectada headerTitle="POSIÇÃO EM CUSTÓDIA" />
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
                  <MultilegConectado headerTitle="MULTI ATIVOS" />
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
                  <TelaTHLConectada headerTitle="THL" />
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
      
                  headerTitle="MULTILEG"
                />
              </Animate>


*/
