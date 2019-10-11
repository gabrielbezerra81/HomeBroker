import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
  enviarOrdemAPI
} from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async dispatch => {
    let multileg = [...props.multileg];
    let aba = multileg[indice];
    const codigo_ativo = aba.ativo;

    document.body.style.cursor = "wait";
    const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);
    document.body.style.cursor = "auto";
    if (dados) {
      aba.opcoes = [...dados.opcoes];
      aba.vencimento = [...dados.vencimentos];
      aba.valor = dados.cotacaoAtual;
      aba.variacao = dados.variacao;
      aba.vencimentoSelecionado = dados.vencimentos[0];
      aba.strikeSelecionado = encontrarNumMaisProximo(
        dados.opcoes,
        dados.cotacaoAtual
      );
      aba.ativoAtual = codigo_ativo;
      dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: multileg });
    }
  };
};

export const pesquisarStrikesMultilegAction = async (
  codigo_ativo,
  vencimento
) => {
  document.body.style.cursor = "wait";
  const dados = await pesquisarStrikesMultilegAPI(codigo_ativo, vencimento);
  document.body.style.cursor = "auto";
  if (dados) {
    return dados;
  }
  return async dispatch => {
    dispatch({ type: "" });
  };
};

export const encontrarNumMaisProximo = (listaOpcoes, cotacao) => {
  var maisProximo = listaOpcoes.reduce((prev, curr) =>
    Math.abs(curr.strike - cotacao) < Math.abs(prev.strike - cotacao)
      ? curr
      : prev
  );

  return maisProximo.strike;
};
export const desgraça = () => {
  return dispatch => {};
};

export const enviarOrdemMultilegAction = props => {
  return async dispatch => {
    let abaMultileg = [...props.multileg][props.indice];

    let json = {
      account: {},
      stock: {},
      tradeName: {},
      offers: [],
      next: []
    };
    json.account.id = 1;
    json.enabled = true;
    json.multiStocks = true;
    json.expiration = abaMultileg.date;
    json.status = "Nova";
    json.priority = 0;
    json.tradeName.name = "Multileg";

    abaMultileg.tabelaMultileg.map((oferta, index) => {
      let ofertaPrincipal = {
        stock: {}
      };

      ofertaPrincipal.stock.symbol = oferta.codigoSelecionado;
      ofertaPrincipal.limit = oferta.despernamento;
      ofertaPrincipal.qtty = oferta.qtde;
      ofertaPrincipal.priority = Number(oferta.prioridade);
      ofertaPrincipal.offerType = oferta.cv.charAt(0).toUpperCase();
      //ofertaPrincipal.orderType = "multileg";
      if (ofertaPrincipal.offerType === "C") ofertaPrincipal.orderType = "buy";
      else if (ofertaPrincipal.offerType === "V")
        ofertaPrincipal.orderType = "sell";
      ofertaPrincipal.expiration = abaMultileg.date;
      ofertaPrincipal.price = Number(
        abaMultileg.preco
          .split(".")
          .join("")
          .replace(",", ".")
      );
      ofertaPrincipal.expirationType = abaMultileg.validadeSelect;

      json.offers.push(ofertaPrincipal);
    });

    enviarOrdemAPI([json]);
  };
};

let ordemNext = {
  action: "Enable",
  order: {
    account: {},
    stock: {},
    tradeName: {},
    offers: []
  }
};
let ofertaNext = {
  stock: {}
};
