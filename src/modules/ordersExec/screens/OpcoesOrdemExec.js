import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import moment from "moment";

import iconeCancelarOrdem from "assets/OrdensExecucao/iconeCancelarOrdem.svg";
import iconeEditarOrdem from "assets/OrdensExecucao/iconeEditarOrdem.svg";
import iconeFinalizarAMercado from "assets/OrdensExecucao/iconeFinalizarAMercado.svg";
import iconeDuplicarOrdem from "assets/OrdensExecucao/iconeDuplicarOrdem.svg";
import iconeOrdemOposta from "assets/OrdensExecucao/iconeOrdemOposta.svg";
import iconeReabrir from "assets/OrdensExecucao/iconeReabrir.svg";
import iconeFecharMenuOpcoesOrdem from "assets/OrdensExecucao/iconeFecharMenuOpcoesOrdem.svg";

import InputSelectBotoes from "./InputSelectBotoes";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import { GlobalContext, StorePrincipalContext } from "redux/StoreCreation";

import {
  openOrderInMultilegAction,
  updateOneOrdersExecStateAction,
  cancelarOrdemExecAction,
  finalizarAMercadoAction,
  aumentarQtdePrecoAction,
  openOrderInBoletaAction,
} from "../duck/actions/OrdensExecActions";

import {
  atualizarDivKeyAction,
  abrirFormAction,
  aumentarZindexAction,
  receberDadosOrdemExecMainReducerAction,
} from "redux/actions/GlobalAppActions";
import { toast } from "react-toastify";

class OpcoesOrdemExec extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpired: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props !== nextProps &&
      this.props.divkey === nextProps.divkey &&
      this.props.zIndex === nextProps.zIndex
    );
  }
  componentDidMount() {
    const { props } = this;
    const { ordemAtual } = props;

    document.getElementById(props.id).style.zIndex = props.zIndex + 1;
    props.aumentarZindexAction(props.id, props.zIndex, true);

    const isExpired = moment(
      ordemAtual.validade,
      "DD MM YYYY hh:mm:ss",
    ).isAfter(new Date());

    this.setState({ isExpired });
  }

  render() {
    const { props, state } = this;

    const actionProps = { idOrdem: props.ordemAtual.id };

    const { isExpired } = state;

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
            if (isExpired) {
              toast.warning(
                "Essa ordem expirou, não é possível realizar essa ação",
              );
            } //
            else {
              if (props.ordemAtual) {
                props.cancelarOrdemExecAction(actionProps);
              } else {
                toast.warning(erro_opcoes_ordens_exec);
              }
            }
          }}
        >
          <img src={iconeCancelarOrdem} width="27" alt=""></img>
          <h6>Cancelar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={(e) => {
            if (isExpired) {
              toast.warning(
                "Essa ordem expirou, não é possível realizar essa ação",
              );
            } //
            else {
              abrirFormOrdem(e, props, "");
            }
          }}
        >
          <img src={iconeEditarOrdem} width="27" alt=""></img>
          <h6>Editar Ordem</h6>
        </div>
        <InputSelectBotoes
          nomeOpen="selectQtdeAberto"
          modo="qtde"
          disabled={isExpired}
        />
        <InputSelectBotoes
          nomeOpen="selectPrecoAberto"
          modo="preco"
          disabled={isExpired}
        />

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (isExpired) {
              toast.warning(
                "Essa ordem expirou, não é possível realizar essa ação",
              );
            } //
            else {
              if (props.ordemAtual) props.finalizarAMercadoAction(actionProps);
              else {
                toast.warning(erro_opcoes_ordens_exec);
              }
            }
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
            props.updateOneOrdersExecStateAction("opcoesOrdemAberto", false);
            props.updateOneOrdersExecStateAction("ordemAtual", null);
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

    if (props.ordemAtual.formName === "Multileg") {
      props.openOrderInMultilegAction(props, acao);
    } //
    else {
      props.openOrderInBoletaAction(props, event, acao);
    }
  } //
  else {
    toast.warning(erro_opcoes_ordens_exec);
  }
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
  tabelaOrdensExecucao: state.ordersExecReducer.tabelaOrdensExecucao,
  ativo: state.ordersExecReducer.ativo,
  opcoesOrdemAberto: state.ordersExecReducer.opcoesOrdemAberto,
  ordemAtual: state.ordersExecReducer.ordemAtual,
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
    mapStateToPropsOrdensExec,
    {
      updateOneOrdersExecStateAction,
      openOrderInMultilegAction,
      cancelarOrdemExecAction,
      finalizarAMercadoAction,
      aumentarQtdePrecoAction,
      openOrderInBoletaAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(OpcoesOrdemExec);
