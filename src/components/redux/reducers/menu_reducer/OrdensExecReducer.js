import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";

const INITIAL_STATE = {
  ativoFiltrarOrdens: "",
  mercadoFiltrarOrdens: "",
  contaFiltrarOrdens: "",
  statusFiltrarOrdens: "",
  dataFiltrarOrdens: "",
  ofertaFiltrarOrdens: "",
  tabelaOrdensExecucao: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [action.payload.nome]: action.payload.valor };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: action.payload };
    default:
      return state;
  }
};

const temp = [
  {
    id: 30,
    group: null,
    cadastro: "2019-10-09T22:01:29.345127",
    validade: "9999-01-01T00:00:00",
    corretora: "XP INVESTIMENTOS",
    operacao: "Venda Stop Gain",
    modoExec: "A mercado",
    ativo: "PETR4",
    conta: "12332",
    roteador: "rot",
    progresso: 50,
    next: null,
    offers: [
      {
        orderId: 30,
        cadastro: "2019-10-09T22:01:29.345127",
        validade: "9999-01-01T00:00:00",
        corretora: "XP",
        operacao: "Venda Stop Gain",
        ativo: "PETR4",
        oferta: "V",
        qtdeOferta: 100,
        qtdeExecutada: 1000,
        precoDisparo: 26.11,
        precoEnvio: 25.21,
        total: null,
        precoExecutado: 24,
        status: "Suspensa",
        msg: "ok",
        nextMaster: 29,
        nextOffers: []
      },
      {
        orderId: 32,
        cadastro: "2019-10-09T22:01:29.345127",
        validade: "9999-01-01T00:00:00",
        corretora: "XP",
        operacao: "Venda Stop Loss",
        ativo: "PETR4",
        oferta: "V",
        qtdeOferta: 100,
        qtdeExecutada: 0,
        precoDisparo: 24.05,
        precoEnvio: 25.21,
        total: null,
        precoExecutado: 24,
        status: "Suspensa",
        msg: "ok",
        nextMaster: 29,
        nextOffers: []
      },
      {
        orderId: 32,
        cadastro: "2019-10-09T22:01:29.345127",
        validade: "9999-01-01T00:00:00",
        corretora: "XP",
        operacao: "Venda Stop Loss",
        ativo: "PETR4",
        oferta: "V",
        qtdeOferta: 100,
        qtdeExecutada: 0,
        precoDisparo: 24.05,
        precoEnvio: 25.21,
        total: null,
        precoExecutado: 24,
        status: "Suspensa",
        msg: "ok",
        nextMaster: 29,
        nextOffers: []
      }
    ],
    nextOrders: [30, 32, 32],
    nexMaster: 29
  }
];
