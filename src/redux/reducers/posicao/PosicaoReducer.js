import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  ordenacao: "",
  tipoVisualizacao: "ampliado",
  ativoPesquisa: "PESQUISAR",
  inputSelect: "",
  posicoesCustodia: [],
  eventSourceEmblema: null,
  setIntervalEmblema: null,
  eventSourcePosicao: null,
  eventSourceCotacoes: null,
  setIntervalCotacoesPosicao: null,
  arrayPrecos: [],
  arrayPrecosID: 0,
  arrayCotacoes: [],
  arrayCotacoesID: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_POSICAO_CUSTODIA:
      return {
        ...state,
        [action.payload.attributeName]: action.payload.attributeValue,
      };
    default:
      return state;
  }
};
