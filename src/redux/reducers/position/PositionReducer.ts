import {
  MUDAR_VARIAVEL_POSICAO_CUSTODIA,
  MUDAR_VARIAVEIS_POSICAO_CUSTODIA,
} from "constants/MenuActionTypes";
import PositionState from "types/position/PositionState";
import Action from "types/Action";

const INITIAL_STATE: PositionState = {
  ordenacao: "",
  tipoVisualizacao: "ampliado",
  ativoPesquisa: "PESQUISAR",
  inputSelect: "",
  posicoesCustodia: [],
  esource_emblem: null,
  interval_emblem: null,
  esource_position: null,
  esource_positionQuote: null,
  interval_positionQuote: null,
  arrayPrecos: [],
  arrayPrecosID: 0,
  arrayCotacoes: [],
  arrayCotacoesID: 0,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): PositionState => {
  switch (type) {
    case MUDAR_VARIAVEL_POSICAO_CUSTODIA:
      return {
        ...state,
        [payload.attributeName]: payload.attributeValue,
      };
    case MUDAR_VARIAVEIS_POSICAO_CUSTODIA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
