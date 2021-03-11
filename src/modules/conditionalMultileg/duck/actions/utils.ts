import {
  erro_validar_qtde,
  erro_validar_codigo_duplicado_multileg,
  erro_validar_contaSelecionada,
} from "constants/AlertaErros";

import { getformatedDate } from "shared/utils/Formatacoes";
import {
  UPDATE_ONE_CONDITIONAL_MULTILEG,
  UPDATE_MANY_CONDITIONAL_MULTILEG,
} from "constants/MenuActionTypes";
import ConditionalMultilegState from "../../types/ConditionalMultilegState";
import {
  ConditionalMultilegTab,
  ConditionalMultilegQuote,
} from "../../types/conditionalMultileg";
import { Account } from "types/system/system";
import { toast } from "react-toastify";

interface UpdateConditionalMultilegState {
  attributeName: string;
  attributeValue: ConditionalMultilegState[keyof ConditionalMultilegState];
}

export const updateOneConditionalMultilegState = ({
  attributeName,
  attributeValue,
}: UpdateConditionalMultilegState) => {
  return {
    type: UPDATE_ONE_CONDITIONAL_MULTILEG,
    payload: { attributeName, attributeValue },
  };
};

export const updateManyConditionalMultilegState = (payload: any) => {
  return {
    type: UPDATE_MANY_CONDITIONAL_MULTILEG,
    payload,
  };
};

interface cond_findClosestStrikeToQuote {
  options: any[];
  symbolQuote?: number;
  symbol?: string;
  symbolIsOption?: boolean;
}

export const cond_findClosestStrike = ({
  options,
  symbolQuote,
  symbol,
  symbolIsOption,
}: cond_findClosestStrikeToQuote) => {
  if (options.length > 0) {
    if (symbolIsOption && symbol) {
      const option = options.find((optionItem) => optionItem.symbol === symbol);
      return option.strike;
    } //
    else if (symbolQuote || symbolQuote === 0) {
      const closestOption = options.reduce((prev, curr) =>
        Math.abs(curr.strike - symbolQuote) <
        Math.abs(prev.strike - symbolQuote)
          ? curr
          : prev,
      );
      return closestOption.strike;
    }
  }
  return 0;
};

interface cond_mountMultilegOrder {
  multilegTabs: ConditionalMultilegTab[];
  selectedAccount: Account;
  tabIndex: number;
  comment?: any;
}

export const cond_mountMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
  comment,
}: cond_mountMultilegOrder) => {
  let multilegTab = [...multilegTabs][tabIndex];

  let multilegOrder: any = {
    account: {},
    tradeName: {},
    executionStrategy: {
      id: multilegTab.selectedStrategy,
    },
    offers: [],
    next: [],
    comment,
  };

  if (multilegTab.editingOrderId) {
    multilegOrder.id = multilegTab.editingOrderId;
  }

  multilegOrder.account.id = selectedAccount.id;
  multilegOrder.enabled = true;
  multilegOrder.multiStocks = true;
  if (multilegTab.validadeSelect === "DAY")
    multilegOrder.expiration = getformatedDate(new Date()) + " 22:00:00";
  else if (multilegTab.validadeSelect === "GTC") {
    multilegOrder.expiration = "31/12/9999 22:00:00";
  } else {
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
    else if (multilegTab.validadeSelect === "GTC") {
      mainOffer.expiration = "31/12/9999 22:00:00";
    } else {
      mainOffer.expiration = multilegTab.date.toLocaleString("pt-BR");
    }

    mainOffer.price = Number(
      multilegTab.preco.split(".").join("").replace(",", "."),
    );
    mainOffer.expirationType = multilegTab.validadeSelect;

    multilegOrder.offers.push(mainOffer);
  });
  return [multilegOrder];
};

interface cond_validateMultilegOrder {
  multilegTabs: ConditionalMultilegTab[];
  selectedAccount: Account;
  tabIndex: number;
}

export const cond_validateMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
}: cond_validateMultilegOrder) => {
  let multilegTab = [...multilegTabs][tabIndex];
  let orderIsValid = true;

  const qtty = multilegTab.tabelaMultileg.some(
    (offer, index) => offer.qtde === 0,
  );
  if (qtty) {
    orderIsValid = false;
    toast.error(erro_validar_qtde);
  }

  const symbols = multilegTab.tabelaMultileg.map(
    (offer) => offer.codigoSelecionado,
  );

  if (new Set(symbols).size !== symbols.length) {
    orderIsValid = false;
    const repetedSymbols = findRepetedSymbols(symbols);
    const symbolsOfError = repetedSymbols.join(",");

    toast.error(`${erro_validar_codigo_duplicado_multileg}: ${symbolsOfError}`);
  }
  if (!selectedAccount) {
    orderIsValid = false;
    toast.error(erro_validar_contaSelecionada);
  }

  return orderIsValid;
};

interface AddNewMultilegQuote {
  multilegQuotes: ConditionalMultilegQuote[];
  symbol: string;
  quote?: number | string;
}

export const cond_addNewMultilegQuote = ({
  multilegQuotes,
  symbol,
  quote = 0,
}: AddNewMultilegQuote) => {
  const quoteAlreadyAdded = cond_checkQuoteAlreadyAdded({
    multilegQuotes,
    symbol,
  });

  if (!quoteAlreadyAdded) {
    multilegQuotes.push({
      codigo: symbol,
      valor: Number(quote),
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

interface cond_checkQuoteAlreadyAdded {
  multilegQuotes: ConditionalMultilegQuote[];
  symbol: string;
}

export const cond_checkQuoteAlreadyAdded = ({
  multilegQuotes,
  symbol,
}: cond_checkQuoteAlreadyAdded) => {
  return multilegQuotes.find((quoteItem) => quoteItem.codigo === symbol);
};

interface cond_findMultilegQuote {
  multilegQuotes: ConditionalMultilegQuote[];
  symbol: string;
}

export const cond_findMultilegQuote = ({
  multilegQuotes,
  symbol,
}: cond_findMultilegQuote) => {
  const quote = multilegQuotes.find((quoteItem) => quoteItem.codigo === symbol);

  if (quote) return quote.valor;
  return "";
};

interface FindMultilegBook {
  multilegQuotes: ConditionalMultilegQuote[];
  symbol: string;
}

export const cond_findMultilegBook = ({
  multilegQuotes,
  symbol,
}: FindMultilegBook) => {
  const book = multilegQuotes.find((bookItem) => bookItem.codigo === symbol);
  if (book) return book;
  return null;
};
