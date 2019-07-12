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

export const mudarGainDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_GAIN_DISPARO,
      payload: event.target.value
    });
  };
};

export const mudarGainExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_GAIN_EXEC,
      payload: event.target.value
    });
  };
};

export const mudarStopDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_STOP_DISPARO,
      payload: event.target.value
    });
  };
};

export const mudarStopExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_STOP_EXEC,
      payload: event.target.value
    });
  };
};

export const mudarValidadeSelectAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_VALIDADE_SELECT,
      payload: event.target.value
    });
  };
};

export const mudarDataAction = data => {
  return dispatch => {
    dispatch({
      type: MUDAR_DATA,
      payload: data
    });
  };
};

export const limparAction = () => {
  return dispatch => {
    dispatch({
      type: LIMPAR_FORMS
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
      type: MUDAR_ATIVO,
      payload: event.target.value
    });
  };
};

export const mudarEntradaDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ENTRADA_DISPARO,
      payload: event.target.value
    });
  };
};

export const mudarEntradaExecAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ENTRADA_EXEC,
      payload: event.target.value
    });
  };
};

export const mudarAssinaturaAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_ASSINATURA,
      payload: event.target.value
    });
  };
};

export const mudarPrecoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_PRECO,
      payload: event.target.value
    });
  };
};

export const mudarCheckSalvarAssinaturaAction = checked => {
  return dispatch => {
    dispatch({
      type: MUDAR_CHECK_SALVA_ASSINATURA,
      payload: !checked
    });
  };
};

export const mudarInicioDisparoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_INICIO_DISPARO,
      payload: event.target.value
    });
  };
};

export const mudarAjustePadraoAction = event => {
  return dispatch => {
    dispatch({
      type: MUDAR_AJUSTE_PADRAO,
      payload: event.target.value
    });
  };
};
