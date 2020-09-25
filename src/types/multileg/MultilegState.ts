import { MultilegTab, MultilegQuote } from "./multileg";

export default interface MultilegState {
  configComplementarAberto: boolean;
  pesquisandoAtivo: boolean;
  abaSelecionada: string;
  horaInicial: string;
  horaFinal: string;
  modoExec: string;
  apregoarOferta: boolean;
  multileg: Array<MultilegTab>;
  eventSource: EventSource | null; //Book
  eventSourceCotacao: EventSource | null;
  setIntervalCotacoesMultileg: NodeJS.Timeout | null;
  cotacoesMultileg: Array<MultilegQuote>;
  cotacoesMultilegID: number;
  multilegButtonsVisibility: boolean;
}
