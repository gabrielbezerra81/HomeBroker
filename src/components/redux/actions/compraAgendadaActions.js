import {
  MUDAR_GAIN_DISPARO_COMPRA_AGENDADA,
  MUDAR_GAIN_EXEC_COMPRA_AGENDADA,
  MUDAR_STOP_DISPARO_COMPRA_AGENDADA,
  MUDAR_STOP_EXEC_COMPRA_AGENDADA,
  MUDAR_VALIDADE_CHECK_COMPRA_AGENDADA,
  MUDAR_DATA_COMPRA_AGENDADA,
  LIMPAR_COMPRA_AGENDADA,
  COMPRAR_AGENDADO,
  MUDAR_ATIVO_COMPRA_AGENDADA,
  MUDAR_ENTRADA_DISPARO_COMPRA_AGENDADA,
  MUDAR_ENTRADA_EXEC_COMPRA_AGENDADA,
  MUDAR_ASSINATURA_COMPRA_AGENDADA,
  MUDAR_PRECO_COMPRA_LIMITADA
} from "../../../constants/ActionTypes";

export const mudarGainDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_GAIN_DISPARO_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarGainExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_GAIN_EXEC_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarStopDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_STOP_DISPARO_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarStopExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_STOP_EXEC_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarValidadeCheckAction = checked => {
  return dispatch => {
    if (checked) {
      dispatch({
        type: MUDAR_VALIDADE_CHECK_COMPRA_AGENDADA,
        payload: false
      });
    } else
      dispatch({
        type: MUDAR_VALIDADE_CHECK_COMPRA_AGENDADA,
        payload: true
      });
  };
};

export const mudarDataAction = data => {
  return dispatch => {
    dispatch({
      type: MUDAR_DATA_COMPRA_AGENDADA,
      payload: data
    });
  };
};

export const limparAction = () => {
  return dispatch => {
    dispatch({
      type: LIMPAR_COMPRA_AGENDADA
    });
  };
};

export const comprarAgendadaAction = () => {
  return dispatch => {
    dispatch({ type: COMPRAR_AGENDADO });
  };
};

export const mudarAtivoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ATIVO_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarEntradaDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ENTRADA_DISPARO_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarEntradaExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ENTRADA_EXEC_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarAssinaturaAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ASSINATURA_COMPRA_AGENDADA,
      payload: event.target.value
    });
  };
};

export const mudarPrecoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_PRECO_COMPRA_LIMITADA,
      payload: event.target.value
    });
  };
};
