import React, { Suspense } from "react";
import { Animate } from "react-show";
import { compose } from "redux";
import { connect } from "react-redux";
import LogRocket from "logrocket";
import MenuLateralUsuario from "components/tela_principal/MenuLateralUsuario";
import BarraTopoTelaPrincipal from "components/tela_principal/BarraTopoTelaPrincipal";
import {
  StorePrincipalContext,
  GlobalContext,
} from "components/redux/StoreCreation";
import { aumentarZindexAction } from "components/redux/actions/MainAppActions";
import { listarOrdensExecAction } from "components/redux/actions/menu_actions/OrdensExecActions";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import { listarPosicoesAction } from "components/redux/actions/menu_actions/PosicaoActions";
import BarraLateral from "components/tela_principal/BarraLateral";
import MenuOrdens from "components/tela_principal/MenuOrdens";

const OrdensExecucao = React.lazy(() =>
  import("components/forms/ordens_em_execucao/OrdensExecucao")
);
const Multileg = React.lazy(() =>
  import("components/forms/multileg_/Multileg")
);
const PosicaoEmCustodia = React.lazy(() =>
  import("components/forms/posicao_custodia/PosicaoEmCustodia")
);
const RelatorioDetalhado = React.lazy(() =>
  import("components/forms/relatorio_detalhado/RelatorioDetalhado")
);
const TelaTHL = React.lazy(() => import("components/forms/thl/Tela_THL"));

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const margemParaMenuLateral = (menuLateralAberto) => {
  if (menuLateralAberto) return "menuLateralAfastado";
  return "";
};

class TelaPrincipal extends React.Component {
  componentDidMount() {
    this.props.listarOrdensExecAction(this.props);
    this.props.listarPosicoesAction(this.props);

    LogRocket.identify(this.props.usuarioConectado, {
      name: this.props.usuarioConectado,
    });
  }

  render() {
    const { props } = this;
    const {
      zIndex,
      menuLateralAberto,
      ordensExecucaoAberto,
      relatorioDetalhadoAberto,
      listaCompletaAberta,
      multilegAberto,
      thlAberta,
    } = props;
    return (
      <div>
        <div className="divTelaPrincipal">
          <MenuLateralUsuario />
          <div className="conteudoMenuPrincipal">
            <BarraTopoTelaPrincipal />
            <div style={{ display: "flex", height: "100%" }}>
              <BarraLateral />
              <div
                id="menusTelaPrincipal"
                className={margemParaMenuLateral(menuLateralAberto)}
              >
                <MenuOrdens />

                <RenderMenus
                  menuAberto={ordensExecucaoAberto}
                  zIndex={zIndex}
                  divkey={"ordens_execucao"}
                  aumentarZindex={props.aumentarZindexAction}
                  component={
                    <OrdensExecucao headerTitle="HISTÓRICO DE OPERAÇÕES" />
                  }
                />

                <RenderMenus
                  menuAberto={relatorioDetalhadoAberto}
                  zIndex={zIndex}
                  divkey={"relatorio_detalhado"}
                  aumentarZindex={props.aumentarZindexAction}
                  component={
                    <RelatorioDetalhado headerTitle="RELATÓRIO DETALHADO" />
                  }
                />

                <RenderMenus
                  menuAberto={listaCompletaAberta}
                  zIndex={zIndex}
                  divkey={"posicao_custodia"}
                  aumentarZindex={props.aumentarZindexAction}
                  component={
                    <PosicaoEmCustodia headerTitle="POSIÇÃO EM CUSTÓDIA" />
                  }
                />

                <RenderMenus
                  menuAberto={multilegAberto}
                  zIndex={zIndex}
                  divkey={"multileg"}
                  aumentarZindex={props.aumentarZindexAction}
                  component={<Multileg headerTitle="MULTI ATIVOS" />}
                />

                {/* THL */}
                <RenderMenus
                  menuAberto={thlAberta}
                  zIndex={zIndex}
                  divkey={"thl"}
                  aumentarZindex={props.aumentarZindexAction}
                  component={<TelaTHL headerTitle="THL" />}
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
  component,
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
        {component}
      </Animate>
    </Suspense>
  );
};

const mapStateToPropsGlobalStore = (state) => ({
  zIndex: state.MainAppReducer.zIndex,
});

const mapStateToPropsAppPrincipal = (state) => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  menuLateralAberto: state.telaPrincipalReducer.menuLateralAberto,
  multilegAberto: state.telaPrincipalReducer.multilegAberto,
  thlAberta: state.telaPrincipalReducer.thlAberta,
  token: state.telaPrincipalReducer.token,
  usuarioConectado: state.telaPrincipalReducer.usuarioConectado,
  // Posição
  posicoesCustodia: state.posicaoReducer.posicoesCustodia,
  arrayPrecos: state.posicaoReducer.arrayPrecos,
  arrayCotacoes: state.posicaoReducer.arrayCotacoes,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      abrirItemBarraLateralAction,
      listarOrdensExecAction,
      listarPosicoesAction,
    },
    null,
    {
      context: StorePrincipalContext,
    }
  )
)(TelaPrincipal);

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
