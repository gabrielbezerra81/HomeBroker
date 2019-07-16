import {
  MUDAR_GAIN_DISPARO,
  MUDAR_GAIN_EXEC,
  MUDAR_STOP_DISPARO,
  MUDAR_STOP_EXEC,
  MUDAR_VALIDADE_SELECT,
  MUDAR_DATA,
  LIMPAR_FORMS,
  COMPRAR_AGENDADO,
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
  ADICIONA_ITEM_TABELA_ORDENS_VENDA
} from "../../../constants/ActionTypes";

export const mudarGainDisparoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_GAIN_DISPARO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarGainExecAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_GAIN_EXEC}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarStopDisparoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_STOP_DISPARO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarStopExecAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_STOP_EXEC}${namespace}`,
      payload: event.target.value
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
  };
};

export const comprarAgendadaAction = () => {
  return dispatch => {
    dispatch({ type: COMPRAR_AGENDADO });
  };
};

export const mudarAtivoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ATIVO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarEntradaDisparoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ENTRADA_DISPARO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarEntradaExecAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_ENTRADA_EXEC}${namespace}`,
      payload: event.target.value
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

export const mudarPrecoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_PRECO}${namespace}`,
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

export const mudarInicioDisparoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_INICIO_DISPARO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarAjustePadraoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_AJUSTE_PADRAO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarDisparo1AjusteAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_DISPARO_PRIMEIRO_AJUSTE}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarDisparoMaisAjusteAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_DISPARO_MAIS_AJUSTE}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarStopMaisPrimeiroAjusteAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarStopAnteriorAjusteAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_STOP_ANTERIOR_AJUSTE}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarReducao1Action = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_REDUCAO1}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarReducao2Action = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_REDUCAO2}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarGainAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_GAIN}${namespace}`,
      payload: event.target.value
    });
  };
};

export const mudarAjusteAssimetricoAction = (event, namespace) => {
  return dispatch => {
    dispatch({
      type: `${MUDAR_AJUSTE_ASSIMETRICO}${namespace}`,
      payload: event.target.value
    });
  };
};

export const adicionarItemTabelaGainReducaoAction = (props, namespace) => {
  const { gainDisparo, gainExec, qtde } = props;

  let total = qtde * gainExec;
  if (gainExec === "0.00") {
    total = qtde * gainDisparo;
    console.log("entrou");
  }
  const itemTabela = {
    disparo: gainDisparo,
    execucao: gainExec,
    qtde: parseInt(qtde),
    total: total
  };
  let tabelaGainReducao = [...props.tabelaGainReducao];
  tabelaGainReducao.push(itemTabela);
  return dispatch => {
    dispatch({
      type: `${ADICIONAR_ITEM_TABELA_REDUCAO}${namespace}`,
      payload: tabelaGainReducao
    });
  };
};

export const adicionarItemTabelaStopMovel = (props, namespace) => {
  const { inicioDisparo, stopDisparo, stopMais1Ajuste,stopAnteriorAjuste, ajustePadrao,disparoMaisAjuste } = props;

  const linha1 = {
    disparo: inicioDisparo,
    ajuste: stopMais1Ajuste - stopDisparo,
    stop: stopMais1Ajuste
  }
  const linha2 = {
    disparo: disparoMaisAjuste,
    ajuste: stopAnteriorAjuste - stopMais1Ajuste,
    stop: stopAnteriorAjuste
  }
  const linha3 = {
    disparo: disparoMaisAjuste+ 3*ajustePadrao,
    ajuste: 3*ajustePadrao,
    stop: stopMais1Ajuste + 3*ajustePadrao
  }
 
  let tabelaOrdens = [...props.tabelaOrdens];
  tabelaOrdens.push(linha1,linha2,linha3)
  return dispatch => {
    dispatch({
      type: `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`,
      payload: tabelaOrdens
    });
  };
};
