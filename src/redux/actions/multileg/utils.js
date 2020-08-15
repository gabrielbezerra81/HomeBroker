import {
  erro_validar_qtde,
  erro_validar_codigo_duplicado_multileg,
  erro_validar_contaSelecionada,
} from "constants/AlertaErros";

import { getformatedDate } from "shared/utils/Formatacoes";
import { MODIFICAR_VARIAVEL_MULTILEG } from "constants/MenuActionTypes";

export const modificarVariavelMultileg = ({ nome, valor }) => {
  return {
    type: MODIFICAR_VARIAVEL_MULTILEG,
    payload: { nome: nome, valor: valor },
  };
};

export const encontrarNumMaisProximo = (
  listaOpcoes,
  cotacao,
  codigo_ativo,
  opcaoBool
) => {
  if (listaOpcoes.length > 0) {
    if (opcaoBool) {
      const opcao = listaOpcoes.filter(
        (opcao) => opcao.symbol === codigo_ativo
      );
      return opcao[0].strike;
    } else {
      var maisProximo = listaOpcoes.reduce((prev, curr) =>
        Math.abs(curr.strike - cotacao) < Math.abs(prev.strike - cotacao)
          ? curr
          : prev
      );
      return maisProximo.strike;
    }
  }
};

export const montarOrdemMultileg = (props) => {
  let abaMultileg = [...props.multileg][props.indice];

  let json = {
    account: {},
    tradeName: {},
    offers: [],
    next: [],
  };
  json.account.id = props.contaSelecionada.id;
  json.enabled = true;
  json.multiStocks = true;
  if (abaMultileg.validadeSelect === "DAY")
    json.expiration = getformatedDate(new Date()) + " 22:00:00";
  else {
    json.expiration = abaMultileg.date.toLocaleString("pt-BR");
  }
  json.status = "Nova";
  json.priority = 0;
  json.tradeName.name = "Multileg";
  json.formName = "Multileg";

  abaMultileg.tabelaMultileg.forEach((oferta, index) => {
    let ofertaPrincipal = {
      stock: {},
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

    if (abaMultileg.validadeSelect === "DAY")
      ofertaPrincipal.expiration = getformatedDate(new Date()) + " 22:00:00";
    else {
      ofertaPrincipal.expiration = abaMultileg.date.toLocaleString("pt-BR");
    }

    ofertaPrincipal.price = Number(
      abaMultileg.preco.split(".").join("").replace(",", ".")
    );
    ofertaPrincipal.expirationType = abaMultileg.validadeSelect;

    json.offers.push(ofertaPrincipal);
  });
  return json;
};

export const validarOrdemMultileg = (props) => {
  let abaMultileg = [...props.multileg][props.indice];
  let valido = true;

  const qtde0 = abaMultileg.tabelaMultileg.some(
    (oferta, index) => oferta.qtde === 0
  );
  if (qtde0) {
    valido = false;
    alert(erro_validar_qtde);
  }

  const codigos = abaMultileg.tabelaMultileg.map(
    (oferta) => oferta.codigoSelecionado
  );

  if (new Set(codigos).size !== codigos.length) {
    valido = false;
    const repetidos = encontrarCodigosRepetidos(codigos);
    let codigos_erro = "";

    repetidos.forEach((repetido) => {
      if (!codigos_erro.includes(repetido)) codigos_erro += repetido + ", ";
    });

    codigos_erro = codigos_erro.substring(0, codigos_erro.length - 2);

    alert(`${erro_validar_codigo_duplicado_multileg}: ${codigos_erro}`);
  }
  if (!props.contaSelecionada) {
    valido = false;
    alert(erro_validar_contaSelecionada);
  }

  return valido;
};

export const adicionaCotacoesMultileg = (
  cotacoesMultileg,
  novoCodigo,
  valorCotacao = ""
) => {
  const cotacaoJaAdicionada = verificaCotacaoJaAdd(
    cotacoesMultileg,
    novoCodigo
  );

  if (!cotacaoJaAdicionada) {
    cotacoesMultileg.push({
      codigo: novoCodigo,
      valor: valorCotacao,
      compra: {
        price: null,
        qtty: null,
        type: "C",
      },
      venda: {
        price: null,
        qtty: null,
        type: "V",
      },
    });
  }
};

const encontrarCodigosRepetidos = (array) => {
  return array.reduce(function (acc, el, i, arr) {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
    return acc;
  }, []);
};

export const verificaCotacaoJaAdd = (cotacoesMultileg, novoCodigo) => {
  return cotacoesMultileg.find((cotacao) => cotacao.codigo === novoCodigo);
};

export const buscaCotacao = (cotacoesMultileg, codigo) => {
  const cotacao = cotacoesMultileg.find((cotacao) => cotacao.codigo === codigo);

  if (cotacao) return cotacao.valor;
  return "";
};

export const buscaBook = (booksMultileg, codigoOferta) => {
  const book = booksMultileg.find((book) => book.codigo === codigoOferta);
  if (book) return book;
  return null;
};
