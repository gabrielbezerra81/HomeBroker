import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  ordenacao: "",
  tipoVisualizacao: "ampliado"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_POSICAO_CUSTODIA:
      return { ...state, [action.payload.nome]: action.payload.valor };
    default:
      return state;
  }
};