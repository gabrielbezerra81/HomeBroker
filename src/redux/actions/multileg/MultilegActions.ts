import { cloneDeep } from "lodash";
import {
  pesquisarAtivoAPI,
  travarDestravarClique,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import { atualizarCotacaoMultilegAPI } from "api/ReativosAPI";
import { calculoPreco } from "telas/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import {
  findClosestStrike,
  AddNewMultilegQuote,
  checkQuoteAlreadyAdded,
  updateMultilegState,
} from "./utils";
import { MainThunkAction, MainThunkDispatch } from "types/ThunkActions";
import {
  MultilegTab,
  MultilegQuote,
  MultilegOffer,
  MultilegOption,
} from "types/multileg/multileg";
import MultilegState from "types/multileg/MultilegState";
import { typedAssign } from "types/utils";

export const updateMultilegStateAction = (
  attributeName: string,
  attributeValue: MultilegState[keyof MultilegState]
): MainThunkAction => {
  return (dispatch) => {
    dispatch(updateMultilegState({ attributeName, attributeValue }));
  };
};

export const openCloseMultilegExtraConfigsAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { configComplementarAberto },
    } = getState();

    dispatch(
      updateMultilegStateAction(
        "configComplementarAberto",
        !configComplementarAberto
      )
    );
  };
};

////

export const selectOrAddMultilegTabAction = (key: string): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    if (key === "adicionar") {
      let { multilegTabs, currentTab } = addMultilegTab(multileg);
      dispatch(updateMultilegStateAction("multileg", multilegTabs));
      dispatch(updateMultilegStateAction("abaSelecionada", currentTab));
    } else {
      dispatch(updateMultilegStateAction("abaSelecionada", key));
    }
  };
};

export const addMultilegTab = (multilegTabs: MultilegTab[]) => {
  let updatedMultilegTabs = cloneMultilegTabs(multilegTabs);

  const newTab = cloneDeep(newMultilegTab);
  newTab.nomeAba = "Ordem " + (updatedMultilegTabs.length + 1);
  let currentTab = "tab" + updatedMultilegTabs.length;

  updatedMultilegTabs.push(newTab);

  return { multilegTabs: updatedMultilegTabs, currentTab };
};

////

export const removeMultilegTabAction = (tabIndex: number): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    let updatedMultilegTabs = cloneMultilegTabs(multileg);

    if (tabIndex > 0) {
      const key = "tab" + (tabIndex - 1);
      dispatch(updateMultilegStateAction("abaSelecionada", key));
    }

    updatedMultilegTabs.splice(tabIndex, 1);

    dispatch(updateMultilegStateAction("multileg", updatedMultilegTabs));
  };
};

////
interface ChangeTabAttributeAction {
  tabIndex: number;
  attributeName: string;
  attributeValue: any;
}

export const updateMultilegTabAction = ({
  tabIndex,
  attributeName,
  attributeValue,
}: ChangeTabAttributeAction): MainThunkAction => {
  return async (dispatch, getState) => {
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
    if (data.multilegQuotes)
      dispatch(
        updateMultilegStateAction("cotacoesMultileg", data.multilegQuotes)
      );
  };
};

interface ChangeTabAttribute {
  multilegTabs: Array<MultilegTab>;
  tabIndex: number;
  attributeName: string;
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
  travarDestravarClique("travar", "multileg");
  let updatedMultilegtabs = cloneMultilegTabs(multilegTabs);
  let updatedMultilegQuotes;

  if (attributeName === "limpar") {
    updatedMultilegtabs[tabIndex] = cloneDeep(newMultilegTab);
    updatedMultilegtabs[tabIndex].nomeAba = "Ordem " + (tabIndex + 1);
  } else {
    if (attributeName === "ativo")
      attributeValue = attributeValue.toUpperCase();

    typedAssign(updatedMultilegtabs[tabIndex], {
      [attributeName]: attributeValue,
    });

    if (attributeName === "vencimentoSelecionado" && multilegQuotes) {
      // TODO: possível side effect
      updatedMultilegQuotes = cloneMultilegQuotes(multilegQuotes);
      const symbol = multilegTabs[tabIndex].ativoAtual;
      multilegTabs[tabIndex].ativo = symbol;

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
          symbol: symbol,
          quote,
        });
      }

      const options = await pesquisarStrikesMultilegAPI(
        symbol,
        multilegTabs[tabIndex].vencimentoSelecionado
      );
      if (options) {
        updatedMultilegtabs[tabIndex].opcoes = [...options];
        updatedMultilegtabs[tabIndex].strikeSelecionado = findClosestStrike({
          options,
          symbolQuote: updatedMultilegtabs[tabIndex].strikeSelecionado,
        });
      }
    }
  }
  travarDestravarClique("destravar", "multileg");
  return {
    multilegTabs: updatedMultilegtabs,
    multilegQuotes: updatedMultilegQuotes,
  };
};

////

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
}: ChangeTableOfferAttributeAction): MainThunkAction => {
  return async (dispatch, getState) => {
    travarDestravarClique("travar", "multileg");

    const {
      telaPrincipalReducer: { token },
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
    } = getState();

    let updatedMultilegTabs = cloneMultilegTabs(multileg);
    let multilegOffer = updatedMultilegTabs[tabIndex].tabelaMultileg[lineIndex];
    let updatedMultilegQuotes: MultilegQuote[] = cloneMultilegQuotes(
      cotacoesMultileg
    );

    const previousSymbol = multilegOffer.codigoSelecionado;

    if (attributeName === "tipo") {
      if (attributeValue === "call") multilegOffer[attributeName] = "put";
      else if (attributeValue === "put") multilegOffer[attributeName] = "call";
      setOfferSymbolAndModel(multilegOffer);
    } //
    else {
      typedAssign(multilegOffer, { [attributeName]: attributeValue });
      //Se a série for alterada, pesquisa novamente os strikes e códigos

      if (attributeName === "serieSelecionada") {
        const options = await pesquisarStrikesMultilegAPI(
          multilegOffer.ativoAtual,
          attributeValue
        );
        if (options) {
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
          dispatch(updateMultilegStateAction("multileg", updatedMultilegTabs));
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
      //Se o código mudar, deve ser verificado se o novo código já está presente nos books
      updatedMultilegQuotes = cloneMultilegQuotes(updatedMultilegQuotes);

      AddNewMultilegQuote({
        multilegQuotes: updatedMultilegQuotes,
        symbol: multilegOffer.codigoSelecionado,
      });
      dispatch(
        updateMultilegStateAction("cotacoesMultileg", updatedMultilegQuotes)
      );
      updateMultilegQuotesAction({
        dispatch,
        token,
        eventSourceMultilegQuotes: eventSourceCotacao,
        setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
        multilegQuotes: updatedMultilegQuotes,
      });
    }
    const tab = updatedMultilegTabs[tabIndex];
    let tabPrice = calculoPreco(tab, "ultimo", updatedMultilegQuotes).toFixed(
      2
    );

    tabPrice = formatarNumero(tabPrice, 2, ".", ",");
    tab.preco = tabPrice;

    if (attributeName !== "serieSelecionada")
      dispatch(updateMultilegStateAction("multileg", updatedMultilegTabs));
    travarDestravarClique("destravar", "multileg");
  };
};

interface RemoveMultilegOffer {
  tabIndex: number;
  lineIndex: number;
}

export const removeMultilegOfferAction = ({
  tabIndex,
  lineIndex,
}: RemoveMultilegOffer): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    let multilegTabs: MultilegTab[] = cloneMultilegTabs(multileg);
    multilegTabs[tabIndex].tabelaMultileg.splice(lineIndex, 1);

    dispatch(updateMultilegStateAction("multileg", multilegTabs));
  };
};

////

interface AddMultilegOfferAction {
  tabIndex: number;
  offerType: "acao" | "call" | "put";
}

export const addMultilegOfferAction = ({
  tabIndex,
  offerType,
}: AddMultilegOfferAction): MainThunkAction => {
  return async (dispatch, getState) => {
    travarDestravarClique("travar", "multileg");

    const {
      telaPrincipalReducer: { token },
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
    } = getState();

    const data = await addMultilegOffer({
      multilegTabs: multileg,
      offerType,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    updateMultilegQuotesAction({
      dispatch,
      token,
      eventSourceMultilegQuotes: eventSourceCotacao,
      setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
      multilegQuotes: data.multilegQuotes,
    });
    dispatch(updateMultilegStateAction("multileg", data.multilegTabs));
    dispatch(
      updateMultilegStateAction("cotacoesMultileg", data.multilegQuotes)
    );

    travarDestravarClique("destravar", "multileg");
  };
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
  let updatedTabs: MultilegTab[] = cloneMultilegTabs(multilegTabs);
  multilegQuotes = cloneMultilegQuotes(multilegQuotes);

  let offer: MultilegOffer = cloneDeep(newOffer);
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

  //Verifica se o book já foi inserindo, agilizando novas adições de ofertas sem esperar a API
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
  codigoAberto: false,
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
      return;
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

      return;
    }
  });
};

interface updateMultilegQuotesAction {
  dispatch: MainThunkDispatch;
  multilegQuotes: MultilegQuote[];
  token: { accessToken: string; tokenType: string };
  eventSourceMultilegQuotes: EventSource | null;
  setIntervalMultilegQuotes: NodeJS.Timeout | null;
}

//Formato antigo
export const updateMultilegQuotesAction = ({
  dispatch,
  multilegQuotes,
  eventSourceMultilegQuotes,
  setIntervalMultilegQuotes,
  token,
}: updateMultilegQuotesAction) => {
  if (eventSourceMultilegQuotes) {
    eventSourceMultilegQuotes.close();
  }
  if (setIntervalMultilegQuotes) {
    clearInterval(setIntervalMultilegQuotes);
  }

  const symbolsArray: string[] = [];
  multilegQuotes.forEach((quote) => {
    if (!symbolsArray.includes(quote.codigo)) symbolsArray.push(quote.codigo);
  });

  const symbols = symbolsArray.join(",");

  const newSource = atualizarCotacaoMultilegAPI({
    dispatch,
    codigos: symbols,
    arrayCotacoes: multilegQuotes,
    token,
  });

  dispatch(updateMultilegStateAction("eventSourceCotacao", newSource));
};

export const cloneMultilegTabs = (multilegTabs: MultilegTab[]) => {
  return multilegTabs.map((multilegTab) => {
    return {
      ...multilegTab,
      opcoes: multilegTab.opcoes.map((option) => ({ ...option })),
      vencimento: [...multilegTab.vencimento],
      tabelaMultileg: multilegTab.tabelaMultileg.map((offer) => ({ ...offer })),
    };
  });
};

export const cloneMultilegQuotes = (multilegQuotes: MultilegQuote[]) => {
  return multilegQuotes.map((quote) => ({ ...quote }));
};