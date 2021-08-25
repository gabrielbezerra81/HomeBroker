import { SetIntervalAsyncTimer } from "set-interval-async/dynamic";
import {
  FilterOperation,
  THLBook,
  PriceStructure,
  DueDatesTableItem,
  CombinationsTableItem,
  THLQuote,
} from "./thl";

export default interface THLState {
  quote: number;
  dayOscilation: number;
  ativoPesquisa: string;
  ativoPesquisado: string;
  tipo: "CALL" | "PUT";
  opcoesStrike: Array<DueDatesTableItem>;
  codigoCelulaSelecionada: string;
  idCelulaSelecionada: number | null;
  celulaCalculada: string;
  carregandoTabelaVencimentos: boolean;
  shouldUpdateWithStrikeChange: boolean;
  booksSelecionados: Array<THLBook>;
  faixasMapaCalor: Array<number> | null;
  precoMin: number | ""; // faixa 1 mapa
  precoMax: number | ""; // faixa 5 mapa
  seletorMapaCalor: "semcor" | "montar" | "desmontar";
  listaStrikes: Array<number>;
  strikeSelecionado: number | "";
  precosTabelaVencimentos: Array<PriceStructure>;
  esource_thlStructures: EventSource | null;
  interval_thlStructures: SetIntervalAsyncTimer | null;
  precosTabelaVencimentosID: number; // Como são enviados arrays mutados no setInterval, será enviado um id que muda a cada dispatch

  /* Tabela de combinações */
  combinacoesTabela: Array<CombinationsTableItem>;
  carregandoCombinacoes: boolean;
  estrategia: string;
  grupo: string;
  acaoUlt: string;
  spread: { min: string; max: string; select: FilterOperation };
  codigos: {
    min: string;
    max: string;
    select: FilterOperation;
    codigo1: string;
    min2: string;
    max2: string;
    select2: FilterOperation;
    codigo2: string;
  };
  montagem: { min: string; max: string; select: FilterOperation };
  desmontagem: { min: string; max: string; select: FilterOperation };
  vencimento: Array<string>;
  prazo: Array<number>;
  arrayCotacoes: Array<THLQuote>;
  arrayCotacoesID: number;
  esource_thlQuotes: EventSource | null;
  interval_thlQuotes: SetIntervalAsyncTimer | null;
  ordenacao: {
    key: string;
    valor: 0 | 1 | 2;
  };
}
