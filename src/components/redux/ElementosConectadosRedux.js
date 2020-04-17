import React from "react";
import { Provider, connect } from "react-redux";
import { MenuOrdens, WrapperAppBoletas } from "components/tela_principal/MenuOrdens";
import { compose } from "redux";
import AppBoletas from "components/AppBoletas";
import { ModalHeader } from "components/utils/FormHeader";
import TelaPrincipal from "components/tela_principal/TelaPrincipal";
import {
  criarMostrarAppAction,
  mostrarAppAction,
  atualizarShowAction,
  atualizarDivKeyAction,
  fecharFormAction,
  abrirFormAction,
  aumentarZindexAction,
  receberAppPropsAction,
  receberDadosOrdemExecMainReducerAction,
} from "components/redux/actions/MainAppActions";
import {
  mouseOverAction,
  mouseLeaveAction,
} from "components/redux/actions/TelaPrincipalActions";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import OrdensExecucao from "components/forms/ordens_em_execucao/OrdensExecucao";
import BarraLateral from "components/tela_principal/BarraLateral";
import Multileg from "components/forms/multileg_/Multileg";
import PosicaoEmCustodia from "components/forms/posicao_custodia/PosicaoEmCustodia";
import PosicaoDetalhada from "components/forms/posicao_custodia/posicao_detalhada/PosicaoDetalhada";
import RelatorioDetalhado from "components/forms/relatorio_detalhado/RelatorioDetalhado";
import {
  selecionarAdicionarAbaAction,
  modificarAtributoAbaAction,
  excluirAbaMultilegAction,
  atualizarCotacaoAction,
} from "components/redux/actions/menu_actions/MultilegActions";
import { mudarVariavelPosicaoAction } from "components/redux/actions/menu_actions/PosicaoActions";
import { listarBookOfertaOnEnterAction } from "components/redux/actions/api_actions/bookOfertaAPIActions";
import { mudarInputHeaderAction } from "components/redux/actions/bookOfertaActions";
import {
  listarOrdensExecAction,
  abrirOrdemNoMultilegAction,
  mudarVariavelOrdensExecAction,
  cancelarOrdemExecAction,
  finalizarAMercadoAction,
  aumentarQtdePrecoAction,
  abrirOrdensBoletaAction,
  atualizarOrdensExecAction,
} from "components/redux/actions/menu_actions/OrdensExecActions";
import {
  listarPosicoesAction,
  atualizarEmblemasAction,
  atualizarPosicaoAction,
  atualizarCotacoesAction,
} from "components/redux/actions/menu_actions/PosicaoActions";
import OpcoesOrdemExec from "components/forms/ordens_em_execucao/OpcoesOrdemExec";
import { montarBoletaFromOrdemExecAction } from "components/redux/actions/formInputActions";
import { Router, Redirect } from "@reach/router";
import TelaLogin from "components/tela_login/TelaLogin";
import TelaCadastro from "components/tela_login/TelaCadastro";
import {
  StorePrincipalContext,
  globalStore,
  GlobalContext,
  storeAppPrincipal,
  useSelectorStorePrincipal,
} from "components/redux/StoreCreation";

export const Helper = () => {
  return (
    <Provider store={globalStore} context={GlobalContext}>
      <Provider store={storeAppPrincipal} context={StorePrincipalContext}>
        <Router>
          <TelaLogin path="/" />
          <TelaCadastro path="/cadastro" />
          <Home path="/home" />
        </Router>
      </Provider>
    </Provider>
  );
};

const Home = ({ path }) => {
  const logado = useSelectorStorePrincipal((state) => {
    return state.telaPrincipalReducer.logado;
  });
  if (logado) return <TelaPrincipalConectada />;

  return <Redirect to="/" noThrow />;
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

const mapStateToPropsGlobalStore_App = (state) => ({
  ...mapStateToPropsGlobalStore(state),
  dadosOrdemExec: state.MainAppReducer.dadosOrdemExec,
  ultimaBoletaAbertaOrdemExec: state.MainAppReducer.ultimaBoletaAbertaOrdemExec,
});

const mapStateToPropsLocal = (state) => ({
  eventSourceBook_Book: state.bookOfertaReducer.eventSource,
});

const mapStateToPropsAppPrincipal = (state) => ({
  ordensAberto: state.telaPrincipalReducer.ordensAberto,
  ordensExecucaoAberto: state.telaPrincipalReducer.ordensExecucaoAberto,
  relatorioDetalhadoAberto: state.telaPrincipalReducer.relatorioDetalhadoAberto,
  listaCompletaAberta: state.telaPrincipalReducer.listaCompletaAberta,
  multilegAberto: state.telaPrincipalReducer.multilegAberto,
  thlAberta: state.telaPrincipalReducer.thlAberta,
  logado: state.telaPrincipalReducer.logado,
  eventSourceBook_Multileg: state.multilegReducer.eventSource,
  eventSourceCotacao_Multileg: state.multilegReducer.eventSourceCotacao,
  eventSourcePosicao_Posicao: state.posicaoReducer.eventSourcePosicao,
  eventSourceEmblema_Posicao: state.posicaoReducer.eventSourceEmblema,
  eventSourceCotacoes_Posicao: state.posicaoReducer.eventSourceCotacoes,
  eventSourceOrdensExec_OrdensExec:
    state.ordensExecReducer.eventSourceOrdensExec,
});

const mapStateToPropsMultileg = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  abaSelecionada: state.multilegReducer.abaSelecionada,
  eventSource: state.multilegReducer.eventSource,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao,
});

const mapStateToPropsPosicao = (state) => ({
  ordenacao: state.posicaoReducer.ordenacao,
  tipoVisualizacao: state.posicaoReducer.tipoVisualizacao,
  ativoPesquisa: state.posicaoReducer.ativoPesquisa,
  inputSelect: state.posicaoReducer.inputSelect,
  eventSourceEmblema: state.posicaoReducer.eventSourceEmblema,
  eventSourcePosicao: state.posicaoReducer.eventSourcePosicao,
  arrayPrecos: state.posicaoReducer.arrayPrecos,
  posicoesCustodia: state.posicaoReducer.posicoesCustodia,
  arrayCotacoes: state.posicaoReducer.arrayCotacoes,
  eventSourceCotacoes: state.posicaoReducer.eventSourceCotacoes,
  token: state.telaPrincipalReducer.token,
});

const mapStateToPropsOrdensExec = (state) => ({
  tabelaOrdensExecucao: state.ordensExecReducer.tabelaOrdensExecucao,
  ativo: state.ordensExecReducer.ativo,
  opcoesOrdemAberto: state.ordensExecReducer.opcoesOrdemAberto,
  ordemAtual: state.ordensExecReducer.ordemAtual,
  eventSourceOrdensExec: state.ordensExecReducer.eventSourceOrdensExec,
  token: state.telaPrincipalReducer.token,
});

const mapStateToPropsOpcoesOrdemExec = (state) => ({
  ...mapStateToPropsOrdensExec(state),
  selectQtdeAberto: state.ordensExecReducer.selectQtdeAberto,
  selectPrecoAberto: state.ordensExecReducer.selectPrecoAberto,
  sinalInputSelect: state.ordensExecReducer.sinalInputSelect,
  multileg: state.multilegReducer.multileg,
  eventSource: state.multilegReducer.eventSource,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao,
  multilegAberto: state.telaPrincipalReducer.multilegAberto,
  cotacoesMultileg: state.multilegReducer.cotacoesMultileg,
});

export const MenuOrdensConectado = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      criarMostrarAppAction,
      mostrarAppAction,
      atualizarShowAction,
      atualizarDivKeyAction,
      abrirFormAction,
      aumentarZindexAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      mouseOverAction,
      mouseLeaveAction,
      abrirItemBarraLateralAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(MenuOrdens);

export const WrapperAppBoletasConectado = connect(
  mapStateToPropsGlobalStore,
  {},
  null,
  {
    context: GlobalContext,
  }
)(WrapperAppBoletas);

export const AppBoletasConectado = compose(
  connect(
    mapStateToPropsGlobalStore_App,
    {
      aumentarZindexAction,
      fecharFormAction,
      abrirFormAction,
      receberDadosOrdemExecMainReducerAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(mapStateToPropsLocal, {
    receberAppPropsAction,
    listarBookOfertaOnEnterAction,
    mudarInputHeaderAction,
    montarBoletaFromOrdemExecAction,
  })
)(AppBoletas);

export const ModalHeaderConectado = connect(
  mapStateToPropsGlobalStore,
  { fecharFormAction, abrirFormAction },
  null,
  { context: GlobalContext }
)(ModalHeader);

const TelaPrincipalConectada = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(mapStateToPropsAppPrincipal, { abrirItemBarraLateralAction }, null, {
    context: StorePrincipalContext,
  })
)(TelaPrincipal);

export const OrdensExecucaoConectada = compose(
  connect(
    mapStateToPropsGlobalStore,
    { aumentarZindexAction, atualizarDivKeyAction },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsOrdensExec,
    {
      listarOrdensExecAction,
      abrirItemBarraLateralAction,
      mudarVariavelOrdensExecAction,
      atualizarOrdensExecAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(OrdensExecucao);

export const OpcoesOrdemExecConectada = compose(
  connect(
    mapStateToPropsGlobalStore,
    {
      aumentarZindexAction,
      atualizarDivKeyAction,
      abrirFormAction,
      receberDadosOrdemExecMainReducerAction,
    },
    null,
    { context: GlobalContext }
  ),
  connect(
    mapStateToPropsOpcoesOrdemExec,
    {
      abrirItemBarraLateralAction,
      mudarVariavelOrdensExecAction,
      abrirOrdemNoMultilegAction,
      cancelarOrdemExecAction,
      finalizarAMercadoAction,
      aumentarQtdePrecoAction,
      abrirOrdensBoletaAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(OpcoesOrdemExec);

export const BarraLateralConectada = compose(
  connect(
    mapStateToPropsGlobalStore,
    { atualizarDivKeyAction, abrirFormAction },
    null,
    {
      context: GlobalContext,
    }
  ),
  connect(
    mapStateToPropsAppPrincipal,
    {
      abrirItemBarraLateralAction,
      mouseOverAction,
      mouseLeaveAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(BarraLateral);

export const MultilegConectado = compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(
    mapStateToPropsMultileg,
    {
      selecionarAdicionarAbaAction,
      modificarAtributoAbaAction,
      excluirAbaMultilegAction,
      // atualizarBookAction,
      atualizarCotacaoAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(Multileg);

export const PosicaoEmCustodiaConectada = compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(
    mapStateToPropsPosicao,
    {
      mudarVariavelPosicaoAction,
      listarPosicoesAction,
      atualizarEmblemasAction,
      atualizarPosicaoAction,
      atualizarCotacoesAction,
    },
    null,
    { context: StorePrincipalContext }
  )
)(PosicaoEmCustodia);

export const PosicaoDetalhadaConectada = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(PosicaoDetalhada);

export const RelatorioDetalhadoConectado = connect(
  mapStateToPropsGlobalStore,
  { aumentarZindexAction },
  null,
  { context: GlobalContext }
)(RelatorioDetalhado);
