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
  MUDAR_AJUSTE_PADRAO
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