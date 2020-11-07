import {
  PositionItem,
  PositionPrice,
  PositionQuote,
} from "types/position/position";

export default interface PositionState {
  ordenacao: string;
  tipoVisualizacao: "ampliado" | "lista" | "resumido" | "detalhada";
  ativoPesquisa: string;
  inputSelect: string;
  posicoesCustodia: PositionItem[];
  esource_emblem: EventSource | null;
  interval_emblem: NodeJS.Timeout | null;
  esource_position: EventSource | null;
  esource_positionQuote: EventSource | null;
  interval_positionQuote: NodeJS.Timeout | null;
  arrayPrecos: PositionPrice[];
  arrayPrecosID: number;
  arrayCotacoes: PositionQuote[];
  arrayCotacoesID: number;
}
