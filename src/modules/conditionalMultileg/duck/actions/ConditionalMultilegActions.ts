import { cloneDeep } from "lodash";
import {
  pesquisarAtivoAPI,
  setPointerWhileAwaiting,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import { calculoPreco } from "./CalculoPreco";
import { MainThunkAction } from "types/ThunkActions";
import {
  ConditionalMultilegTab,
  ConditionalMultilegQuote,
  ConditionalMultilegOffer,
  ConditionalMultilegOption,
} from "../../types/conditionalMultileg";
import ConditionalMultilegState from "../../types/ConditionalMultilegState";
import {
  cond_findClosestStrike,
  cond_addNewMultilegQuote,
  cond_checkQuoteAlreadyAdded,
  updateOneConditionalMultilegState,
  updateManyConditionalMultilegState,
} from "./utils";
import { formatarNumero } from "shared/utils/Formatacoes";

export const updateConditionalMultilegStateAction = (
  attributeName: string,
  attributeValue: ConditionalMultilegState[keyof ConditionalMultilegState],
): MainThunkAction => (dispatch) => {
  dispatch(
    updateOneConditionalMultilegState({ attributeName, attributeValue }),
  );
};

export const cond_openCloseMultilegExtraConfigsAction = (): MainThunkAction => (
  dispatch,
  getState,
) => {
  const {
    conditionalMultilegReducer: { configComplementarAberto },
  } = getState();

  dispatch(
    updateConditionalMultilegStateAction(
      "configComplementarAberto",
      !configComplementarAberto,
    ),
  );
};

export const cond_selectOrAddMultilegTabAction = (
  key: string,
): MainThunkAction => (dispatch, getState) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = getState();

  if (key === "adicionar") {
    const { multilegTabs, currentTab } = cond_addMultilegTab(multileg);
    dispatch(
      updateManyConditionalMultilegState({
        multileg: multilegTabs,
        abaSelecionada: currentTab,
      }),
    );
  } else {
    dispatch(updateConditionalMultilegStateAction("abaSelecionada", key));
  }
};

export const cond_addMultilegTab = (multilegTabs: ConditionalMultilegTab[]) => {
  const updatedMultilegTabs = cond_cloneMultilegTabs(multilegTabs);

  const newTab = cloneDeep(newMultilegTab);
  newTab.nomeAba = `Ordem ${updatedMultilegTabs.length + 1}`;
  const currentTab = `tab${updatedMultilegTabs.length}`;

  updatedMultilegTabs.push(newTab);

  return { multilegTabs: updatedMultilegTabs, currentTab };
};

export const cond_removeMultilegTabAction = (
  tabIndex: number,
): MainThunkAction => (dispatch, getState) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = getState();

  const updatedMultilegTabs = cond_cloneMultilegTabs(multileg);

  if (tabIndex > 0) {
    const key = `tab${tabIndex - 1}`;
    dispatch(updateConditionalMultilegStateAction("abaSelecionada", key));
  }

  updatedMultilegTabs.splice(tabIndex, 1);

  dispatch(
    updateConditionalMultilegStateAction("multileg", updatedMultilegTabs),
  );
};

interface ChangeTabAttributeAction {
  tabIndex: number;
  attributeName: keyof ConditionalMultilegTab | "limpar";
  attributeValue: any;
}

export const cond_updateMultilegTabAction = ({
  tabIndex,
  attributeName,
  attributeValue,
}: ChangeTabAttributeAction): MainThunkAction => async (dispatch, getState) => {
  const {
    conditionalMultilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  const data = await cond_updateMultilegTab({
    multilegTabs: multileg,
    tabIndex,
    attributeName,
    attributeValue,
    multilegQuotes: cotacoesMultileg,
  });

  dispatch(updateConditionalMultilegStateAction("multileg", data.multilegTabs));
  if (data.multilegQuotes) {
    dispatch(
      updateConditionalMultilegStateAction(
        "cotacoesMultileg",
        data.multilegQuotes,
      ),
    );
  }
};

interface ChangeTabAttribute {
  multilegTabs: Array<ConditionalMultilegTab>;
  tabIndex: number;
  attributeName: keyof ConditionalMultilegTab | "limpar";
  attributeValue: any;
  multilegQuotes?: Array<ConditionalMultilegQuote>;
}

export const cond_updateMultilegTab = async ({
  multilegTabs,
  tabIndex,
  attributeName,
  attributeValue,
  multilegQuotes,
}: ChangeTabAttribute) => {
  setPointerWhileAwaiting({
    lockMode: "travar",
    id: "conditionalMultileg",
    parentID: "body",
  });

  let value = attributeValue;

  const updatedMultilegtabs = cond_cloneMultilegTabs(multilegTabs);
  let updatedMultilegQuotes;

  if (attributeName === "limpar") {
    updatedMultilegtabs[tabIndex] = cloneDeep(newMultilegTab);
    updatedMultilegtabs[tabIndex].nomeAba = `Ordem ${tabIndex + 1}`;

    console.log("limpou,", updatedMultilegtabs[tabIndex]);
  } else {
    if (attributeName === "ativo") {
      value = value.toUpperCase();
    }

    Object.assign(updatedMultilegtabs[tabIndex], {
      [attributeName]: value,
    });

    if (attributeName === "vencimentoSelecionado" && multilegQuotes) {
      // TODO: possível side effect
      updatedMultilegQuotes = cond_cloneMultilegQuotes(multilegQuotes);
      const symbol = multilegTabs[tabIndex].ativoAtual;

      updatedMultilegtabs[tabIndex].ativo = symbol;

      if (
        !cond_checkQuoteAlreadyAdded({
          multilegQuotes: updatedMultilegQuotes,
          symbol,
        })
      ) {
        const symbolData = await pesquisarAtivoAPI(symbol);

        const quote = symbolData.cotacaoAtual;

        cond_addNewMultilegQuote({
          multilegQuotes: updatedMultilegQuotes,
          symbol,
          quote,
        });
      }

      const options = await pesquisarStrikesMultilegAPI(symbol, attributeValue);
      if (options) {
        updatedMultilegtabs[tabIndex].opcoes = [...options];
        updatedMultilegtabs[
          tabIndex
        ].strikeSelecionado = cond_findClosestStrike({
          options,
          symbolQuote: updatedMultilegtabs[tabIndex].strikeSelecionado,
        });
      }
    }
  }
  setPointerWhileAwaiting({
    lockMode: "destravar",
    id: "conditionalMultileg",
    parentID: "body",
  });

  return {
    multilegTabs: updatedMultilegtabs,
    multilegQuotes: updatedMultilegQuotes,
  };
};

interface ChangeTableOfferAttributeAction {
  tabIndex: number;
  lineIndex: number;
  attributeName: keyof Omit<ConditionalMultilegOffer, "opcoes">;
  attributeValue: ConditionalMultilegOffer[keyof Omit<
    ConditionalMultilegOffer,
    "opcoes"
  >];
}

export const cond_updateMultilegOfferAction = ({
  tabIndex,
  attributeName,
  attributeValue,
  lineIndex,
}: ChangeTableOfferAttributeAction): MainThunkAction => async (
  dispatch,
  getState,
) => {
  setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });

  const {
    conditionalMultilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  const updatedMultilegTabs = cond_cloneMultilegTabs(multileg);
  const multilegOffer = updatedMultilegTabs[tabIndex].tabelaMultileg[lineIndex];
  let updatedMultilegQuotes: ConditionalMultilegQuote[] = cond_cloneMultilegQuotes(
    cotacoesMultileg,
  );

  const previousSymbol = multilegOffer.codigoSelecionado;

  if (attributeName === "tipo") {
    if (attributeValue === "call") multilegOffer[attributeName] = "put";
    else if (attributeValue === "put") multilegOffer[attributeName] = "call";
    setOfferSymbolAndModel(multilegOffer);
  } //
  else {
    Object.assign(multilegOffer, { [attributeName]: attributeValue });
    // Se a série for alterada, pesquisa novamente os strikes e códigos

    if (attributeName === "serieSelecionada") {
      const options = await pesquisarStrikesMultilegAPI(
        multilegOffer.ativoAtual,
        attributeValue,
      );
      if (options && options.length) {
        multilegOffer.opcoes = [...options];

        const foundOption = multilegOffer.opcoes.find((optionsItem) => {
          const option = optionsItem as ConditionalMultilegOption;
          return option.strike === multilegOffer.strikeSelecionado;
        });
        // const cotacaoAnterior = cotacoesMultileg.find(
        //   (cotacao) => cotacao.codigo === codigoAnterior
        // );

        if (!foundOption) {
          multilegOffer.strikeSelecionado = cond_findClosestStrike({
            options,
            symbolQuote: multilegOffer.strikeSelecionado,
          });
        }
        setOfferSymbolAndModel(multilegOffer);
        // fazendo dispatchs nas linhas 271, 291 (quote) e 302
      }
    } //
    else if (attributeName === "strikeSelecionado") {
      setOfferSymbolAndModel(multilegOffer);
    } //
    else if (attributeName === "codigoSelecionado") {
      setOfferModelTypeStrikeAndSeries(multilegOffer);
    } //
  }

  if (previousSymbol !== multilegOffer.codigoSelecionado) {
    // Se o código mudar, deve ser verificado se o novo código já está presente nos books
    updatedMultilegQuotes = cond_cloneMultilegQuotes(updatedMultilegQuotes);

    cond_addNewMultilegQuote({
      multilegQuotes: updatedMultilegQuotes,
      symbol: multilegOffer.codigoSelecionado,
    });
  }

  const tab = updatedMultilegTabs[tabIndex];
  let tabPrice = calculoPreco(tab, "ultimo", updatedMultilegQuotes).toFixed(2);

  tabPrice = formatarNumero(tabPrice, 2, ".", ",");
  tab.preco = tabPrice;

  dispatch(
    updateManyConditionalMultilegState({
      cotacoesMultileg: updatedMultilegQuotes,
      multileg: updatedMultilegTabs,
    }),
  );

  setPointerWhileAwaiting({ lockMode: "destravar", id: "conditionalMultileg" });
};

interface RemoveMultilegOffer {
  tabIndex: number;
  lineIndex: number;
}

export const cond_removeMultilegOfferAction = ({
  tabIndex,
  lineIndex,
}: RemoveMultilegOffer): MainThunkAction => (dispatch, getState) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = getState();

  const multilegTabs: ConditionalMultilegTab[] = cond_cloneMultilegTabs(
    multileg,
  );
  multilegTabs[tabIndex].tabelaMultileg.splice(lineIndex, 1);

  dispatch(updateConditionalMultilegStateAction("multileg", multilegTabs));
};

interface AddMultilegOfferAction {
  tabIndex: number;
  offerType: "acao" | "call" | "put";
}

export const cond_addMultilegOfferAction = ({
  tabIndex,
  offerType,
}: AddMultilegOfferAction): MainThunkAction => async (dispatch, getState) => {
  setPointerWhileAwaiting({
    lockMode: "travar",
    id: "conditionalMultileg",
    parentID: "body",
  });

  const {
    conditionalMultilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  if (multileg[tabIndex].tabelaMultileg.length < 6) {
    const data = await cond_addMultilegOffer({
      multilegTabs: multileg,
      offerType,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    dispatch(
      updateManyConditionalMultilegState({
        multileg: data.multilegTabs,
        cotacoesMultileg: data.multilegQuotes,
      }),
    );
  }

  setPointerWhileAwaiting({
    lockMode: "destravar",
    id: "conditionalMultileg",
    parentID: "body",
  });
};

interface AddMultilegOffer {
  multilegTabs: ConditionalMultilegTab[];
  offerType: "acao" | "call" | "put";
  tabIndex: number;
  multilegQuotes: ConditionalMultilegQuote[];
}

export const cond_addMultilegOffer = async ({
  multilegTabs,
  offerType,
  tabIndex,
  multilegQuotes,
}: AddMultilegOffer) => {
  const updatedTabs: ConditionalMultilegTab[] = cond_cloneMultilegTabs(
    multilegTabs,
  );
  multilegQuotes = cond_cloneMultilegQuotes(multilegQuotes);

  const offer: ConditionalMultilegOffer = cloneDeep(newOffer);
  let quote = 0;

  offer.ativoAtual = updatedTabs[tabIndex].ativoAtual;

  if (offerType === "acao") {
    offer.opcoes = [{ symbol: updatedTabs[tabIndex].ativoAtual }];
    offer.codigoSelecionado = updatedTabs[tabIndex].ativoAtual;
  } else {
    const strike = updatedTabs[tabIndex].strikeSelecionado;
    if (strike) offer.strikeSelecionado = strike;
    offer.serie = [...updatedTabs[tabIndex].vencimento];
    offer.serieSelecionada = updatedTabs[tabIndex].vencimentoSelecionado;
    offer.opcoes = [...updatedTabs[tabIndex].opcoes];

    if (offerType === "call") {
      offer.tipo = "call";
    } else if (offerType === "put") {
      offer.tipo = "put";
    }
    setOfferSymbolAndModel(offer);
  }
  const newSymbol = offer.codigoSelecionado;

  if (!cond_checkQuoteAlreadyAdded({ multilegQuotes, symbol: newSymbol })) {
    const symbolData = await pesquisarAtivoAPI(offer.codigoSelecionado);
    if (symbolData) {
      quote = Number(symbolData.cotacaoAtual);
    }
  }

  cond_addNewMultilegQuote({
    multilegQuotes,
    symbol: newSymbol,
    quote,
  });

  // Verifica se o book já foi inserindo, agilizando novas adições de ofertas sem esperar a API
  // if (!verificaBookJaAdd(cotacoesMultileg, newSymbol)) {
  //   const book = await listarBookOfertaAPI(offer.codigoSelecionado);
  //   if (book) {
  //     const bookCompra = book.tabelaOfertasCompra[0];
  //     const bookVenda =
  //       book.tabelaOfertasVenda[book.tabelaOfertasVenda.length - 1];

  //     AdicionaCodigoBooksMultileg(
  //       cotacoesMultileg,
  //       offer.codigoSelecionado,
  //       bookCompra,
  //       bookVenda
  //     );
  //   }
  // }

  updatedTabs[tabIndex].tabelaMultileg.push(offer);

  const tab = updatedTabs[tabIndex];
  let tabPrice = calculoPreco(tab, "ultimo", multilegQuotes).toFixed(2);
  tabPrice = formatarNumero(tabPrice, 2, ".", ",");
  tab.preco = tabPrice;

  return { multilegTabs: updatedTabs, multilegQuotes };
};

const newOffer: ConditionalMultilegOffer = {
  opcoes: [],
  strikeSelecionado: 0,
  cv: "compra",
  qtde: 0,
  serie: [],
  serieSelecionada: "",
  codigoSelecionado: "",
  tipo: "call",
  modelo: "AMERICAN",
  despernamento: 1000,
  prioridade: 0,
  ativoAtual: "",
};

const newMultilegTab: ConditionalMultilegTab = {
  nomeAba: "",
  ativo: "",
  ativoAtual: "",
  variacao: 0,
  opcoes: [],
  strikeSelecionado: 0,
  codigoAberto: false,
  vencimento: [],
  vencimentoSelecionado: "",
  preco: "",
  validadeSelect: "DAY",
  date: new Date(),
  tabelaMultileg: [],
  isAlertOpen: false,
  operator: "Less",
  param: "Bid",
  comment: "",
  selectedStrategy: 1,
  market: "",
  editingOrderId: null,
  tabType: "CONDIÇÃO",
};

const setOfferSymbolAndModel = (multilegOffer: ConditionalMultilegOffer) => {
  multilegOffer.opcoes.forEach((optionsItem) => {
    const option = optionsItem as ConditionalMultilegOption;
    if (
      option.strike === multilegOffer.strikeSelecionado &&
      option.type === multilegOffer.tipo.toUpperCase()
    ) {
      multilegOffer.codigoSelecionado = option.symbol;
      multilegOffer.modelo = option.model;
    }
  });
};

const setOfferModelTypeStrikeAndSeries = (
  multilegOffer: ConditionalMultilegOffer,
) => {
  multilegOffer.opcoes.forEach((optionsItem) => {
    const option = optionsItem as ConditionalMultilegOption;

    if (option.symbol === multilegOffer.codigoSelecionado) {
      multilegOffer.modelo = option.model;
      multilegOffer.tipo = option.type === "CALL" ? "call" : "put";
      multilegOffer.strikeSelecionado = option.strike;
      multilegOffer.serieSelecionada = option.expiration;
    }
  });
};

export const cond_cloneMultilegTabs = (
  multilegTabs: ConditionalMultilegTab[],
) =>
  multilegTabs.map((multilegTab) => ({
    ...multilegTab,
    opcoes: multilegTab.opcoes.map((option) => ({ ...option })),
    vencimento: [...multilegTab.vencimento],
    tabelaMultileg: multilegTab.tabelaMultileg.map((offer) => ({ ...offer })),
  }));

export const cond_cloneMultilegQuotes = (
  multilegQuotes: ConditionalMultilegQuote[],
) => multilegQuotes.map((quote) => ({ ...quote }));

export const cond_updateMultilegPriceAction = (
  tabIndex: number,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      conditionalMultilegReducer: { multileg, cotacoesMultileg },
    } = getState();

    const tab = multileg[tabIndex];
    const price = tab.preco;

    let newPrice = calculoPreco(tab, "ultimo", cotacoesMultileg).toFixed(2);
    newPrice = formatarNumero(newPrice, 2, ".", ",");

    // console.log("preco antigo", preco);
    // console.log("preco atual", novoPreco);

    if (price !== newPrice && !Number.isNaN(newPrice)) {
      dispatch(
        cond_updateMultilegTabAction({
          tabIndex,
          attributeName: "preco",
          attributeValue: newPrice,
        }),
      );
    }
  };
};
