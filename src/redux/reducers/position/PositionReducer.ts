import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import PositionState from "types/posicao/PosicaoState";
import Action from "types/Action";

const INITIAL_STATE: PositionState = {
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
    default:
      return state;
  }
};
