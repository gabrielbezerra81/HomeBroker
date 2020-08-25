import { Token, Account } from "./system";

export default interface SystemState {
  usuarioConectado: string;
  menuLateralAberto: boolean;
  logado: boolean;
  valorLiquido: string;
  valorComprar: string;
  ativo: string;
  ordensAberto: boolean;
  ordensExecucaoAberto: boolean;
  relatorioDetalhadoAberto: boolean;
  listaCompletaAberta: boolean;
  multilegAberto: boolean;
  thlAberta: boolean;
  token: Token;
  conta: Array<Account>;
  contaSelecionada: Account;
}
