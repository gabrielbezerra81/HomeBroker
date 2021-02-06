import moment from "moment";

import { MUDAR_VARIAVEIS_THL } from "constants/MenuActionTypes";
import THLState from "modules/thl/types/THLState";

export const updateManyTHLState = (payload: Partial<THLState>) => {
  return {
    type: MUDAR_VARIAVEIS_THL,
    payload,
  };
};

export const montarTabelaCombinacoes = (tabelaAPI: any[]) => {
  const arrayCotacoes = [...new Set(tabelaAPI.map((item) => item.symbol))].map(
    (codigo) => {
      const cotacao = "";
      return { codigo, cotacao };
    },
  );

  const tabelaCombinacoes = tabelaAPI.map((item: any, indice) => {
    const linha: any = {};
    linha.id = item.id;
    linha.estrategia = item.name;
    linha.grupo = item.group || "";
    linha.acaoUlt = { acao: item.symbol };
    linha.spread = +(
      item.components[0].stock.strike - item.components[1].stock.strike
    ).toFixed(2);
    linha.estrutura = { ...item };
    linha.codigos = {
      opcao1: item.components[0].stock,
      opcao2: item.components[1].stock,
    };
    linha.montagem = item.max;
    linha.desmontagem = item.min;
    linha.vencimento = item.expiration;
    linha.prazo = item.prazo;

    return linha;
  });

  return { tabelaCombinacoes, arrayCotacoes };
};

export function mapearTabelaVencimentos(dataTabela: any) {
  return dataTabela.map((linhaStrike: any) => {
    const novaLinhaStrike: any = {
      strikeLine: linhaStrike.strikeLine,
      structuresIds: [...linhaStrike.structuresIds],
    };
    novaLinhaStrike.stocks = linhaStrike.stocks.map((stock: any) => {
      const data = moment(stock.endBusiness, "DD-MM-YYYY HH:mm:ss");
      const novoStock = { ...stock, vencimento: data };

      return novoStock;
    });

    return novaLinhaStrike;
  });
}
