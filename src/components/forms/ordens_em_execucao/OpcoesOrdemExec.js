import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import iconeCancelarOrdem from "img/OrdensExecucao/iconeCancelarOrdem.svg";
import iconeEditarOrdem from "img/OrdensExecucao/iconeEditarOrdem.svg";
import iconeFinalizarAMercado from "img/OrdensExecucao/iconeFinalizarAMercado.svg";
import iconeDuplicarOrdem from "img/OrdensExecucao/iconeDuplicarOrdem.svg";
import iconeOrdemOposta from "img/OrdensExecucao/iconeOrdemOposta.svg";
import iconeReabrir from "img/OrdensExecucao/iconeReabrir.svg";
import iconeFecharMenuOpcoesOrdem from "img/OrdensExecucao/iconeFecharMenuOpcoesOrdem.svg";
import InputSelectBotoes from "components/forms/ordens_em_execucao/InputSelectBotoes";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import {
  GlobalContext,
  StorePrincipalContext,
} from "components/redux/StoreCreation";
import {
  abrirOrdemNoMultilegAction,
  mudarVariavelOrdensExecAction,
  cancelarOrdemExecAction,
  finalizarAMercadoAction,
  aumentarQtdePrecoAction,
  abrirOrdensBoletaAction,
} from "components/redux/actions/menu_actions/OrdensExecActions";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import {
  atualizarDivKeyAction,
  abrirFormAction,
  aumentarZindexAction,
  receberDadosOrdemExecMainReducerAction,
} from "components/redux/actions/MainAppActions";

class OpcoesOrdemExec extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props !== nextProps &&
      this.props.divkey === nextProps.divkey &&
      this.props.zIndex === nextProps.zIndex
    );
  }
  componentDidMount() {
    const { props } = this;

    document.getElementById(props.id).style.zIndex = props.zIndex + 1;
    props.aumentarZindexAction(props.id, props.zIndex, true);
  }

  render() {
    const { props } = this;
    return (
      <div
        className="containerOpcoesOrdem mcontent"
        id={props.id}
        style={{ ...this.props.style }}
      >
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual)
              props.cancelarOrdemExecAction(props.ordemAtual.id);
            else alert(erro_opcoes_ordens_exec);
          }}
        >
          <img src={iconeCancelarOrdem} width="27" alt=""></img>
          <h6>Cancelar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={(e) => abrirFormOrdem(e, props, "")}
        >
          <img src={iconeEditarOrdem} width="27" alt=""></img>
          <h6>Editar Ordem</h6>
        </div>
        <InputSelectBotoes
          open={props.selectQtdeAberto}
          nomeOpen="selectQtdeAberto"
          changeVar={props.mudarVariavelOrdensExecAction}
          sinal={props.sinalInputSelect}
          modo="qtde"
          ordemAtual={props.ordemAtual}
          dispararAtualizacao={props.aumentarQtdePrecoAction}
        />
        <InputSelectBotoes
          open={props.selectPrecoAberto}
          nomeOpen="selectPrecoAberto"
          changeVar={props.mudarVariavelOrdensExecAction}
          sinal={props.sinalInputSelect}
          modo="preco"
          ordemAtual={props.ordemAtual}
          dispararAtualizacao={props.aumentarQtdePrecoAction}
        />

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual)
              props.finalizarAMercadoAction(props.ordemAtual.id);
            else alert(erro_opcoes_ordens_exec);
          }}
        >
          <img src={iconeFinalizarAMercado} width="27" alt=""></img>
          <h6>Finalizar a Mercado</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={(e) => abrirFormOrdem(e, props, "duplicar")}
        >
          <img src={iconeDuplicarOrdem} width="27" alt=""></img>
          <h6>Duplicar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={(e) => abrirFormOrdem(e, props, "oposta")}
        >
          <img src={iconeOrdemOposta} width="27" alt=""></img>
          <h6>Ordem Oposta</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={(e) => abrirFormOrdem(e, props, "reabrir")}
        >
          <img src={iconeReabrir} width="27" alt=""></img>
          <h6>Reabrir</h6>
        </div>
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            props.mudarVariavelOrdensExecAction("opcoesOrdemAberto", false);
            props.mudarVariavelOrdensExecAction("ordemAtual", null);
          }}
        >
          <img src={iconeFecharMenuOpcoesOrdem} width="27" alt=""></img>
        </div>
      </div>
    );
  }
}

const abrirFormOrdem = (event, props, acao) => {
  if (props.ordemAtual) {
    event.stopPropagation();

    if (props.ordemAtual.formName === "Multileg")
      props.abrirOrdemNoMultilegAction(props, acao);
    else {
      props.abrirOrdensBoletaAction(props, event, acao);
    }
  } else alert(erro_opcoes_ordens_exec);
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

const mapStateToPropsOrdensExec = (state) => ({
  tabelaOrdensExecucao: state.ordensExecReducer.tabelaOrdensExecucao,
  ativo: state.ordensExecReducer.ativo,
  opcoesOrdemAberto: state.ordensExecReducer.opcoesOrdemAberto,
  ordemAtual: state.ordensExecReducer.ordemAtual,
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

export default compose(
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
