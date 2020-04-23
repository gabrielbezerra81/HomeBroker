import React, { Suspense } from "react";
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
// import TelaTHLConectada from "components/forms/thl/Tela_THL";
const TelaTHLConectada = React.lazy(() =>
  import("components/forms/thl/Tela_THL")
);

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const margemParaMenuLateral = (menuLateralAberto) => {
  if (menuLateralAberto) return "menuLateralAfastado";
  return "";
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
              <div
                id="menusTelaPrincipal"
                className={margemParaMenuLateral(props.menuLateralAberto)}
              >
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
                <RenderMenus
                  menuAberto={props.thlAberta}
                  zIndex={props.zIndex}
                  divkey={"thl"}
                  aumentarZindex={props.aumentarZindexAction}
                  headerTitle="THL"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RenderMenus = ({
  menuAberto,
  zIndex,
  divkey,
  aumentarZindex,
  headerTitle,
}) => {
  return (
    <Suspense fallback={null}>
      <Animate
        show={menuAberto}
        duration={100}
        transitionOnMount
        stayMounted={false}
        start={startStyle}
        onClick={() => aumentarZindex(divkey, zIndex, menuAberto)}
      >
        <TelaTHLConectada headerTitle={headerTitle} />
      </Animate>
    </Suspense>
  );
};

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
