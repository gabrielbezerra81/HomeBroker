import React from "react";
import { connect } from "react-redux";
// import LogRocket from "logrocket";
import MenuLateralUsuario from "screens/home/userLeftSideMenu/UserLeftSideMenu";
import BarraTopoTelaPrincipal from "screens/home/topBar/BarraTopoTelaPrincipal";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  checkIfSystemStateHasChangedShapeAction,
  deslogarUsuarioAction,
} from "redux/actions/system/SystemActions";
import BarraLateral from "screens/home/leftBar/BarraLateral";
import MenuOrdens from "screens/home/boletasHoverMenu/MenuOrdens";
import MainScreenTabs from "./mainScreenTabs/MainScreenTabs";
import PopupContainer from "./PopupContainer";
import { compose } from "redux";
import QuoteBoxContainer from "../popups/quoteBox/QuoteBoxContainer";
import api from "api/apiConfig";
import AddBoxMenu from "../popups/quoteBox/AddBoxMenu";
import RightSideMenu from "./rightSideMenu/RightSideMenu";
import CategoryList from "screens/popups/categoryList/CategoryList";
import InitialPlanner from "screens/popups/financialPlanner/InitialPlanner/InitialPlanner";
import DetailedPlanner from "screens/popups/financialPlanner/DetailedPlanner/DetailedPlanner";

const OrdensExecucao = React.lazy(() =>
  import("screens/popups/ordens_em_execucao/OrdensExecucao")
);
const Multileg = React.lazy(() => import("screens/popups/multileg_/Multileg"));
const PosicaoEmCustodia = React.lazy(() =>
  import("screens/popups/posicao_custodia/PosicaoEmCustodia")
);
const RelatorioDetalhado = React.lazy(() =>
  import("screens/popups/relatorio_detalhado/RelatorioDetalhado")
);
const TelaTHL = React.lazy(() => import("screens/popups/thl/Tela_THL"));

const margemParaMenuLateral = (isOpenLeftUserMenu) => {
  if (isOpenLeftUserMenu) return "menuLateralAfastado";
  return "";
};

class TelaPrincipal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldAlertSessionExpired: false,
      previousShouldAlert: null,
    };
  }

  componentDidMount() {
    this.props.checkIfSystemStateHasChangedShapeAction();

    api.interceptors.response.use(
      function (response) {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          this.setState({
            shouldAlertSessionExpired: true,
            previousShouldAlert: this.state.shouldAlertSessionExpired,
          });
        }
        return Promise.reject(error);
      }
    );

    // LogRocket.identify(this.props.connectedUser, {
    //   name: this.props.connectedUser,
    // });
  }

  componentDidUpdate() {
    const { deslogarUsuarioAction } = this.props;

    if (
      this.state.shouldAlertSessionExpired !== this.state.previousShouldAlert &&
      this.state.shouldAlertSessionExpired
    ) {
      alert("Sua sessão expirou! Faça login novamente.");
      deslogarUsuarioAction();
    }
  }

  render() {
    const {
      isOpenLeftUserMenu,
      isOpenOrdersExec,
      isOpenDetailedReport,
      isOpenPosition,
      isOpenMultileg,
      isOpenTHL,
      isOpenCategoryList,
      isOpenInitialPlanner,
      isOpenDetailedPlanner,
      apps: AppBoletas,
    } = this.props;

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
              <PopupContainer
                isOpen={isOpenOrdersExec}
                key="ordens_execucao"
                divKey={"ordens_execucao"}
              >
                <OrdensExecucao headerTitle="HISTÓRICO DE OPERAÇÕES" />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenPosition}
                key="posicao_custodia"
                divKey={"posicao_custodia"}
              >
                <PosicaoEmCustodia headerTitle="POSIÇÃO EM CUSTÓDIA" />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenDetailedReport}
                key="relatorio_detalhado"
                divKey={"relatorio_detalhado"}
              >
                <RelatorioDetalhado headerTitle="RELATÓRIO DETALHADO" />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenMultileg}
                key="multileg"
                divKey={"multileg"}
              >
                <Multileg headerTitle="MULTI ATIVOS" />
              </PopupContainer>

              <PopupContainer isOpen={isOpenTHL} key="thl" divKey={"thl"}>
                <TelaTHL headerTitle="THL" />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenCategoryList}
                key="category_list"
                divKey="categoryList"
              >
                <CategoryList />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenInitialPlanner}
                key="initialPlanner"
                divKey="initialPlanner"
              >
                <InitialPlanner />
              </PopupContainer>

              <PopupContainer
                isOpen={isOpenDetailedPlanner}
                key="detailedPlanner"
                divKey="detailedPlanner"
              >
                <DetailedPlanner />
              </PopupContainer>
            </MainScreenTabs>

            <RightSideMenu />

            <AddBoxMenu />

            {AppBoletas}

            <MenuOrdens />

            <QuoteBoxContainer />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToPropsGlobalStore = (state) => ({
  apps: state.GlobalReducer.apps,
});

const mapStateToPropsAppPrincipal = (state) => ({
  isOpenOrdersHoverMenu: state.systemReducer.isOpenOrdersHoverMenu,
  isOpenOrdersExec: state.systemReducer.isOpenOrdersExec,
  isOpenDetailedReport: state.systemReducer.isOpenDetailedReport,
  isOpenPosition: state.systemReducer.isOpenPosition,
  isOpenLeftUserMenu: state.systemReducer.isOpenLeftUserMenu,
  isOpenMultileg: state.systemReducer.isOpenMultileg,
  isOpenTHL: state.systemReducer.isOpenTHL,
  isOpenCategoryList: state.systemReducer.isOpenCategoryList,
  isOpenInitialPlanner: state.systemReducer.isOpenInitialPlanner,
  isOpenDetailedPlanner: state.systemReducer.isOpenDetailedPlanner,
});

export default compose(
  connect(mapStateToPropsGlobalStore, {}, null, { context: GlobalContext }),
  connect(
    mapStateToPropsAppPrincipal,
    {
      checkIfSystemStateHasChangedShapeAction,
      deslogarUsuarioAction,
    },
    null,
    {
      context: StorePrincipalContext,
    }
  )
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
