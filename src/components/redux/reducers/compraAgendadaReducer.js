import {
  MUDAR_GAIN_DISPARO_COMPRA_AGENDADA,
  MUDAR_GAIN_EXEC_COMPRA_AGENDADA,
  MUDAR_STOP_DISPARO_COMPRA_AGENDADA,
  MUDAR_STOP_EXEC_COMPRA_AGENDADA
} from "../../../constants/ActionTypes";

const INITIAL_STATE = {
  gainDisparo: 0,
  gainExec: 0,
  stopDisparo: 0,
  stopExec: 0,
  cotacaoAtual: 0,
  validadeChecked: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_GAIN_DISPARO_COMPRA_AGENDADA:
      return { ...state, gainDisparo: action.payload };
    case MUDAR_GAIN_EXEC_COMPRA_AGENDADA:
      return { ...state, gainExec: action.payload };
    case MUDAR_STOP_DISPARO_COMPRA_AGENDADA:
      return { ...state, stopDisparo: action.payload };
    case MUDAR_STOP_EXEC_COMPRA_AGENDADA:
      return { ...state, stopExec: action.payload };
    default:
      return state;
  }
};
