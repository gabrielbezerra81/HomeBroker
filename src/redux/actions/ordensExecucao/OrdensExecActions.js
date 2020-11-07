import {
  MUDAR_VARIAVEL_ORDENS_EXEC,
  MUDA_VARIAVEIS_ORDENS_EXEC,
} from "constants/MenuActionTypes";
import {
  listarOrdensExecAPI,
  setPointerWhileAwaiting,
  cancelarOrdemExecAPI,
  finalizarAMercadoAPI,
  incrementarQtdeOrdemExecAPI,
  incrementarPrecoOrdemExecAPI,
  pesquisarAtivoAPI,
} from "api/API";
import { atualizarOrdensExecAPI } from "api/ReativosAPI";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import {
  addMultilegTab,
  updateMultilegTab,
  addMultilegOffer,
  cloneMultilegTabs,
  cloneMultilegQuotes,
} from "redux/actions/multileg/MultilegActions";
import { searchMultilegSymbolData } from "redux/actions/multileg/MultilegAPIAction";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import {
  calculoPreco,
  calculoMDC,
} from "screens/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { getReducerStateStorePrincipal } from "hooks/utils";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "../system/SystemActions";
import { updateManyMultilegState } from "../multileg/utils";
import * as ActionTypes from "constants/ActionTypes";

export const updateOneOrdersExecStateAction = (nome, valor) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_VARIAVEL_ORDENS_EXEC,
      payload: { nome, valor },
    });
  };
};

export const updateManyOrdersExecStateAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: MUDA_VARIAVEIS_ORDENS_EXEC,
      payload,
    });
  };
};

export const filtrarHistoricoOpAction = () => {
  return (dispatch) => {};
};

export const listOrdersExecAction = (props) => {
  return async (dispatch, getState) => {
    // const { eventSourceOrdensExec } = getReducerStateStorePrincipal(
    //   getState(),
    //   "ordensExec",
    // );

    const { token } = getReducerStateStorePrincipal(getState(), "principal");

    if (token) {
      const ordensExec = await listarOrdensExecAPI();

      dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: ordensExec });

      // setTimeout(
      //   () =>
      //     atualizarOrdensExec({
      //       dispatch,
      //       token,
      //       eventSourceOrdensExec,
      //       listaOrdensExec: ordensExec,
      //     }),
      //   3000,
      // );
    }
  };
};

export const openOrderInMultilegAction = (props, action = "") => {
  return async (dispatch, getState) => {
    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "menusTelaPrincipal",
      parentID: "body",
    });

    const {
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
      systemReducer: { isOpenMultileg, token },
      ordersExecReducer: { ordemAtual },
    } = getState();

    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    //Abrir Multileg
    props.atualizarDivKeyAction("multileg");

    //Se o multileg não estiver aberto, remove a primeira aba e abre o mesmo
    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();
      dispatch(abrirItemBarraLateralAction(props, "isOpenMultileg"));
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = props.zIndex + 1;
      props.aumentarZindexAction("multileg", props.zIndex, true);
    }

    dispatch(
      updateManySystemState({
        multilegButtonsVisibility: true,
        createAlertButtonVisibility: false,
      }),
    );

    // Adicionar aba
    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const tabIndex = updatedMultilegTabs.length - 1;
    //const arrayCodigos = [...new Set(item.offers.map(oferta => oferta.ativo))];

    try {
      for (const [offerIndex, offer] of ordemAtual.offers.entries()) {
        //Alterar ativo

        let updatedData = await updateMultilegTab({
          multilegTabs: updatedMultilegTabs,
          tabIndex: tabIndex,
          attributeName: "ativo",
          attributeValue: offer.ativo,
        });

        updatedMultilegTabs = updatedData.multilegTabs;

        //Pesquisar ativo
        updatedData = await searchMultilegSymbolData({
          multilegTabs: updatedMultilegTabs,
          tabIndex: tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });
        updatedMultilegTabs = updatedData.multilegTabs;
        updatedMultilegQuotes = updatedData.multilegQuotes;

        const options = updatedMultilegTabs[tabIndex].opcoes.filter(
          (option) => option.symbol === offer.ativo,
        );
        let offerType = "";
        if (options.length > 0) offerType = options[0].type.toLowerCase();
        else offerType = "acao";

        //Adicionar oferta
        const multilegDataWithOffer = await addMultilegOffer({
          multilegTabs: updatedMultilegTabs,
          offerType,
          tabIndex: tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });

        updatedMultilegTabs = multilegDataWithOffer.multilegTabs;
        updatedMultilegQuotes = multilegDataWithOffer.multilegQuotes;

        const newOffer =
          updatedMultilegTabs[tabIndex].tabelaMultileg[offerIndex];

        //Ações possíveis do menu de ordens em execução
        if (action === "reabrir") {
          const canceledQtty = offer.qtdeOferta - offer.qtdeExecutada;

          newOffer.qtde = canceledQtty;
        } else newOffer.qtde = offer.qtdeOferta;
        if (action === "oposta")
          newOffer.cv = offer.oferta === "C" ? "venda" : "compra";
        else newOffer.cv = offer.oferta === "C" ? "compra" : "venda";
      }

      let tabPrice = calculoPreco(
        updatedMultilegTabs[tabIndex],
        "ultimo",
        updatedMultilegQuotes,
      ).toFixed(2);

      tabPrice = formatarNumero(tabPrice, 2, ".", ",");
      updatedMultilegTabs[tabIndex].preco = tabPrice;
    } catch (erro) {
      console.log(erro);
      alert(erro_exportar_ordens_multileg);
      setPointerWhileAwaiting({
        lockMode: "destravar",
        id: "menusTelaPrincipal",
        parentID: "body",
      });
    }

    //Disparar atualizações feitas com objeto multileg
    result.multilegTabs = updatedMultilegTabs;

    dispatch(
      updateManyMultilegState({
        multileg: result.multilegTabs,
        abaSelecionada: result.currentTab,
        cotacoesMultileg: updatedMultilegQuotes,
      }),
    );

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "menusTelaPrincipal",
      parentID: "body",
    });
  };
};

export const openOrderInBoletaAction = (props, event, menuAction) => {
  return async (dispatch, getState) => {
    const {
      ordersExecReducer: { ordemAtual },
    } = getState();

    let { boletaName, namespace } = mapOperationToBoletaName(
      ordemAtual.operacao,
    );

    const offer = ordemAtual.offers[0];
    const symbolData = await pesquisarAtivoAPI(ordemAtual.offers[0].ativo);

    let qtty = offer.qtdeOferta;
    if (menuAction === "reabrir") {
      qtty = offer.qtdeOferta - offer.qtdeExecutada;
    }
    if (menuAction === "oposta") {
      let [type, popupName] = boletaName.split("_");
      if (type === "compra") type = "venda";
      else if (type === "venda") type = "compra";
      if (boletaName === "compra_startmovel") popupName = "stopmovel";

      boletaName = [type, popupName].join("");
    }

    const boletaPopupData = {
      dadosOrdemExec: {
        dadosPesquisa: symbolData,
        ativo: offer.ativo,
        qtde: qtty,
        entradaDisparo: offer.precoDisparo,
        entradaExec: offer.precoEnvio,
        preco: offer.precoEnvio ? offer.precoEnvio.toString() : "",
        ...retornaDadosOferta(ordemAtual, boletaName),
      },
      ultimaBoletaAbertaOrdemExec: namespace,
    };

    if (boletaName) {
      props.receberDadosOrdemExecMainReducerAction(boletaPopupData);
      props.abrirFormAction(event, props, "", boletaName);
    }
  };
};

export const cancelarOrdemExecAction = ({ idOrdem }) => {
  return async (dispatch) => {
    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "ordens_execucao",
      parentID: "body",
    });
    await cancelarOrdemExecAPI(idOrdem);
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "ordens_execucao",
      parentID: "body",
    });
  };
};

export const finalizarAMercadoAction = ({ idOrdem }) => {
  return async (dispatch) => {
    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "ordens_execucao",
      parentID: "body",
    });
    await finalizarAMercadoAPI(idOrdem);
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "ordens_execucao",
      parentID: "body",
    });
  };
};

export const aumentarQtdePrecoAction = (actionProps) => {
  return (dispatch) => {
    const { ordemAtual, valorSomar, modo } = actionProps;
    const { id } = ordemAtual;
    const ofertas = [...ordemAtual.offers];
    const arrayQtde = ofertas.map((oferta) => oferta.qtdeOferta);
    const mdc = calculoMDC(arrayQtde);

    if (modo === "qtde") {
      let acrescimo = 0;
      ofertas.forEach((oferta) => {
        const unidade = oferta.qtdeOferta / mdc;
        acrescimo += valorSomar * unidade;
      });
      incrementarQtdeOrdemExecAPI(id, acrescimo);
    } //
    else if (modo === "preco") {
      let precoTotal = 0;
      ofertas.forEach((oferta) => {
        const unidade = oferta.qtdeOferta / mdc;
        precoTotal += oferta.precoEnvio * unidade;
      });
      precoTotal += valorSomar;
      incrementarPrecoOrdemExecAPI(id, precoTotal);
    }
  };
};

const mapOperationToBoletaName = (operacao) => {
  const data = {
    boletaName: "",
    namespace: "",
  };
  switch (operacao) {
    case "Compra a Mercado":
      data.boletaName = "compra_mercado";
      data.namespace = ActionTypes.COMPRA_MERCADO_NAMESPACE;
      break;
    case "Compra Limitada":
      data.boletaName = "compra_limitada";
      data.namespace = ActionTypes.COMPRA_LIMITADA_NAMESPACE;
      break;
    case "Compra Agendada":
      data.boletaName = "compra_agendada";
      data.namespace = ActionTypes.COMPRA_AGENDADA_NAMESPACE;
      break;
    case "Compra Start Stop":
      data.boletaName = "compra_startstop";
      data.namespace = ActionTypes.COMPRA_STARTSTOP_NAMESPACE;
      break;
    case "Compra Stop Móvel":
      data.boletaName = "compra_startmovel";
      data.namespace = ActionTypes.COMPRA_STARTMOVEL_NAMESPACE;
      break;
    case "Venda a Mercado":
      data.boletaName = "venda_mercado";
      data.namespace = ActionTypes.VENDA_MERCADO_NAMESPACE;
      break;
    case "Venda Limitada":
      data.boletaName = "venda_limitada";
      data.namespace = ActionTypes.VENDA_LIMITADA_NAMESPACE;
      break;
    case "Venda Agendada":
      data.boletaName = "venda_agendada";
      data.namespace = ActionTypes.VENDA_AGENDADA_NAMESPACE;
      break;
    case "Venda Start Stop":
      data.boletaName = "venda_startstop";
      data.namespace = ActionTypes.VENDA_STARTSTOP_NAMESPACE;
      break;
    case "Venda Stop Móvel":
      data.boletaName = "venda_stopmovel";
      data.namespace = ActionTypes.VENDA_STOPMOVEL_NAMESPACE;
      break;
    default:
      return data;
  }

  return data;
};

const retornaDadosOferta = (ordemAtual, tipo) => {
  const dadosOferta = {
    inicioDisparo: "",
    gainDisparo: "",
    gainExec: "",
    stopDisparo: "",
    stopExec: "",
    ajustePadrao: "",
    tabelaOrdens: [],
  };

  if (["compra_startstop", "venda_startstop"].includes(tipo)) {
    let oferta1, oferta2;

    if (ordemAtual.offers[0]) {
      oferta1 = ordemAtual.offers[0];
      dadosOferta.gainDisparo = oferta1.precoDisparo;
      dadosOferta.gainExec = oferta1.precoEnvio;
    }

    if (ordemAtual.offers[1]) {
      oferta2 = ordemAtual.offers[1];
      dadosOferta.stopDisparo = oferta2.precoDisparo;
      dadosOferta.stopExec = oferta2.precoEnvio;
    }
  } //
  else if (["compra_startmovel", "venda_stopmovel"].includes(tipo)) {
    const ofertaPrincipal = ordemAtual.offers[0];

    const arrayAjustes = ordemAtual.offers.filter(
      (oferta, index) => index !== 0,
    );
    const segundaOrdem = arrayAjustes[arrayAjustes.length - 1];

    if (segundaOrdem) {
      dadosOferta.inicioDisparo = segundaOrdem.precoDisparo;
      dadosOferta.ajustePadrao = segundaOrdem.precoEnvio;
    }
    dadosOferta.stopDisparo = ofertaPrincipal.precoDisparo;
    dadosOferta.stopExec = ofertaPrincipal.precoEnvio;

    arrayAjustes.pop();
    arrayAjustes.forEach((ofertaAjuste, indice) => {
      let novoStop, disparo, stopAtual;
      const ajuste = ofertaAjuste.precoEnvio;

      if (indice === 0) {
        stopAtual = dadosOferta.stopDisparo;
        disparo = ofertaAjuste.precoDisparo;
      } else {
        const linhaAnterior = dadosOferta.tabelaOrdens[indice - 1];
        disparo =
          tipo === "compra_startmovel"
            ? linhaAnterior.disparo - linhaAnterior.ajuste
            : linhaAnterior.disparo + linhaAnterior.ajuste;
        stopAtual = linhaAnterior.novoStop;
      }

      novoStop =
        tipo === "compra_startmovel" ? stopAtual - ajuste : stopAtual + ajuste;

      dadosOferta.tabelaOrdens.push({
        disparo: disparo,
        stopAtual: stopAtual,
        ajuste: ofertaAjuste.precoEnvio,
        novoStop: novoStop,
        tipo: "real",
      });
    });
  } //
  else {
    let next1, next2;
    if (ordemAtual.nextOrders[0]) {
      next1 = ordemAtual.nextOrders[0].offers[0];
      dadosOferta.gainDisparo = next1.precoDisparo;
      dadosOferta.gainExec = next1.precoEnvio;
    }
    if (ordemAtual.nextOrders[1]) {
      next2 = ordemAtual.nextOrders[1].offers[0];
      dadosOferta.stopDisparo = next2.precoDisparo;
      dadosOferta.stopExec = next2.precoEnvio;
    }
  }
  return dadosOferta;
};

// const atualizarOrdensExecAction = (props) => {
//   return (dispatch, getState) => {
//     const {
//       eventSourceOrdensExec,
//       tabelaOrdensExecucao,
//     } = getReducerStateStorePrincipal(getState(), "ordensExec");
//     const { token } = getReducerStateStorePrincipal(getState(), "principal");

//     atualizarOrdensExec({
//       dispatch,
//       listaOrdensExec: tabelaOrdensExecucao,
//       eventSourceOrdensExec,
//       token,
//     });
//   };
// };

// const atualizarOrdensExec = ({
//   dispatch,
//   eventSourceOrdensExec,
//   token,
//   listaOrdensExec,
// }) => {
//   if (eventSourceOrdensExec && eventSourceOrdensExec.close) {
//     eventSourceOrdensExec.close();
//   }

//   const eventSource = atualizarOrdensExecAPI({
//     dispatch,
//     listaOrdensExec,
//     token,
//   });

//   dispatch(
//     updateOneOrdersExecStateAction("eventSourceOrdensExec", eventSource),
//   );
// };

export const startReactiveOrdersUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token },
      ordersExecReducer: { eventSourceOrdensExec, tabelaOrdensExecucao },
    } = getState();

    if (eventSourceOrdensExec && eventSourceOrdensExec.close) {
      eventSourceOrdensExec.close();
    }

    const eventSource = atualizarOrdensExecAPI({
      dispatch,
      listaOrdensExec: tabelaOrdensExecucao,
      token,
    });

    dispatch(
      updateOneOrdersExecStateAction("eventSourceOrdensExec", eventSource),
    );
  };
};

export const startProactiveOrdersUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token },
      ordersExecReducer: { eventSourceOrdensExec, tabelaOrdensExecucao },
    } = getState();

    if (eventSourceOrdensExec && eventSourceOrdensExec.close) {
      eventSourceOrdensExec.close();
    }
  };
};

export const openOrdersExecFromRightMenuAction = () => {
  return (dispatch, getState) => {};
};
