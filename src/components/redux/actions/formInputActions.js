import {
  MUDAR_GAIN_DISPARO,
  MUDAR_GAIN_EXEC,
  MUDAR_STOP_DISPARO,
  MUDAR_STOP_EXEC,
  MUDAR_VALIDADE_SELECT,
  MUDAR_DATA,
  LIMPAR_FORMS,
  MUDAR_ATIVO,
  MUDAR_ENTRADA_DISPARO,
  MUDAR_ENTRADA_EXEC,
  MUDAR_ASSINATURA,
  MUDAR_PRECO,
  MUDAR_CHECK_SALVA_ASSINATURA,
  MUDAR_INICIO_DISPARO,
  MUDAR_AJUSTE_PADRAO,
  MUDAR_DISPARO_PRIMEIRO_AJUSTE,
  MUDAR_DISPARO_MAIS_AJUSTE,
  MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE,
  MUDAR_STOP_ANTERIOR_AJUSTE,
  MUDAR_REDUCAO1,
  MUDAR_REDUCAO2,
  MUDAR_GAIN,
  MUDAR_AJUSTE_ASSIMETRICO,
  ADICIONAR_ITEM_TABELA_REDUCAO,
  ADICIONA_ITEM_TABELA_ORDENS_VENDA,
  MUDAR_INPUT_CONFIGURAR,
  MUDAR_QTDE,
  MUDAR_ATRIBUTO_BOLETA
} from "constants/ActionTypes";

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

export const adicionarItemTabelaStopMovel = (props, namespace) => {
  let tabelaOrdens = [...props.tabelaOrdens];

  let { inicioDisparo, ajusteAssimetrico, stopDisparo } = props;

  if (tabelaOrdens.length === 0) {
    const itemTabela = {
      disparo: inicioDisparo,
      stopAtual: stopDisparo,
      ajuste: ajusteAssimetrico,
      novoStop: Number(stopDisparo) + Number(ajusteAssimetrico)
    };
    tabelaOrdens.push(itemTabela);
  } else {
    const tamanho = tabelaOrdens.length;
    const ultimoItem = tabelaOrdens[tamanho - 1];

    const itemTabela = {
      disparo: Number(ultimoItem.disparo) + Number(ajusteAssimetrico),
      stopAtual: Number(ultimoItem.novoStop),
      ajuste: ajusteAssimetrico,
      novoStop: Number(ultimoItem.novoStop) + Number(ajusteAssimetrico)
    };
    tabelaOrdens.push(itemTabela);
  }

  return dispatch => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: tabelaOrdens
    });
  };
};

export const adicionarItemTabelaStartMovel = (props, namespace) => {
  let tabelaOrdens = [...props.tabelaOrdens];

  let { inicioDisparo, ajusteAssimetrico, stopDisparo } = props;

  if (tabelaOrdens.length === 0) {
    const itemTabela = {
      disparo: inicioDisparo,
      stopAtual: stopDisparo,
      ajuste: ajusteAssimetrico,
      novoStop: Number(stopDisparo) - Number(ajusteAssimetrico)
    };
    tabelaOrdens.push(itemTabela);
  } else {
    const tamanho = tabelaOrdens.length;
    const ultimoItem = tabelaOrdens[tamanho - 1];

    const itemTabela = {
      disparo: Number(ultimoItem.disparo) - Number(ajusteAssimetrico),
      stopAtual: Number(ultimoItem.novoStop),
      ajuste: ajusteAssimetrico,
      novoStop: Number(ultimoItem.novoStop) - Number(ajusteAssimetrico)
    };
    tabelaOrdens.push(itemTabela);
  }

  return dispatch => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: tabelaOrdens
    });
  };
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
