import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  ativoFiltrarOrdens: "",
  mercadoFiltrarOrdens: "",
  contaFiltrarOrdens: "",
  statusFiltrarOrdens: "",
  dataFiltrarOrdens: "",
  ofertaFiltrarOrdens: "",
  tabelaOrdensExecucao: [
    {
      progresso: 50,
      cadastro: "16/09/2019 13:12:67",
      corretora: "XP",
      conta: "23897-8",
      operacao: "THL",
      modoExec: "A Mercado",
      ativo: ["PETRG260", "PETRH270"],
      oferta: ["V", "C"],
      qtdeOferta: ["1.000", "1.000"],
      qtdeEmAberto: ["1.000", "1.000"],
      qtdeExecutada: [0, 0],
      qtdeCancelada: [0, 0],
      precoDisparo: "0,20",
      precoEnvio: ["2,70", "2,50"],
      precoExecutado: ["0,20", "0,20"],
      cotacao: "",
      validade: "",
      roteador: "MT5",
      st: ["Ok", "Ok"],
      msg: ""
    },
    {
      progresso: 100,
      cadastro: "16/09/2019 13:12:67",
      corretora: "XP",
      conta: "23897-8",
      operacao: "THL",
      modoExec: "A Mercado",
      ativo: ["PETRG260", "PETRH270"],
      oferta: ["V", "C"],
      qtdeOferta: ["1.000", "1.000"],
      qtdeEmAberto: ["1.000", "1.000"],
      qtdeExecutada: [0, 0],
      qtdeCancelada: [0, 0],
      precoDisparo: "0,20",
      precoEnvio: ["2,70", "2,50"],
      precoExecutado: ["0,20", "0,20"],
      cotacao: "",
      validade: "",
      roteador: "MT5",
      st: ["Ok", "Ok"],
      msg: ""
    }
  ]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [action.payload.nome]: action.payload.valor };
    default:
      return state;
  }
};
