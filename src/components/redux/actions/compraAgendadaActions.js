import {
  MUDAR_GAIN_DISPARO_COMPRA_AGENDADA,
  MUDAR_GAIN_EXEC_COMPRA_AGENDADA,
  MUDAR_STOP_DISPARO_COMPRA_AGENDADA,
  MUDAR_STOP_EXEC_COMPRA_AGENDADA
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
