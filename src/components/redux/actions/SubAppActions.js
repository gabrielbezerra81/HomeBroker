import {
  validacaoCompraAgenda,
  validacaoCompraLimitada,
  validacaoCompraMercado,
  validacaoCompraStartMovel,
  validacaoCompraGainReducao,
  validacaoCompraStartStop
} from "components/utils/Validacoes";
import { getformatedDate } from "components/utils/Formatacoes";

/*

  "cadastro": "2019-08-06",
  "password": "asdsadasidbsia",
  "username": "usuarioteste"

*/

export const compraAgendadaAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraAgenda(props)) {
      const data = getValidade(props.validadeSelect, props.date);

      let body = {
        ativo: props.ativo,
        qtde: props.qtde,
        entradaDisparo: props.entradaDisparo,
        entradaExec: props.entradaExec,
        gainDisparo: props.gainDisparo,
        gainExec: props.gainExec,
        stopDisparo: props.stopDisparo,
        stopExec: props.stopExec,
        validade: data,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

export const compraLimitadaAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraLimitada(props)) {
      let body = {
        ativo: props.ativo,
        qtde: props.qtde,
        preco: props.preco,
        gainDisparo: props.gainDisparo,
        gainExec: props.gainExec,
        stopDisparo: props.stopDisparo,
        stopExec: props.stopExec,
        validade: props.validadeSelect,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

export const compraMercadoAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraMercado(props)) {
      let body = {
        ativo: props.ativo,
        qtde: props.qtde,
        cotacaoAtual: props.dadosPesquisa.cotacaoAtual,
        gainDisparo: props.gainDisparo,
        gainExec: props.gainExec,
        stopDisparo: props.stopDisparo,
        stopExec: props.stopExec,
        validade: props.validadeSelect,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

export const compraStartStopAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraStartStop(props)) {
      let body = {
        ativo: props.ativo,
        qtde: props.qtde,
        gainDisparo: props.gainDisparo,
        gainExec: props.gainExec,
        stopDisparo: props.stopDisparo,
        stopExec: props.stopExec,
        validade: props.validadeSelect,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

export const compraStartMovelAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraStartMovel(props)) {
      let body = {
        ativo: props.ativo,
        qtde: props.qtde,
        inicioDisparo: props.inicioDisparo,
        ajustePadrao: props.ajustePadrao,
        stopDisparo: props.stopDisparo,
        stopExec: props.stopExec,
        validade: props.validadeSelect,
        tabelaOrdens: props.tabelaOrdens,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

export const compraGainReducaoAction = (props, namespace) => {
  return dispatch => {
    if (validacaoCompraGainReducao(props)) {
      let body = {
        ativo: props.resultadoAtivo,
        qtde: props.qtde,
        disparo: props.gainDisparo,
        execucao: props.gainExec,
        validade: props.validadeSelect,
        tabelaGainReducao: props.tabelaGainReducao,
        assinatura: props.assinatura
      };

      const jsonBody = JSON.stringify(body);
      console.log(jsonBody);
    }
  };
};

const getValidade = (validadeSelect, data) => {
  switch (validadeSelect) {
    case "DAY":
      return getformatedDate(new Date());
    case "SPECIFIED_DAY":
      return getformatedDate(data);
    case "GTC":
      return "indefinida";
    default:
      return getformatedDate(new Date());
  }
};
