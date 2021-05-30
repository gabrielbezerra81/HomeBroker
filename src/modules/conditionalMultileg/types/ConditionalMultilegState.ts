import { SetIntervalAsyncTimer } from "set-interval-async/dynamic";
import {
  ConditionalMultilegTab,
  ConditionalMultilegQuote,
  ExecutionStrategy,
} from "./conditionalMultileg";

export default interface ConditionalMultilegState {
  configComplementarAberto: boolean;
  abaSelecionada: string;
  horaInicial: string;
  horaFinal: string;
  modoExec: string;
  apregoarOferta: boolean;
  multileg: Array<ConditionalMultilegTab>;
  esource_multilegQuotes: EventSource | null;
  interval_multilegQuotes: SetIntervalAsyncTimer | null;
  cotacoesMultileg: Array<ConditionalMultilegQuote>;
  cotacoesMultilegID: number;
  executionStrategies: Array<ExecutionStrategy>;
  loadingOffers: boolean;
}
