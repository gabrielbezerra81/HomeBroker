import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import iconeCancelarOrdem from "assets/OrdensExecucao/iconeCancelarOrdem.svg";
import iconeEditarOrdem from "assets/OrdensExecucao/iconeEditarOrdem.svg";
import iconeFinalizarAMercado from "assets/OrdensExecucao/iconeFinalizarAMercado.svg";
import iconeDuplicarOrdem from "assets/OrdensExecucao/iconeDuplicarOrdem.svg";
import iconeOrdemOposta from "assets/OrdensExecucao/iconeOrdemOposta.svg";
import iconeReabrir from "assets/OrdensExecucao/iconeReabrir.svg";
import iconeFecharMenuOpcoesOrdem from "assets/OrdensExecucao/iconeFecharMenuOpcoesOrdem.svg";
import InputSelectBotoes from "telas/popups/ordens_em_execucao/InputSelectBotoes";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";
import {
  abrirOrdemNoMultilegAction,
  mudarVariavelOrdensExecAction,
  cancelarOrdemExecAction,
  finalizarAMercadoAction,
  aumentarQtdePrecoAction,
  abrirOrdensBoletaAction,
} from "redux/actions/ordensExecucao/OrdensExecActions";
import { abrirItemBarraLateralAction } from "redux/actions/telaPrincipal/TelaPrincipalActions";
import {
  atualizarDivKeyAction,
  abrirFormAction,
  aumentarZindexAction,
  receberDadosOrdemExecMainReducerAction,
} from "redux/actions/GlobalAppActions";

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

    const actionProps = { idOrdem: props.ordemAtual.id, token: props.token };

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
            if (props.ordemAtual) props.cancelarOrdemExecAction(actionProps);
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
        <InputSelectBotoes nomeOpen="selectQtdeAberto" modo="qtde" />
        <InputSelectBotoes nomeOpen="selectPrecoAberto" modo="preco" />

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual) props.finalizarAMercadoAction(actionProps);
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
    apps: state.GlobalReducer.apps,
    show: state.GlobalReducer.show,
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
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
  multileg: state.multilegReducer.multileg,
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
    { context: GlobalContext },
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
    { context: StorePrincipalContext },
  ),
)(OpcoesOrdemExec);
