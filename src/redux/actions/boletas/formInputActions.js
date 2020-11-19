import {
  MUDAR_VALIDADE_SELECT,
  MUDAR_DATA,
  LIMPAR_FORMS,
  MUDAR_ATIVO,
  MUDAR_ASSINATURA,
  MUDAR_CHECK_SALVA_ASSINATURA,
  ADICIONAR_ITEM_TABELA_REDUCAO,
  ADICIONA_ITEM_TABELA_ORDENS_VENDA,
  MUDAR_INPUT_CONFIGURAR,
  MUDAR_QTDE,
  MUDAR_ATRIBUTO_BOLETA,
  REMOVE_ITEM_TABELA_ORDENS_MOVEL,
} from "constants/ActionTypes";
import { cloneDeep } from "lodash";

export const mudarAtributoBoletaAction = (valor, namespace, atributo) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_ATRIBUTO_BOLETA}${namespace}`,
      atributo: atributo,
      valor: valor,
    });
  };
};

export const mudarValidadeSelectAction = (event, namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_VALIDADE_SELECT}${namespace}`,
      payload: event.target.value,
    });
  };
};

export const mudarDataAction = (data, namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_DATA}${namespace}`,
      payload: data,
    });
  };
};

export const limparAction = (namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${LIMPAR_FORMS}${namespace}`,
    });
    dispatch({
      type: LIMPAR_FORMS,
    });
  };
};

export const mudarAtivoAction = (event, namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_ATIVO}${namespace}`,
      payload: event.target.value.toUpperCase(),
    });
  };
};

export const mudarAssinaturaAction = (event, namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_ASSINATURA}${namespace}`,
      payload: event.target.value,
    });
  };
};

export const mudarCheckSalvarAssinaturaAction = (checked, namespace) => {
  return (dispatch) => {
    dispatch({
      type: `${MUDAR_CHECK_SALVA_ASSINATURA}${namespace}`,
      payload: !checked,
    });
  };
};

export const adicionarItemTabelaGainReducaoAction = (namespace) => {
  return (dispatch, getState) => {
    const boletasState = getState();

    const currentBoleta = boletasState[namespace];

    const { gainDisparo, gainExec, qtde } = currentBoleta;

    let total = Number(qtde) * Number(gainExec);
    if (gainExec === "0.00" || gainExec === "" || gainExec === "0") {
      total = Number(qtde) * Number(gainDisparo);
    }
    const itemTabela = {
      disparo: Number(gainDisparo),
      execucao: Number(gainExec),
      qtde: parseInt(qtde),
      total: total,
    };
    let tabelaGainReducao = [...currentBoleta.tabelaGainReducao];
    tabelaGainReducao.push(itemTabela);

    dispatch({
      type: `${ADICIONAR_ITEM_TABELA_REDUCAO}${namespace}`,
      payload: tabelaGainReducao,
    });
  };
};

export const adicionarItemTabelaStopMovel = (
  props,
  namespace,
  tipo = "real",
) => {
  let retorno_tabela_ordens = montaTabelaOrdensStartStopMovel(
    props,
    tipo,
    "venda",
  );
  const atributo = retorno_tabela_ordens.atributo;
  const tabelaOrdens = retorno_tabela_ordens.tabela;

  return (dispatch) => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: { nome: atributo, valor: tabelaOrdens },
    });
    if (tipo === "real")
      dispatch({
        type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
        payload: { nome: "tabelaOrdensSimulacao", valor: [] },
      });
  };
};

export const adicionarItemTabelaStartMovel = (
  props,
  namespace,
  tipo = "real",
) => {
  let retorno_tabela_ordens = montaTabelaOrdensStartStopMovel(
    props,
    tipo,
    "compra",
  );
  const atributo = retorno_tabela_ordens.atributo;
  const tabelaOrdens = retorno_tabela_ordens.tabela;

  return (dispatch) => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: { nome: atributo, valor: tabelaOrdens },
    });
    if (tipo === "real")
      dispatch({
        type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
        payload: { nome: "tabelaOrdensSimulacao", valor: [] },
      });
  };
};

const montaTabelaOrdensStartStopMovel = (props, tipo, cv) => {
  let tabela;
  let itemTabela;
  let { inicioDisparo, ajusteAssimetrico, stopDisparo, ajustePadrao } = props;

  let atributo = "";
  let ajuste = 0;
  if (tipo === "real") {
    atributo = "tabelaOrdens";
    ajuste = ajusteAssimetrico;
    tabela = [...props.tabelaOrdens];
  } else {
    atributo = "tabelaOrdensSimulacao";
    ajuste = ajustePadrao;
    tabela = [...props.tabelaOrdensSimulacao];
  }
  const tabelaReais = props.tabelaOrdens;
  const numOrdensReais = tabelaReais.length;
  const novoStop =
    cv === "compra"
      ? Number(stopDisparo) - Number(ajuste)
      : Number(stopDisparo) + Number(ajuste);
  //
  if (numOrdensReais === 0 && tabela.length === 0) {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.disparo = inicioDisparo;
    itemTabela.stopAtual = stopDisparo;
    itemTabela.ajuste = ajuste;
    itemTabela.novoStop = novoStop;
    itemTabela.tipo = tipo;

    tabela.push(itemTabela);
  } else if (tipo === "simulacao") {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.tipo = tipo;
    adicionaAjustes(tabela, itemTabela, ajuste, cv, tabelaReais);
  }
  if (numOrdensReais !== 0 || tipo === "simulacao") {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.tipo = tipo;
    adicionaAjustes(tabela, itemTabela, ajuste, cv, tabelaReais);
    if (tipo === "simulacao") {
      itemTabela = cloneDeep(itemTabela);
      adicionaAjustes(tabela, itemTabela, ajuste, cv, tabelaReais);
    }
  }

  return { tabela: tabela, atributo: atributo };
};

const adicionaAjustes = (tabela, itemTabela, ajuste, cv, tabelaReais) => {
  const tamanho = tabela.length;
  const numOrdensReais = tabelaReais.length;
  let ultimoItem;
  if (tamanho === 0) {
    ultimoItem = tabelaReais[numOrdensReais - 1];
  } else {
    ultimoItem = tabela[tamanho - 1];
  }

  if (cv === "compra") {
    itemTabela.disparo = Number(ultimoItem.disparo) - Number(ultimoItem.ajuste);
    itemTabela.stopAtual = Number(ultimoItem.novoStop);
    itemTabela.ajuste = ajuste;
    itemTabela.novoStop = Number(ultimoItem.novoStop) - Number(ajuste);
  } else {
    itemTabela.disparo = Number(ultimoItem.disparo) + Number(ultimoItem.ajuste);
    itemTabela.stopAtual = Number(ultimoItem.novoStop);
    itemTabela.ajuste = ajuste;
    itemTabela.novoStop = Number(ultimoItem.novoStop) + Number(ajuste);
  }

  tabela.push(itemTabela);
};

export const removerItemTabelaAction = (
  actionType,
  tabela,
  index,
  namespace,
  tipoOrdem = "",
) => {
  let novaTabela = [...tabela];
  novaTabela.splice(index, 1);
  return (dispatch) => {
    if (actionType === REMOVE_ITEM_TABELA_ORDENS_MOVEL) {
      if (tipoOrdem === "real") {
        //Remove a simulação se adicionar novos ajustes
        dispatch({
          type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
          payload: { nome: "tabelaOrdensSimulacao", valor: [] },
        });
        //Atualiza a tabela com os novos ajustes
        dispatch({
          type: `${actionType}${namespace}`,
          payload: novaTabela,
        });
      } else {
        //Remove um elemento da simulação
        dispatch({
          type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
          payload: { nome: "tabelaOrdensSimulacao", valor: novaTabela },
        });
      }
    }
    //Remove um elemento de tabela para outros tipos de action (Gain redução)
    else
      dispatch({
        type: `${actionType}${namespace}`,
        payload: novaTabela,
      });
  };
};

export const mudarInputConfigAction = (event, namespace) => {
  const name = event.target.getAttribute("name");

  return (dispatch) => {
    dispatch({
      type: `${MUDAR_INPUT_CONFIGURAR}${namespace}`,
      name: name,
      payload: event.target.value,
    });
  };
};

export const mudarQtdAction = (valor, namespace) => {
  return (dispatch) => {
    let erro = "";

    dispatch({
      type: `${MUDAR_QTDE}${namespace}`,
      payload: { qtde: valor, erro: erro },
    });
  };
};
//todo
export const montarBoletaFromOrdemExecAction = (props) => {
  return (dispatch) => {
    const dados = props.dadosOrdemExec;
    const namespace = props.ultimaBoletaAbertaOrdemExec;

    Object.keys(dados).forEach((prop) => {
      // console.log(prop, dados[prop]);
      dispatch({
        type: `${MUDAR_ATRIBUTO_BOLETA}${namespace}`,
        atributo: prop,
        valor: dados[prop],
      });
    });

    props.receberDadosOrdemExecMainReducerAction({
      dadosOrdemExec: null,
      ultimaBoletaAbertaOrdemExec: "",
    });
  };
};

const itemTabelaMovel = {
  disparo: 0,
  stopAtual: 0,
  ajuste: 0,
  novoStop: 0,
  tipo: "",
};
