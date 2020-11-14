import { cloneDeep } from "lodash";
import {
  pesquisarAtivoAPI,
  setPointerWhileAwaiting,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import { calculoPreco } from "screens/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { MainThunkAction, MainThunkDispatch } from "types/ThunkActions";
import {
  MultilegTab,
  MultilegQuote,
  MultilegOffer,
  MultilegOption,
} from "types/multileg/multileg";
import MultilegState from "types/multileg/MultilegState";
import {
  findClosestStrike,
  AddNewMultilegQuote,
  checkQuoteAlreadyAdded,
  updateOneMultilegState,
  updateManyMultilegState,
} from "./utils";

export const updateMultilegStateAction = (
  attributeName: string,
  attributeValue: MultilegState[keyof MultilegState],
): MainThunkAction => (dispatch) => {
  dispatch(updateOneMultilegState({ attributeName, attributeValue }));
};

export const openCloseMultilegExtraConfigsAction = (): MainThunkAction => (
  dispatch,
  getState,
) => {
  const {
    multilegReducer: { configComplementarAberto },
  } = getState();

  dispatch(
    updateMultilegStateAction(
      "configComplementarAberto",
      !configComplementarAberto,
    ),
  );
};

export const selectOrAddMultilegTabAction = (key: string): MainThunkAction => (
  dispatch,
  getState,
) => {
  const {
    multilegReducer: { multileg },
  } = getState();

  if (key === "adicionar") {
    const { multilegTabs, currentTab } = addMultilegTab(multileg);
    dispatch(
      updateManyMultilegState({
        multileg: multilegTabs,
        abaSelecionada: currentTab,
      }),
    );
  } else {
    dispatch(updateMultilegStateAction("abaSelecionada", key));
  }
};

export const addMultilegTab = (multilegTabs: MultilegTab[]) => {
  const updatedMultilegTabs = cloneMultilegTabs(multilegTabs);

  const newTab = cloneDeep(newMultilegTab);
  newTab.nomeAba = `Ordem ${updatedMultilegTabs.length + 1}`;
  const currentTab = `tab${updatedMultilegTabs.length}`;

  updatedMultilegTabs.push(newTab);

  return { multilegTabs: updatedMultilegTabs, currentTab };
};

export const removeMultilegTabAction = (tabIndex: number): MainThunkAction => (
  dispatch,
  getState,
) => {
  const {
    multilegReducer: { multileg },
  } = getState();

  const updatedMultilegTabs = cloneMultilegTabs(multileg);

  if (tabIndex > 0) {
    const key = `tab${tabIndex - 1}`;
    dispatch(updateMultilegStateAction("abaSelecionada", key));
  }

  updatedMultilegTabs.splice(tabIndex, 1);

  dispatch(updateMultilegStateAction("multileg", updatedMultilegTabs));
};

interface ChangeTabAttributeAction {
  tabIndex: number;
  attributeName: keyof MultilegTab | "limpar";
  attributeValue: any;
}

export const updateMultilegTabAction = ({
  tabIndex,
  attributeName,
  attributeValue,
}: ChangeTabAttributeAction): MainThunkAction => async (dispatch, getState) => {
  const {
    multilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  const data = await updateMultilegTab({
    multilegTabs: multileg,
    tabIndex,
    attributeName,
    attributeValue,
    multilegQuotes: cotacoesMultileg,
  });

  dispatch(updateMultilegStateAction("multileg", data.multilegTabs));
  if (data.multilegQuotes) {
    dispatch(
      updateMultilegStateAction("cotacoesMultileg", data.multilegQuotes),
    );
  }
};

interface ChangeTabAttribute {
  multilegTabs: Array<MultilegTab>;
  tabIndex: number;
  attributeName: keyof MultilegTab | "limpar";
  attributeValue: any;
  multilegQuotes?: Array<MultilegQuote>;
}

export const updateMultilegTab = async ({
  multilegTabs,
  tabIndex,
  attributeName,
  attributeValue,
  multilegQuotes,
}: ChangeTabAttribute) => {
  setPointerWhileAwaiting({ lockMode: "travar", id: "multileg" });

  let value = attributeValue;

  const updatedMultilegtabs = cloneMultilegTabs(multilegTabs);
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
      updatedMultilegQuotes = cloneMultilegQuotes(multilegQuotes);
      const symbol = multilegTabs[tabIndex].ativoAtual;

      updatedMultilegtabs[tabIndex].ativo = symbol;

      if (
        !checkQuoteAlreadyAdded({
          multilegQuotes: updatedMultilegQuotes,
          symbol,
        })
      ) {
        const symbolData = await pesquisarAtivoAPI(symbol);

        const quote = symbolData.cotacaoAtual;

        AddNewMultilegQuote({
          multilegQuotes: updatedMultilegQuotes,
          symbol,
          quote,
        });
      }

      const options = await pesquisarStrikesMultilegAPI(symbol, attributeValue);
      if (options) {
        updatedMultilegtabs[tabIndex].opcoes = [...options];
        updatedMultilegtabs[tabIndex].strikeSelecionado = findClosestStrike({
          options,
          symbolQuote: updatedMultilegtabs[tabIndex].strikeSelecionado,
        });
      }
    }
  }
  setPointerWhileAwaiting({ lockMode: "destravar", id: "multileg" });
  return {
    multilegTabs: updatedMultilegtabs,
    multilegQuotes: updatedMultilegQuotes,
  };
};

interface ChangeTableOfferAttributeAction {
  tabIndex: number;
  lineIndex: number;
  attributeName: keyof Omit<MultilegOffer, "opcoes">;
  attributeValue: MultilegOffer[keyof Omit<MultilegOffer, "opcoes">];
}

export const updateMultilegOfferAction = ({
  tabIndex,
  attributeName,
  attributeValue,
  lineIndex,
}: ChangeTableOfferAttributeAction): MainThunkAction => async (
  dispatch,
  getState,
) => {
  setPointerWhileAwaiting({ lockMode: "travar", id: "multileg" });

  const {
    multilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  const updatedMultilegTabs = cloneMultilegTabs(multileg);
  const multilegOffer = updatedMultilegTabs[tabIndex].tabelaMultileg[lineIndex];
  let updatedMultilegQuotes: MultilegQuote[] = cloneMultilegQuotes(
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
          const option = optionsItem as MultilegOption;
          return option.strike === multilegOffer.strikeSelecionado;
        });
        // const cotacaoAnterior = cotacoesMultileg.find(
        //   (cotacao) => cotacao.codigo === codigoAnterior
        // );

        if (!foundOption) {
          multilegOffer.strikeSelecionado = findClosestStrike({
            options,
            symbolQuote: multilegOffer.strikeSelecionado,
          });
        }
        setOfferSymbolAndModel(multilegOffer);
        // TODO: fazendo dispatchs nas linhas 271, 291 (quote) e 302
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
    updatedMultilegQuotes = cloneMultilegQuotes(updatedMultilegQuotes);

    AddNewMultilegQuote({
      multilegQuotes: updatedMultilegQuotes,
      symbol: multilegOffer.codigoSelecionado,
    });
  }

  const tab = updatedMultilegTabs[tabIndex];
  let tabPrice = calculoPreco(tab, "ultimo", updatedMultilegQuotes).toFixed(2);

  tabPrice = formatarNumero(tabPrice, 2, ".", ",");
  tab.preco = tabPrice;

  dispatch(
    updateManyMultilegState({
      cotacoesMultileg: updatedMultilegQuotes,
      multileg: updatedMultilegTabs,
    }),
  );

  setPointerWhileAwaiting({ lockMode: "destravar", id: "multileg" });
};

interface RemoveMultilegOffer {
  tabIndex: number;
  lineIndex: number;
}

export const removeMultilegOfferAction = ({
  tabIndex,
  lineIndex,
}: RemoveMultilegOffer): MainThunkAction => (dispatch, getState) => {
  const {
    multilegReducer: { multileg },
  } = getState();

  const multilegTabs: MultilegTab[] = cloneMultilegTabs(multileg);
  multilegTabs[tabIndex].tabelaMultileg.splice(lineIndex, 1);

  dispatch(updateMultilegStateAction("multileg", multilegTabs));
};

interface AddMultilegOfferAction {
  tabIndex: number;
  offerType: "acao" | "call" | "put";
}

export const addMultilegOfferAction = ({
  tabIndex,
  offerType,
}: AddMultilegOfferAction): MainThunkAction => async (dispatch, getState) => {
  setPointerWhileAwaiting({
    lockMode: "travar",
    id: "multileg",
    parentID: "body",
  });

  const {
    multilegReducer: { multileg, cotacoesMultileg },
  } = getState();

  if (multileg[tabIndex].tabelaMultileg.length < 6) {
    const data = await addMultilegOffer({
      multilegTabs: multileg,
      offerType,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    dispatch(
      updateManyMultilegState({
        multileg: data.multilegTabs,
        cotacoesMultileg: data.multilegQuotes,
      }),
    );
  }

  setPointerWhileAwaiting({
    lockMode: "destravar",
    id: "multileg",
    parentID: "body",
  });
};

interface AddMultilegOffer {
  multilegTabs: MultilegTab[];
  offerType: "acao" | "call" | "put";
  tabIndex: number;
  multilegQuotes: MultilegQuote[];
}

export const addMultilegOffer = async ({
  multilegTabs,
  offerType,
  tabIndex,
  multilegQuotes,
}: AddMultilegOffer) => {
  const updatedTabs: MultilegTab[] = cloneMultilegTabs(multilegTabs);
  multilegQuotes = cloneMultilegQuotes(multilegQuotes);

  const offer: MultilegOffer = cloneDeep(newOffer);
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

  if (!checkQuoteAlreadyAdded({ multilegQuotes, symbol: newSymbol })) {
    const symbolData = await pesquisarAtivoAPI(offer.codigoSelecionado);
    if (symbolData) quote = Number(symbolData.cotacaoAtual);
  }

  AddNewMultilegQuote({
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

export const newOffer: MultilegOffer = {
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

export const newMultilegTab: MultilegTab = {
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
};

const setOfferSymbolAndModel = (multilegOffer: MultilegOffer) => {
  multilegOffer.opcoes.forEach((optionsItem) => {
    const option = optionsItem as MultilegOption;
    if (
      option.strike === multilegOffer.strikeSelecionado &&
      option.type === multilegOffer.tipo.toUpperCase()
    ) {
      multilegOffer.codigoSelecionado = option.symbol;
      multilegOffer.modelo = option.model;
    }
  });
};

const setOfferModelTypeStrikeAndSeries = (multilegOffer: MultilegOffer) => {
  multilegOffer.opcoes.forEach((optionsItem) => {
    const option = optionsItem as MultilegOption;

    if (option.symbol === multilegOffer.codigoSelecionado) {
      multilegOffer.modelo = option.model;
      multilegOffer.tipo = option.type === "CALL" ? "call" : "put";
      multilegOffer.strikeSelecionado = option.strike;
      multilegOffer.serieSelecionada = option.expiration;
    }
  });
};

interface UpdateMultilegQuotesProps {
  dispatch: MainThunkDispatch;
  multilegQuotes: MultilegQuote[];
  token: { accessToken: string; tokenType: string };
  eventSourceMultilegQuotes: EventSource | null;
  setIntervalMultilegQuotes: NodeJS.Timeout | null;
}

export const cloneMultilegTabs = (multilegTabs: MultilegTab[]) =>
  multilegTabs.map((multilegTab) => ({
    ...multilegTab,
    opcoes: multilegTab.opcoes.map((option) => ({ ...option })),
    vencimento: [...multilegTab.vencimento],
    tabelaMultileg: multilegTab.tabelaMultileg.map((offer) => ({ ...offer })),
  }));

export const cloneMultilegQuotes = (multilegQuotes: MultilegQuote[]) =>
  multilegQuotes.map((quote) => ({ ...quote }));
