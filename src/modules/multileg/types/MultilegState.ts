import { SetIntervalAsyncTimer } from "set-interval-async/dynamic";
import {
  MultilegTab,
  MultilegQuote,
  AlertAPI,
  ExecutionStrategy,
} from "./multileg";

export default interface MultilegState {
  configComplementarAberto: boolean;
  abaSelecionada: string;
  horaInicial: string;
  horaFinal: string;
  modoExec: string;
  apregoarOferta: boolean;
  multileg: Array<MultilegTab>;
  esource_multilegQuotes: EventSource | null;
  interval_multilegQuotes: SetIntervalAsyncTimer | null;
  cotacoesMultileg: Array<MultilegQuote>;
  cotacoesMultilegID: number;
  alerts: Array<AlertAPI>;
  executionStrategies: Array<ExecutionStrategy>;
  loadingOffers: boolean;
}
