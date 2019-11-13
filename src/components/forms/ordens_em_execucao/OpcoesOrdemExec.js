import React from "react";
import iconeCancelarOrdem from "img/OrdensExecucao/iconeCancelarOrdem.svg";
import iconeEditarOrdem from "img/OrdensExecucao/iconeEditarOrdem.svg";
import iconeFinalizarAMercado from "img/OrdensExecucao/iconeFinalizarAMercado.svg";
import iconeDuplicarOrdem from "img/OrdensExecucao/iconeDuplicarOrdem.svg";
import iconeOrdemOposta from "img/OrdensExecucao/iconeOrdemOposta.svg";
import iconeReabrir from "img/OrdensExecucao/iconeReabrir.svg";
import iconeFecharMenuOpcoesOrdem from "img/OrdensExecucao/iconeFecharMenuOpcoesOrdem.svg";
import InputSelectBotoes from "components/forms/ordens_em_execucao/InputSelectBotoes";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import { Button } from "react-bootstrap";

export default class OpcoesOrdemExec extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="containerOpcoesOrdem mcontent">
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual)
              props.cancelarOrdemExecAction(props.ordemAtual.id);
            else alert(erro_opcoes_ordens_exec);
          }}
        >
          <img src={iconeCancelarOrdem} width="40" alt=""></img>
          <h6>Cancelar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "")}
        >
          <img src={iconeEditarOrdem} width="40" alt=""></img>
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
          <img src={iconeFinalizarAMercado} width="40" alt=""></img>
          <h6>Finalizar a Mercado</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "duplicar")}
        >
          <img src={iconeDuplicarOrdem} width="40" alt=""></img>
          <h6>Duplicar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "oposta")}
        >
          <img src={iconeOrdemOposta} width="40" alt=""></img>
          <h6>Ordem Oposta</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "reabrir")}
        >
          <img src={iconeReabrir} width="40" alt=""></img>
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
          <img src={iconeFecharMenuOpcoesOrdem} width="40" alt=""></img>
        </div>
      </div>
    );
  }
}

const abrirFormOrdem = (event, props, acao) => {
  if (props.ordemAtual) {
    event.stopPropagation();

    if (props.ordemAtual.operacao === "Multileg")
      props.abrirOrdemNoMultilegAction(props, acao);
    else {
      props.abrirOrdensBoletaAction(props, event);
    }
  } else alert(erro_opcoes_ordens_exec);
};
