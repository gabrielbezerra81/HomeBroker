import {
  erro_validar_qtde,
  erro_validar_codigo_duplicado_multileg,
  erro_validar_contaSelecionada,
} from "constants/AlertaErros";

import { getformatedDate } from "shared/utils/Formatacoes";
import { MODIFICAR_VARIAVEL_MULTILEG } from "constants/MenuActionTypes";
import MultilegState from "types/multileg/MultilegState";
import { MultilegTab, MultilegQuote } from "types/multileg/multileg";

interface UpdateMultilegState {
  attributeName: string;
  attributeValue: MultilegState[keyof MultilegState];
}

export const updateMultilegState = ({
  attributeName,
  attributeValue,
}: UpdateMultilegState) => {
  return {
    type: MODIFICAR_VARIAVEL_MULTILEG,
    payload: { attributeName, attributeValue },
  };
};

interface FindClosestStrikeToQuote {
  options: any[];
  symbolQuote?: number;
  symbol?: string;
  symbolIsOption?: boolean;
}

export const findClosestStrike = ({
  options,
  symbolQuote,
  symbol,
  symbolIsOption,
}: FindClosestStrikeToQuote) => {
  if (options.length > 0) {
    if (symbolIsOption && symbol) {
      const option = options.find((optionItem) => optionItem.symbol === symbol);
      return option.strike;
    } //
    else if (symbolQuote || symbolQuote === 0) {
      console.log("entrou");
      console.log(options.length);
      console.log(symbol, symbolIsOption);
      const closestOption = options.reduce((prev, curr) =>
        Math.abs(curr.strike - symbolQuote) <
        Math.abs(prev.strike - symbolQuote)
          ? curr
          : prev
      );
      return closestOption.strike;
    }
  }
  return 0;
};

interface MountMultilegOrder {
  multilegTabs: MultilegTab[];
  selectedAccount: {
    id: string;
  };
  tabIndex: number;
}

export const mountMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
}: MountMultilegOrder) => {
  let multilegTab = [...multilegTabs][tabIndex];

  let multilegOrder: any = {
    account: {},
    tradeName: {},
    offers: [],
    next: [],
  };
  multilegOrder.account.id = selectedAccount.id;
  multilegOrder.enabled = true;
  multilegOrder.multiStocks = true;
  if (multilegTab.validadeSelect === "DAY")
    multilegOrder.expiration = getformatedDate(new Date()) + " 22:00:00";
  else {
    multilegOrder.expiration = multilegTab.date.toLocaleString("pt-BR");
  }
  multilegOrder.status = "Nova";
  multilegOrder.priority = 0;
  multilegOrder.tradeName.name = "Multileg";
  multilegOrder.formName = "Multileg";

  multilegTab.tabelaMultileg.forEach((oferta, index) => {
    let mainOffer: any = {
      stock: {},
    };

    mainOffer.stock.symbol = oferta.codigoSelecionado;
    mainOffer.limit = oferta.despernamento;
    mainOffer.qtty = oferta.qtde;
    mainOffer.priority = Number(oferta.prioridade);
    mainOffer.offerType = oferta.cv.charAt(0).toUpperCase();
    //ofertaPrincipal.orderType = "multileg";
    if (mainOffer.offerType === "C") mainOffer.orderType = "buy";
    else if (mainOffer.offerType === "V") mainOffer.orderType = "sell";

    if (multilegTab.validadeSelect === "DAY")
      mainOffer.expiration = getformatedDate(new Date()) + " 22:00:00";
    else {
      mainOffer.expiration = multilegTab.date.toLocaleString("pt-BR");
    }

    mainOffer.price = Number(
      multilegTab.preco.split(".").join("").replace(",", ".")
    );
    mainOffer.expirationType = multilegTab.validadeSelect;

    multilegOrder.offers.push(mainOffer);
  });
  return [multilegOrder];
};

interface ValidateMultilegOrder {
  multilegTabs: MultilegTab[];
  selectedAccount: {
    id: string;
  };
  tabIndex: number;
}

export const validateMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
}: ValidateMultilegOrder) => {
  let multilegTab = [...multilegTabs][tabIndex];
  let orderIsValid = true;

  const qtty = multilegTab.tabelaMultileg.some(
    (offer, index) => offer.qtde === 0
  );
  if (qtty) {
    orderIsValid = false;
    alert(erro_validar_qtde);
  }

  const symbols = multilegTab.tabelaMultileg.map(
    (offer) => offer.codigoSelecionado
  );

  if (new Set(symbols).size !== symbols.length) {
    orderIsValid = false;
    const repetedSymbols = findRepetedSymbols(symbols);
    const symbolsOfError = repetedSymbols.join(",");

    alert(`${erro_validar_codigo_duplicado_multileg}: ${symbolsOfError}`);
  }
  if (!selectedAccount) {
    orderIsValid = false;
    alert(erro_validar_contaSelecionada);
  }

  return orderIsValid;
};

interface AddNewMultilegQuote {
  multilegQuotes: MultilegQuote[];
  symbol: string;
  quote?: number;
}

export const AddNewMultilegQuote = ({
  multilegQuotes,
  symbol,
  quote = 0,
}: AddNewMultilegQuote) => {
  const quoteAlreadyAdded = checkQuoteAlreadyAdded({ multilegQuotes, symbol });

  if (!quoteAlreadyAdded) {
    multilegQuotes.push({
      codigo: symbol,
      valor: quote,
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

const findRepetedSymbols = (symbols: string[]) => {
  const result: string[] = [];

  return symbols.reduce(function (acc, symbol, index, symbolArray) {
    if (symbolArray.indexOf(symbol) !== index && acc.indexOf(symbol) < 0)
      acc.push(symbol);
    return acc;
  }, result);
};

interface CheckQuoteAlreadyAdded {
  multilegQuotes: MultilegQuote[];
  symbol: string;
}

export const checkQuoteAlreadyAdded = ({
  multilegQuotes,
  symbol,
}: CheckQuoteAlreadyAdded) => {
  return multilegQuotes.find((quoteItem) => quoteItem.codigo === symbol);
};

interface FindMultilegQuote {
  multilegQuotes: MultilegQuote[];
  symbol: string;
}

export const findMultilegQuote = ({
  multilegQuotes,
  symbol,
}: FindMultilegQuote) => {
  const quote = multilegQuotes.find((quoteItem) => quoteItem.codigo === symbol);

  if (quote) return quote.valor;
  return "";
};

interface FindMultilegBook {
  multilegQuotes: MultilegQuote[];
  symbol: string;
}

export const findMultilegBook = ({
  multilegQuotes,
  symbol,
}: FindMultilegBook) => {
  const book = multilegQuotes.find((bookItem) => bookItem.codigo === symbol);
  if (book) return book;
  return null;
};
