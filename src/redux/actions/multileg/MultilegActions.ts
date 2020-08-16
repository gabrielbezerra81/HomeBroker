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
  encontrarNumMaisProximo,
  adicionaCotacoesMultileg,
  verificaCotacaoJaAdd,
  modificarVariavelMultileg,
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

export const modificarVariavelMultilegAction = (
  attributeName: string,
  attributeValue: MultilegState[keyof MultilegState]
): MainThunkAction => {
  return (dispatch) => {
    dispatch(
      modificarVariavelMultileg({ nome: attributeName, valor: attributeValue })
    );
  };
};

export const abrirFecharConfigComplAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { configComplementarAberto },
    } = getState();

    dispatch(
      modificarVariavelMultilegAction(
        "configComplementarAberto",
        !configComplementarAberto
      )
    );
  };
};

////

export const selecionarAdicionarAbaAction = (key: string): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    if (key === "adicionar") {
      let modifiedMultilegTabs = adicionarAba(multileg);
      dispatch(
        modificarVariavelMultilegAction(
          "multileg",
          modifiedMultilegTabs.abasMultileg
        )
      );
      dispatch(
        modificarVariavelMultilegAction(
          "abaSelecionada",
          modifiedMultilegTabs.abaAtual
        )
      );
    } else {
      dispatch(modificarVariavelMultilegAction("abaSelecionada", key));
    }
  };
};

export const adicionarAba = (multilegTabs: MultilegTab[]) => {
  let abasMultileg = clonarMultileg(multilegTabs);

  const novaAba = cloneDeep(aba);
  novaAba.nomeAba = "Ordem " + (abasMultileg.length + 1);
  let abaAtual = "tab" + abasMultileg.length;

  abasMultileg.push(novaAba);

  return { abasMultileg: abasMultileg, abaAtual: abaAtual };
};

////

export const excluirAbaMultilegAction = (tabIndex: number): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    let abasMultileg = clonarMultileg(multileg);

    if (tabIndex > 0) {
      const key = "tab" + (tabIndex - 1);
      dispatch(modificarVariavelMultilegAction("abaSelecionada", key));
    }

    abasMultileg.splice(tabIndex, 1);

    dispatch(modificarVariavelMultilegAction("multileg", abasMultileg));
  };
};

////
interface ChangeTabAttributeAction {
  tabIndex: number;
  attributeName: string;
  attributeValue: any;
}

export const modificarAtributoAbaAction = ({
  tabIndex,
  attributeName,
  attributeValue,
}: ChangeTabAttributeAction): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg, cotacoesMultileg },
    } = getState();

    const dados = await modificarAba({
      multilegTabs: multileg,
      tabIndex,
      attributeName,
      attributeValue,
      multilegQuotes: cotacoesMultileg,
    });
    dispatch(modificarVariavelMultilegAction("multileg", dados.abasMultileg));
    if (dados.cotacoesMultileg)
      dispatch(
        modificarVariavelMultilegAction(
          "cotacoesMultileg",
          dados.cotacoesMultileg
        )
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

export const modificarAba = async ({
  multilegTabs,
  tabIndex,
  attributeName,
  attributeValue,
  multilegQuotes,
}: ChangeTabAttribute) => {
  travarDestravarClique("travar", "multileg");
  let abasMultileg = clonarMultileg(multilegTabs);
  let cotacoesMultileg;

  if (attributeName === "limpar") {
    abasMultileg[tabIndex] = cloneDeep(aba);
    abasMultileg[tabIndex].nomeAba = "Ordem " + (tabIndex + 1);
  } else {
    if (attributeName === "ativo")
      attributeValue = attributeValue.toUpperCase();

    typedAssign(abasMultileg[tabIndex], { [attributeName]: attributeValue });

    if (attributeName === "vencimentoSelecionado") {
      // TODO: possível side effect
      if (multilegQuotes)
        cotacoesMultileg = clonarArrayCotacoes(multilegQuotes);
      const codigo = multilegTabs[tabIndex].ativoAtual;
      multilegTabs[tabIndex].ativo = codigo;

      if (!verificaCotacaoJaAdd(cotacoesMultileg, codigo)) {
        const dadosAtivo = await pesquisarAtivoAPI(codigo);
        console.log(dadosAtivo);
        var cotacao = dadosAtivo.cotacaoAtual;
        adicionaCotacoesMultileg(cotacoesMultileg, codigo, cotacao);
      }

      const dados = await pesquisarStrikesMultilegAPI(
        codigo,
        multilegTabs[tabIndex].vencimentoSelecionado
      );
      if (dados) {
        abasMultileg[tabIndex].opcoes = [...dados];
        abasMultileg[tabIndex].strikeSelecionado = encontrarNumMaisProximo(
          dados,
          abasMultileg[tabIndex].strikeSelecionado
        );
      }
    }
  }
  travarDestravarClique("destravar", "multileg");
  return { abasMultileg, cotacoesMultileg };
};

////

interface ChangeTableOfferAttributeAction {
  tabIndex: number;
  lineIndex: number;
  attributeName: keyof Omit<MultilegOffer, "opcoes">;
  attributeValue: MultilegOffer[keyof Omit<MultilegOffer, "opcoes">];
}

export const modificarAtributoTabelaAbaAction = ({
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

    let abasMultileg: MultilegTab[] = clonarMultileg(multileg);
    let linhaTabela = abasMultileg[tabIndex].tabelaMultileg[lineIndex];
    let modifiedMultilegQuotes: MultilegQuote[] = clonarArrayCotacoes(
      cotacoesMultileg
    );

    const codigoAnterior = linhaTabela.codigoSelecionado;

    if (attributeName === "tipo") {
      if (attributeValue === "call") linhaTabela[attributeName] = "put";
      else if (attributeValue === "put") linhaTabela[attributeName] = "call";
      pesquisarSymbolModel_strike_tipo(linhaTabela);
    } //
    else {
      typedAssign(linhaTabela, { [attributeName]: attributeValue });
      //Se a série for alterada, pesquisa novamente os strikes e códigos

      if (attributeName === "serieSelecionada") {
        const dados = await pesquisarStrikesMultilegAPI(
          linhaTabela.ativoAtual,
          attributeValue
        );
        if (dados) {
          linhaTabela.opcoes = [...dados];

          const pesquisa = linhaTabela.opcoes.find((optionsItem) => {
            const option = optionsItem as MultilegOption;
            return option.strike === linhaTabela.strikeSelecionado;
          });
          // const cotacaoAnterior = cotacoesMultileg.find(
          //   (cotacao) => cotacao.codigo === codigoAnterior
          // );

          if (!pesquisa) {
            linhaTabela.strikeSelecionado = encontrarNumMaisProximo(
              dados,
              linhaTabela.strikeSelecionado //todo
            );
          }
          pesquisarSymbolModel_strike_tipo(linhaTabela);
          dispatch(modificarVariavelMultilegAction("multileg", abasMultileg));
        }
      } //
      else if (attributeName === "strikeSelecionado") {
        pesquisarSymbolModel_strike_tipo(linhaTabela);
      } //
      else if (attributeName === "codigoSelecionado") {
        pesquisarSerieStrikeModeloTipo_symbol(linhaTabela);
      } //
    }

    if (codigoAnterior !== linhaTabela.codigoSelecionado) {
      //Se o código mudar, deve ser verificado se o novo código já está presente nos books
      modifiedMultilegQuotes = clonarArrayCotacoes(modifiedMultilegQuotes);

      adicionaCotacoesMultileg(
        modifiedMultilegQuotes,
        linhaTabela.codigoSelecionado
      );
      dispatch(
        modificarVariavelMultilegAction(
          "cotacoesMultileg",
          modifiedMultilegQuotes
        )
      );
      atualizarCotacaoMultilegAction({
        dispatch,
        token,
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        cotacoesMultileg: modifiedMultilegQuotes,
      });
    }
    const aba = abasMultileg[tabIndex];
    let calculo = calculoPreco(aba, "ultimo", modifiedMultilegQuotes).toFixed(
      2
    );

    calculo = formatarNumero(calculo, 2, ".", ",");
    aba.preco = calculo;

    if (attributeName !== "serieSelecionada")
      dispatch(modificarVariavelMultilegAction("multileg", abasMultileg));
    travarDestravarClique("destravar", "multileg");
  };
};

interface RemoveMultilegOffer {
  tabIndex: number;
  lineIndex: number;
}

export const excluirOfertaTabelaAction = ({
  tabIndex,
  lineIndex,
}: RemoveMultilegOffer): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
    } = getState();

    let abasMultileg: MultilegTab[] = clonarMultileg(multileg);
    abasMultileg[tabIndex].tabelaMultileg.splice(lineIndex, 1);

    dispatch(modificarVariavelMultilegAction("multileg", abasMultileg));
  };
};

////

interface AddMultilegOfferAction {
  tabIndex: number;
  offerType: "acao" | "call" | "put";
}

export const adicionarOfertaTabelaAction = ({
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

    const dados = await adicionarOferta({
      multilegTabs: multileg,
      offerType,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    atualizarCotacaoMultilegAction({
      dispatch,
      token,
      eventSourceCotacao,
      setIntervalCotacoesMultileg,
      cotacoesMultileg: dados.cotacoesMultileg,
    });
    dispatch(modificarVariavelMultilegAction("multileg", dados.abasMultileg));
    dispatch(
      modificarVariavelMultilegAction(
        "cotacoesMultileg",
        dados.cotacoesMultileg
      )
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

export const adicionarOferta = async ({
  multilegTabs,
  offerType,
  tabIndex,
  multilegQuotes,
}: AddMultilegOffer) => {
  let abasMultileg: MultilegTab[] = clonarMultileg(multilegTabs);
  multilegQuotes = clonarArrayCotacoes(multilegQuotes);

  let novaOferta: MultilegOffer = cloneDeep(oferta);
  let cotacao = 0;

  novaOferta.ativoAtual = abasMultileg[tabIndex].ativoAtual;

  if (offerType === "acao") {
    novaOferta.opcoes = [{ symbol: abasMultileg[tabIndex].ativoAtual }];
    novaOferta.codigoSelecionado = abasMultileg[tabIndex].ativoAtual;
  } else {
    novaOferta.strikeSelecionado = abasMultileg[tabIndex].strikeSelecionado;
    novaOferta.serie = [...abasMultileg[tabIndex].vencimento];
    novaOferta.serieSelecionada = abasMultileg[tabIndex].vencimentoSelecionado;
    novaOferta.opcoes = [...abasMultileg[tabIndex].opcoes];

    if (offerType === "call") {
      novaOferta.tipo = "call";
    } else if (offerType === "put") {
      novaOferta.tipo = "put";
    }
    pesquisarSymbolModel_strike_tipo(novaOferta);
  }
  const novoCodigo = novaOferta.codigoSelecionado;

  if (!verificaCotacaoJaAdd(multilegQuotes, novoCodigo)) {
    const dadosAtivo = await pesquisarAtivoAPI(novaOferta.codigoSelecionado);
    if (dadosAtivo) cotacao = Number(dadosAtivo.cotacaoAtual);
  }

  adicionaCotacoesMultileg(multilegQuotes, novoCodigo, cotacao);

  //Verifica se o book já foi inserindo, agilizando novas adições de ofertas sem esperar a API
  // if (!verificaBookJaAdd(cotacoesMultileg, novoCodigo)) {
  //   const book = await listarBookOfertaAPI(novaOferta.codigoSelecionado);
  //   if (book) {
  //     const bookCompra = book.tabelaOfertasCompra[0];
  //     const bookVenda =
  //       book.tabelaOfertasVenda[book.tabelaOfertasVenda.length - 1];

  //     AdicionaCodigoBooksMultileg(
  //       cotacoesMultileg,
  //       novaOferta.codigoSelecionado,
  //       bookCompra,
  //       bookVenda
  //     );
  //   }
  // }

  abasMultileg[tabIndex].tabelaMultileg.push(novaOferta);

  const aba = abasMultileg[tabIndex];
  let calculo = calculoPreco(aba, "ultimo", multilegQuotes).toFixed(2);
  calculo = formatarNumero(calculo, 2, ".", ",");
  aba.preco = calculo;

  return { abasMultileg, cotacoesMultileg: multilegQuotes };
};

export const oferta: MultilegOffer = {
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

export const aba: MultilegTab = {
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

const pesquisarSymbolModel_strike_tipo = (multilegOffer: MultilegOffer) => {
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

const pesquisarSerieStrikeModeloTipo_symbol = (
  multilegOffer: MultilegOffer
) => {
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
  cotacoesMultileg: MultilegQuote[];
  token: { accessToken: string; tokenType: string };
  eventSourceCotacao: EventSource | null;
  setIntervalCotacoesMultileg: NodeJS.Timeout | null;
}

//Formato antigo
export const atualizarCotacaoMultilegAction = ({
  dispatch,
  cotacoesMultileg,
  eventSourceCotacao,
  setIntervalCotacoesMultileg,
  token,
}: updateMultilegQuotesAction) => {
  if (eventSourceCotacao) {
    eventSourceCotacao.close();
  }
  if (setIntervalCotacoesMultileg) {
    clearInterval(setIntervalCotacoesMultileg);
  }
  let codigos = "";

  cotacoesMultileg.forEach((cotacao) => {
    if (!codigos.includes(cotacao.codigo)) codigos += cotacao.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarCotacaoMultilegAPI({
    dispatch,
    codigos,
    arrayCotacoes: cotacoesMultileg,
    token,
  });

  dispatch(modificarVariavelMultilegAction("eventSourceCotacao", newSource));
};

export const clonarMultileg = (multilegTabs: MultilegTab[]) => {
  return multilegTabs.map((aba) => {
    return {
      ...aba,
      opcoes: aba.opcoes.map((opcao) => ({ ...opcao })),
      vencimento: [...aba.vencimento],
      tabelaMultileg: aba.tabelaMultileg.map((oferta) => ({ ...oferta })),
    };
  });
};

export const clonarArrayCotacoes = (array: MultilegQuote[]) => {
  return array.map((cotacao) => ({ ...cotacao }));
};
