import React from "react";
import { Provider, connect } from "react-redux";
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { MainApp, SubApp } from "MainApp";
import App from "components/App";
import { modalHeader } from "components/utils/FormHeader";
import MainAppReducer from "components/redux/reducers/MainAppReducer";
import TelaPrincipalReducer from "components/redux/reducers/TelaPrincipalReducer";
import TelaPrincipal from "components/tela_principal/TelaPrincipal";
import {
  criarMostrarAppAction,
  mostrarAppAction,
  atualizarShowAction,
  atualizarDivKeyAction,
  fecharFormAction,
  abrirFormAction,
  aumentarZindexAction,
  receberAppPropsAction
} from "components/redux/reducers/MainAppReducer";
import {
  mouseOverAction,
  mouseLeaveAction
} from "components/redux/actions/TelaPrincipalActions";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";
import BarraLateral from "components/tela_principal/BarraLateral";
import Multileg from "components/forms/multileg_/Multileg";
import ListaCompleta from "components/forms/lista_completa/ListaCompleta";
import Posicao from "components/forms/posicao_/Posicao";
import RelatorioDetalhado from "components/forms/relatorio_detalhado/RelatorioDetalhado";

export const GlobalContext = React.createContext();
export const localContext = React.createContext();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  MainAppReducer: MainAppReducer
});

const combinedAppPrincipal = combineReducers({
  telaPrincipalReducer: TelaPrincipalReducer
});

//Usada apenas para gerenciar os estados de mostrar ou não os formulários
const globalStore = createStore(
  combinedReducers,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

//Usado para todos os outros dados gerais como os da tela principal
const storeAppPrincipal = createStore(
  combinedAppPrincipal,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export const Helper = () => {
  return (
    <Provider store={globalStore} context={GlobalContext}>
      <Provider store={storeAppPrincipal}>
        <TelaPrincipalConectada />
      </Provider>
    </Provider>
  );
};

const mapStateToPropsGlobalStore = state => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex
  };
};

const mapStateToPropsLocal = state => ({});

const mapStateToPropsAppPrincipal = state => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  posicaoAberta: state.telaPrincipalReducer.posicaoAberta,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  multilegAberto: state.telaPrincipalReducer.multilegAberto
});

export const MainAppConectado = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      criarMostrarAppAction,
      mostrarAppAction,
      atualizarShowAction,
      atualizarDivKeyAction,
      abrirFormAction
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    { mouseOverAction, mouseLeaveAction }
  )
)(MainApp);

export const SubAppConectado = connect(
  mapStateToPropsGlobalStore,
  {},
  null,
  { context: GlobalContext }
)(SubApp);

export const AppConectado = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
      fecharFormAction,
      abrirFormAction
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsLocal,
    { receberAppPropsAction }
  )
)(App);

export const ModalHeaderConectado = connect(
  mapStateToPropsGlobalStore,
  { fecharFormAction, abrirFormAction },
  null,
  { context: GlobalContext }
)(modalHeader);

const TelaPrincipalConectada = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    { abrirItemBarraLateralAction }
  )
)(TelaPrincipal);

export const OrdensExecucaoConectada = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(OrdensExecucao);

export const BarraLateralConectada = compose(
  connect(
    null,
    { atualizarDivKeyAction },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    { abrirItemBarraLateralAction, mouseOverAction, mouseLeaveAction }
  )
)(BarraLateral);

export const MultilegConectado = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(Multileg);

export const ListaCompletaConectada = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(ListaCompleta);

export const PosicaoConectada = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(Posicao);

export const RelatorioDetalhadoConectado = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(RelatorioDetalhado);
