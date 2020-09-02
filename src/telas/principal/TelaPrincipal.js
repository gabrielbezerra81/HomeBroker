import React, { Suspense } from "react";
import { Animate } from "react-show";
import { compose } from "redux";
import { connect } from "react-redux";
// import LogRocket from "logrocket";
import MenuLateralUsuario from "telas/principal/MenuLateralUsuario";
import BarraTopoTelaPrincipal from "telas/principal/BarraTopoTelaPrincipal";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import { listarOrdensExecAction } from "redux/actions/ordensExecucao/OrdensExecActions";
import {
  abrirItemBarraLateralAction,
  checkIfSystemStateHasChangedShapeAction,
} from "redux/actions/system/SystemActions";
import { listarPosicoesAction } from "redux/actions/posicao/PosicaoActions";
import BarraLateral from "telas/principal/BarraLateral";
import MenuOrdens from "telas/principal/MenuOrdens";
import MainScreenTabs from "./MainScreenTabs";

const OrdensExecucao = React.lazy(() =>
  import("telas/popups/ordens_em_execucao/OrdensExecucao"),
);
const Multileg = React.lazy(() => import("telas/popups/multileg_/Multileg"));
const PosicaoEmCustodia = React.lazy(() =>
  import("telas/popups/posicao_custodia/PosicaoEmCustodia"),
);
const RelatorioDetalhado = React.lazy(() =>
  import("telas/popups/relatorio_detalhado/RelatorioDetalhado"),
);
const TelaTHL = React.lazy(() => import("telas/popups/thl/Tela_THL"));

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const margemParaMenuLateral = (isOpenLeftUserMenu) => {
  if (isOpenLeftUserMenu) return "menuLateralAfastado";
  return "";
};

class TelaPrincipal extends React.Component {
  componentDidMount() {
    this.props.listarOrdensExecAction();
    this.props.listarPosicoesAction(this.props);
    this.props.checkIfSystemStateHasChangedShapeAction();

    // LogRocket.identify(this.props.connectedUser, {
    //   name: this.props.connectedUser,
    // });
  }

  render() {
    const { props } = this;
    const {
      zIndex,
      isOpenLeftUserMenu,
      isOpenOrdersExec,
      isOpenDetailedReport,
      isOpenPosition,
      isOpenMultileg,
      isOpenTHL,
    } = props;

    return (
      <div className="divTelaPrincipal">
        <MenuLateralUsuario />
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <BarraLateral />

          <div
            id="menusTelaPrincipal"
            className={margemParaMenuLateral(isOpenLeftUserMenu)}
          >
            <MainScreenTabs>
              <RenderMenus
                menuAberto={isOpenOrdersExec}
                zIndex={zIndex}
                key="ordens_execucao"
                divkey={"ordens_execucao"}
                aumentarZindex={props.aumentarZindexAction}
                component={
                  <OrdensExecucao headerTitle="HISTÓRICO DE OPERAÇÕES" />
                }
              />
              <RenderMenus
                menuAberto={isOpenDetailedReport}
                zIndex={zIndex}
                key="relatorio_detalhado"
                divkey={"relatorio_detalhado"}
                aumentarZindex={props.aumentarZindexAction}
                component={
                  <RelatorioDetalhado headerTitle="RELATÓRIO DETALHADO" />
                }
              />
              <RenderMenus
                menuAberto={isOpenPosition}
                zIndex={zIndex}
                key="posicao_custodia"
                divkey={"posicao_custodia"}
                aumentarZindex={props.aumentarZindexAction}
                component={
                  <PosicaoEmCustodia headerTitle="POSIÇÃO EM CUSTÓDIA" />
                }
              />
              <RenderMenus
                menuAberto={isOpenMultileg}
                zIndex={zIndex}
                key="multileg"
                divkey={"multileg"}
                aumentarZindex={props.aumentarZindexAction}
                component={<Multileg headerTitle="MULTI ATIVOS" />}
              />
              <RenderMenus
                menuAberto={isOpenTHL}
                zIndex={zIndex}
                key="thl"
                divkey={"thl"}
                aumentarZindex={props.aumentarZindexAction}
                component={<TelaTHL headerTitle="THL" />}
              />
            </MainScreenTabs>

            <MenuOrdens />
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
  zIndex: state.GlobalReducer.zIndex,
});

const mapStateToPropsAppPrincipal = (state) => ({
  isOpenOrdersHoverMenu: state.systemReducer.isOpenOrdersHoverMenu,
  isOpenOrdersExec: state.systemReducer.isOpenOrdersExec,
  isOpenDetailedReport: state.systemReducer.isOpenDetailedReport,
  isOpenPosition: state.systemReducer.isOpenPosition,
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
  isOpenMultileg: state.systemReducer.isOpenMultileg,
  isOpenTHL: state.systemReducer.isOpenTHL,
  token: state.systemReducer.token,
  connectedUser: state.systemReducer.connectedUser,
  // Posição
  posicoesCustodia: state.positionReducer.posicoesCustodia,
  arrayPrecos: state.positionReducer.arrayPrecos,
  arrayCotacoes: state.positionReducer.arrayCotacoes,
});

export default compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
    },
    null,
    { context: GlobalContext },
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      abrirItemBarraLateralAction,
      listarOrdensExecAction,
      listarPosicoesAction,
      checkIfSystemStateHasChangedShapeAction,
    },
    null,
    {
      context: StorePrincipalContext,
    },
  ),
)(TelaPrincipal);

/*

<Animate
                show={props.isOpenOrdersExec}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                id="ordens_execucao"
                onClick={() =>
                  props.aumentarZindexAction(
                    "ordens_execucao",
                    props.zIndex,
                    props.isOpenOrdersExec
                  )
                }
              >
                <OrdensExecucaoConectada
         
                  headerTitle="ORDENS EM EXECUÇÃO"
                />
              </Animate>
              <Animate
                show={props.isOpenMultileg}
                duration={100}
                transitionOnMount
                stayMounted={false}
                start={startStyle}
                id="multileg"
                onClick={() =>
                  props.aumentarZindexAction(
                    "multileg",
                    props.zIndex,
                    props.isOpenMultileg
                  )
                }
              >
                <MultilegConectado
      
                  headerTitle="MULTILEG"
                />
              </Animate>


*/
