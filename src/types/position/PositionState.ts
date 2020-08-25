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
  eventSourceEmblema: EventSource | null;
  setIntervalEmblema: NodeJS.Timeout | null;
  eventSourcePosicao: EventSource | null;
  eventSourceCotacoes: EventSource | null;
  setIntervalCotacoesPosicao: NodeJS.Timeout | null;
  arrayPrecos: PositionPrice[];
  arrayPrecosID: number;
  arrayCotacoes: PositionQuote[];
  arrayCotacoesID: number;
}
