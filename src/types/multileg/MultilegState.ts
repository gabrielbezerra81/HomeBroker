import { MultilegTab, MultilegQuote, AlertAPI } from "./multileg";

export default interface MultilegState {
  configComplementarAberto: boolean;
  pesquisandoAtivo: boolean;
  abaSelecionada: string;
  horaInicial: string;
  horaFinal: string;
  modoExec: string;
  apregoarOferta: boolean;
  multileg: Array<MultilegTab>;
  esource_multilegQuotes: EventSource | null;
  interval_multilegQuotes: NodeJS.Timeout | null;
  cotacoesMultileg: Array<MultilegQuote>;
  cotacoesMultilegID: number;
  alerts: Array<AlertAPI>;
}
