import { MUDAR_QTDE_BOOK, MUDAR_STOPLOSS_BOOK, MUDAR_GAIN_BOOK } from "../../../constants/ActionTypes";

const INITIAL_STATE = {
  qtde: 0,
  erro: "",
  stopLoss: 0,
  gain: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_QTDE_BOOK:
      return { ...state, qtde: action.payload.qtde, erro: action.payload.erro };
    case MUDAR_STOPLOSS_BOOK:
      return {...state, stopLoss:action.payload}
    case MUDAR_GAIN_BOOK:
      return {...state, gain:action.payload}
    default:
      return state;
  }
};
