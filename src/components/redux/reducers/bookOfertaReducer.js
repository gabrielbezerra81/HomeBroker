import { MUDAR_QTDE } from "../../../contants/ActionTypes";

const INITIAL_STATE = {
  qtde: 0,
  erro: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_QTDE:
      return { ...state, qtde: action.payload.qtde, erro: action.payload.erro };
    default:
      return state;
  }
};
