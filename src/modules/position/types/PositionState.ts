import { SetIntervalAsyncTimer } from "set-interval-async/dynamic";
import { PositionItem, PositionPrice, PositionQuote } from "../types/position";

export default interface PositionState {
  ordenacao: string;
  tipoVisualizacao: "ampliado" | "lista" | "resumido" | "detalhada";
  ativoPesquisa: string;
  inputSelect: string;
  posicoesCustodia: PositionItem[];
  esource_emblem: EventSource | null;
  interval_emblem: SetIntervalAsyncTimer | null;
  esource_position: EventSource | null;
  interval_position: SetIntervalAsyncTimer | null;
  esource_positionQuote: EventSource | null;
  interval_positionQuote: SetIntervalAsyncTimer | null;
  arrayPrecos: PositionPrice[];
  arrayPrecosID: number;
  arrayCotacoes: PositionQuote[];
  arrayCotacoesID: number;
}
