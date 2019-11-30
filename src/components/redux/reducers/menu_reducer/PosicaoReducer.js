import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  ordenacao: "",
  tipoVisualizacao: "lista",
  ativoPesquisa: "PESQUISAR",
  inputSelect: "",
  posicoesCustodia: [],
  eventSourceEmblema: null,
  eventSourcePosicao: null,
  eventSourceCotacoes: null,
  arrayPrecos: [],
  arrayCotacoes: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_POSICAO_CUSTODIA:
      return { ...state, [action.payload.nome]: action.payload.valor };
    default:
      return state;
  }
};
