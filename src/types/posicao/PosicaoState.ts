import {
  IItemPosicao,
  ItemArrayPrecos,
  ItemArrayCotacoes,
} from "types/posicao/posicao";

export default interface PosicaoState {
  ordenacao: string;
  tipoVisualizacao: "ampliado" | "lista" | "resumido" | "detalhada";
  ativoPesquisa: string;
  inputSelect: string;
  posicoesCustodia: IItemPosicao[];
  eventSourceEmblema: EventSource | null;
  setIntervalEmblema: NodeJS.Timeout | null;
  eventSourcePosicao: EventSource | null;
  eventSourceCotacoes: EventSource | null;
  setIntervalCotacoesPosicao: NodeJS.Timeout | null;
  arrayPrecos: ItemArrayPrecos[];
  arrayPrecosID: number;
  arrayCotacoes: ItemArrayCotacoes[];
  arrayCotacoesID: number;
}
