import React from "react";
import { connect } from "react-redux";
// import LogRocket from "logrocket";
import MenuLateralUsuario from "./userLeftSideMenu/UserLeftSideMenu";
import BarraTopoTelaPrincipal from "./topBar/topBar";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  checkIfSystemStateHasChangedShapeAction,
  deslogarUsuarioAction,
} from "redux/actions/system/SystemActions";
import LeftActionBar from "./leftActionBar/LeftActionBar";
import MenuOrdens from "./boletasHoverMenu/MenuOrdens";
import MainScreenTabs from "./mainScreenTabs/MainScreenTabs";
import PopupContainer from "./PopupContainer";
import { compose } from "redux";
import TabBarHoverMenu from "./tabBarHoverMenu/TabBarHoverMenu";
import RightSideMenu from "./rightSideMenu/RightSideMenu";
import CategoryList from "modules/categoryList/screens/CategoryList";
import InitialPlanner from "modules/financialPlanner/screens/initialPlanner/InitialPlanner";
import DetailedPlanner from "modules/financialPlanner/screens/detailedPlanner/DetailedPlanner";
import MultiBoxContainer from "modules/multiBox/screens/MultiBoxContainer";
import OptionsTable from "modules/optionsTable/screens/OptionsTable";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { Redirect } from "@reach/router";

const OrdensExecucao = React.lazy(() =>
  import("modules/ordersExec/screens/OrdensExecucao"),
);
const Multileg = React.lazy(() => import("modules/multileg/screens/Multileg"));
const Position = React.lazy(() => import("modules/position/screens/Position"));
const RelatorioDetalhado = React.lazy(() =>
  import("modules/history/screens/RelatorioDetalhado"),
);
const TelaTHL = React.lazy(() => import("modules/thl/screens/Tela_THL"));

const margemParaMenuLateral = (isOpenLeftUserMenu) => {
  if (isOpenLeftUserMenu) return "menuLateralAfastado";
  return "";
};

class Home extends React.Component {
  componentDidMount() {
    this.props.checkIfSystemStateHasChangedShapeAction();

    // api.interceptors.response.use(
    //   function (response) {
    //     return response;
    //   },
    //   (error) => {
    //     if (error.response.status === 401) {
    //       this.setState({
    //         shouldAlertSessionExpired: true,
    //         previousShouldAlert: this.state.shouldAlertSessionExpired,
    //       });
    //     }
    //     return Promise.reject(error);
    //   },
    // );

    // LogRocket.identify(this.props.connectedUser, {
    //   name: this.props.connectedUser,
    // });
  }

  componentDidUpdate() {
    // const { deslogarUsuarioAction } = this.props;
    // if (
    //   this.state.shouldAlertSessionExpired !== this.state.previousShouldAlert &&
    //   this.state.shouldAlertSessionExpired
    // ) {
    //   alert("Sua sessão expirou! Faça login novamente.");
    //   deslogarUsuarioAction();
    // }
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
      isOpenOptionsTable,
      apps: AppBoletas,
    } = this.props;

    return (
      <div className="divTelaPrincipal">
        <MenuLateralUsuario />
        <div className="conteudoMenuPrincipal">
          <BarraTopoTelaPrincipal />
          <LeftActionBar />

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
                <Position headerTitle="POSIÇÃO EM CUSTÓDIA" />
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

              <PopupContainer
                isOpen={isOpenOptionsTable}
                divKey="optionsTable"
                key="optionsTable"
              >
                <OptionsTable />
              </PopupContainer>
            </MainScreenTabs>

            <RightSideMenu />

            <TabBarHoverMenu />

            {AppBoletas}

            <MenuOrdens />

            <MultiBoxContainer />
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
  isOpenOptionsTable: state.systemReducer.isOpenOptionsTable,
});

const ConnectedHome = compose(
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
    },
  ),
)(Home);

const SecuredHome = ({ path }) => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  if (isLogged) return <ConnectedHome />;

  return <Redirect to="/" noThrow />;
};

export default SecuredHome;

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
