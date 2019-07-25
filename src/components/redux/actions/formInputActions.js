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
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  MUDAR_INPUT_CONFIGURAR,
  MUDAR_QTDE
} from "constants/ActionTypes";
import { validacaoCompraAgenda } from "components/utils/Validacoes";
import { VALIDACAO_QTDE } from "constants/Erros";

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
    dispatch({
      type: LIMPAR_FORMS
    });
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
  if (gainExec === "0.00" || gainExec === "" || gainExec === "0") {
    total = qtde * gainDisparo;
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

export const comprarAction = (props, namespace) => {
  switch (namespace) {
    case COMPRA_AGENDADA_NAMESPACE:
      validacaoCompraAgenda(props);
      break;
    case COMPRA_LIMITADA_NAMESPACE:
      break;
    case COMPRA_MERCADO_NAMESPACE:
      break;
    case COMPRA_STARTSTOP_NAMESPACE:
      break;
    case COMPRA_STARTMOVEL_NAMESPACE:
      break;
    case COMPRA_GAINREDUCAO_NAMESPACE:
      break;
    default:
      break;
  }

  return dispatch => {
    dispatch({ type: "" });
  };
};

export const venderAction = (props, formulario) => {
  return dispatch => {
    dispatch({ type: "" });
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

export const mudarQtdAction = (event, namespace) => {
  return dispatch => {
    let erro = "";
    if (event.target.validationMessage) {
      erro = VALIDACAO_QTDE;
    }
    dispatch({
      type: `a${MUDAR_QTDE}${namespace}`,
      payload: { qtde: event.target.value, erro: erro }
    });
  };
};
