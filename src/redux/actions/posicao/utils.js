import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import ItemPosicao from "types/position/position";

export const updateOnePositionState = ({ attributeName, attributeValue }) => {
  return {
    type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    payload: { attributeName, attributeValue },
  };
};

export const adicionaPosicao = (grupoPosicao) => {
  return grupoPosicao.operacoes.map((operacao) => {
    let variacaoGanho = 0;
    if (operacao.dealPrice)
      variacaoGanho =
        ((Number(operacao.lastPrice) - Number(operacao.dealPrice)) /
          Number(operacao.dealPrice)) *
        100;
    var posicao = {
      ativos: operacao.ativos, // TODO: atualização reativa vem elemento sem atributo ativos
      precoCompra: operacao.priceMin,
      precoVenda: operacao.priceMax,
      cotacaoAtual: operacao.lastPrice,
      oscilacao: operacao.dealPrice,
      stopLoss: operacao.stopLoss,
      stopGain: operacao.stopGain,
      total: Number(operacao.lastPrice) - Number(operacao.dealPrice), //itemLista.total,
      variacaoGanho: variacaoGanho,
      qtde: 0, // itemLista.qtty,
      preco: 0, //itemLista.price,
      custodiaCompra: [],
      custodiaVenda: [],
      executando: [],
      idEstrutura: operacao.structureId,
      agrupadorPrincipal: grupoPosicao.agrupadorPrincipal,
    };
    if (operacao.ordersWorking.length === 0) {
      posicao.total = 0;
    }
    posicao.executando = [...operacao.ordersWorking];
    operacao.ordersWorking.forEach((ordem) => {
      ordem.offers.forEach((oferta) => {
        if (oferta.qtdeExecutada === 0) {
          posicao.total = 0;
        }

        if (oferta.oferta === "C") posicao.custodiaCompra.push(oferta);
        else posicao.custodiaVenda.push(oferta);
      });
    });

    const itemPosicao = new ItemPosicao(posicao);

    return itemPosicao;
  });
};
