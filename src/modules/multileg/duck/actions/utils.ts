import {
  erro_validar_qtde,
  erro_validar_codigo_duplicado_multileg,
  erro_validar_contaSelecionada,
  VALIDACAO_QTDE,
} from "constants/AlertaErros";

import { getformatedDate } from "shared/utils/Formatacoes";
import {
  MODIFICAR_VARIAVEL_MULTILEG,
  MODIFICAR_VARIAVEIS_MULTILEG,
} from "constants/MenuActionTypes";
import MultilegState from "../../types/MultilegState";
import { MultilegTab, MultilegQuote } from "modules/multileg/types/multileg";
import { Account } from "types/system/system";
import { toast } from "react-toastify";

interface UpdateMultilegState {
  attributeName: string;
  attributeValue: MultilegState[keyof MultilegState];
}

export const updateOneMultilegState = ({
  attributeName,
  attributeValue,
}: UpdateMultilegState) => {
  return {
    type: MODIFICAR_VARIAVEL_MULTILEG,
    payload: { attributeName, attributeValue },
  };
};

export const updateManyMultilegState = (payload: any) => {
  return {
    type: MODIFICAR_VARIAVEIS_MULTILEG,
    payload,
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

interface MountMultilegOrder {
  multilegTabs: MultilegTab[];
  selectedAccount: Account;
  tabIndex: number;
  comment?: any;
}

export const mountMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
  comment,
}: MountMultilegOrder) => {
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

interface ValidateMultilegOrder {
  multilegTabs: MultilegTab[];
  selectedAccount: Account;
  tabIndex: number;
  triggeredBy: "multileg" | "box";
}

export const validateMultilegOrder = ({
  multilegTabs,
  selectedAccount,
  tabIndex,
  triggeredBy,
}: ValidateMultilegOrder) => {
  let multilegTab = [...multilegTabs][tabIndex];
  let orderIsValid = true;
  const shouldValidateQttyMultiple100 = multilegTab.market !== "Forex";

  let isQttyValid = true;
  let isValidByMultiple100 = true;

  multilegTab.tabelaMultileg.forEach((offer, index) => {
    const validQtty = offer.qtde !== 0;

    if (!validQtty) {
      isQttyValid = false;
    }

    if (shouldValidateQttyMultiple100) {
      const isMultiple = offer.qtde % 100 === 0;

      if (!isMultiple) {
        isValidByMultiple100 = false;
      }
    }
  });

  // qtty < 0
  if (!isQttyValid) {
    toast.error(erro_validar_qtde);

    return false;
  }

  // qtty is not multiple 100
  if (!isValidByMultiple100 && triggeredBy === "multileg") {
    toast.error(VALIDACAO_QTDE);

    return false;
  }

  const symbols = multilegTab.tabelaMultileg.map(
    (offer) => offer.codigoSelecionado,
  );

  // has repeated symbols
  if (new Set(symbols).size !== symbols.length) {
    const repetedSymbols = findRepetedSymbols(symbols);
    const symbolsOfError = repetedSymbols.join(",");

    toast.error(`${erro_validar_codigo_duplicado_multileg}: ${symbolsOfError}`);

    return false;
  }

  if (!selectedAccount) {
    toast.error(erro_validar_contaSelecionada);

    return false;
  }

  return orderIsValid;
};

interface AddNewMultilegQuote {
  multilegQuotes: MultilegQuote[];
  symbol: string;
  quote?: number | string;
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
