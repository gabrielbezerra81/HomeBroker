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
  MUDAR_ATRIBUTO_BOLETA
} from "constants/ActionTypes";
import { cloneDeep } from "lodash";

export const mudarAtributoBoletaAction = (valor, namespace, atributo) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ATRIBUTO_BOLETA}${namespace}`,
      atributo: atributo,
      valor: valor
    });
  };
};

export const mudarValidadeSelectAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_VALIDADE_SELECT}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarDataAction = (data, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_DATA}${namespace}`,
      payload: data
    });
  };
};

export const limparAction = namespace => {
  return dispatch => {
    dispatch({
      type: `${LIMPAR_FORMS}${namespace}`
    });
    dispatch({
      type: LIMPAR_FORMS
    });
  };
};

export const mudarAtivoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ATIVO}${namespace}`,
      payload: event.target.value.toUpperCase()
    });
  };
};

export const mudarAssinaturaAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ASSINATURA}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarCheckSalvarAssinaturaAction = (checked, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_CHECK_SALVA_ASSINATURA}${namespace}`,
      payload: !checked
    });
  };
};

export const adicionarItemTabelaGainReducaoAction = (props, namespace) => {
  const { gainDisparo, gainExec, qtde } = props[props.namespace];

  let total = Number(qtde) * Number(gainExec);
  if (gainExec === "0.00" || gainExec === "" || gainExec === "0") {
    total = Number(qtde) * Number(gainDisparo);
  }
  const itemTabela = {
    disparo: Number(gainDisparo),
    execucao: Number(gainExec),
    qtde: parseInt(qtde),
    total: total
  };
  let tabelaGainReducao = [...props[props.namespace].tabelaGainReducao];
  tabelaGainReducao.push(itemTabela);
  return dispatch => {
    dispatch({
      type: `${ADICIONAR_ITEM_TABELA_REDUCAO}${namespace}`,
      payload: tabelaGainReducao
    });
  };
};

export const adicionarItemTabelaStopMovel = (
  props,
  namespace,
  tipo = "real"
) => {
  let tabelaOrdens;
  let itemTabela;
  let { inicioDisparo, ajusteAssimetrico, stopDisparo, ajustePadrao } = props;

  let atributo = "";
  let ajuste = 0;
  if (tipo === "real") {
    atributo = "tabelaOrdens";
    ajuste = ajusteAssimetrico;
    tabelaOrdens = [...props.tabelaOrdens];
  } else {
    atributo = "tabelaOrdensSimulacao";
    ajuste = ajustePadrao;
    tabelaOrdens = [...props.tabelaOrdensSimulacao];
  }
  const tamanhoInicial = tabelaOrdens.length;
  //
  if (tipo === "simulacao" || tamanhoInicial === 0) {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.disparo = inicioDisparo;
    itemTabela.stopAtual = stopDisparo;
    itemTabela.ajuste = ajuste;
    itemTabela.novoStop = Number(stopDisparo) + Number(ajuste);
    itemTabela.tipo = tipo;

    tabelaOrdens.push(itemTabela);
  }
  if (tipo === "simulacao" || tamanhoInicial !== 0) {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.tipo = tipo;
    adicionaSegundoAjusteStartMovel(tabelaOrdens, itemTabela, ajuste, "venda");
    if (tipo === "simulacao") {
      itemTabela = cloneDeep(itemTabela);
      adicionaSegundoAjusteStartMovel(
        tabelaOrdens,
        itemTabela,
        ajuste,
        "venda"
      );
    }
  }

  return dispatch => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: { nome: atributo, valor: tabelaOrdens }
    });
  };
};

export const adicionarItemTabelaStartMovel = (
  props,
  namespace,
  tipo = "real"
) => {
  let tabelaOrdens;
  let itemTabela;
  let { inicioDisparo, ajusteAssimetrico, stopDisparo, ajustePadrao } = props;

  let atributo = "";
  let ajuste = 0;
  if (tipo === "real") {
    atributo = "tabelaOrdens";
    ajuste = ajusteAssimetrico;
    tabelaOrdens = [...props.tabelaOrdens];
  } else {
    atributo = "tabelaOrdensSimulacao";
    ajuste = ajustePadrao;
    tabelaOrdens = [...props.tabelaOrdensSimulacao];
  }
  const tamanhoInicial = tabelaOrdens.length;
  //
  if (tipo === "simulacao" || tamanhoInicial === 0) {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.disparo = inicioDisparo;
    itemTabela.stopAtual = stopDisparo;
    itemTabela.ajuste = ajuste;
    itemTabela.novoStop = Number(stopDisparo) - Number(ajuste);
    itemTabela.tipo = tipo;

    tabelaOrdens.push(itemTabela);
  }
  if (tipo === "simulacao" || tamanhoInicial !== 0) {
    itemTabela = cloneDeep(itemTabelaMovel);
    itemTabela.tipo = tipo;
    adicionaSegundoAjusteStartMovel(tabelaOrdens, itemTabela, ajuste, "compra");
    if (tipo === "simulacao") {
      itemTabela = cloneDeep(itemTabela);
      adicionaSegundoAjusteStartMovel(
        tabelaOrdens,
        itemTabela,
        ajuste,
        "compra"
      );
    }
  }

  return dispatch => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: { nome: atributo, valor: tabelaOrdens }
    });
  };
};

const adicionaSegundoAjusteStartMovel = (tabela, itemTabela, ajuste, cv) => {
  const tamanho = tabela.length;
  const ultimoItem = tabela[tamanho - 1];

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
  namespace
) => {
  let novaTabela = [...tabela];
  novaTabela.splice(index, 1);
  return dispatch => {
    dispatch({
      type: `${actionType}${namespace}`,
      payload: novaTabela
    });
  };
};

export const mudarInputConfigAction = (event, namespace) => {
  const name = event.target.getAttribute("name");

  return dispatch => {
    dispatch({
      type: `${MUDAR_INPUT_CONFIGURAR}${namespace}`,
      name: name,
      payload: event.target.value
    });
  };
};

export const mudarQtdAction = (valor, namespace) => {
  return dispatch => {
    let erro = "";

    dispatch({
      type: `${MUDAR_QTDE}${namespace}`,
      payload: { qtde: valor, erro: erro }
    });
  };
};
//todo
export const montarBoletaFromOrdemExecAction = props => {
  return dispatch => {
    const dados = props.dadosOrdemExec;
    let nomeBoleta = props.ultimaBoletaAbertaOrdemExec;

    const namespace = `_${nomeBoleta.toUpperCase()}`;

    Object.keys(dados).forEach(prop => {
      dispatch({
        type: `${MUDAR_ATRIBUTO_BOLETA}${namespace}`,
        atributo: prop,
        valor: dados[prop]
      });
    });

    props.receberDadosOrdemExecMainReducerAction({
      dadosOrdemExec: null,
      ultimaBoletaAbertaOrdemExec: ""
    });
  };
};

const itemTabelaMovel = {
  disparo: 0,
  stopAtual: 0,
  ajuste: 0,
  novoStop: 0,
  tipo: ""
};
