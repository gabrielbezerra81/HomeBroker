import { setPointerWhileAwaiting } from "api/API";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import {
  addMultilegTab,
  updateMultilegTab,
  updateMultilegQuotesAction,
  addMultilegOffer,
  cloneMultilegQuotes,
  cloneMultilegTabs,
} from "redux/actions/multileg/MultilegActions";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { searchMultilegSymbolData } from "redux/actions/multileg/MultilegAPIAction";
import { calculoPreco } from "screens/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { updateManyTHLState, updateOneTHLState } from "./utils";
import { updateManyMultilegState } from "../multileg/utils";

export const mudarVariavelTHLAction = (nome, valor) => {
  return (dispatch) => {
    dispatch(updateOneTHLState({ attributeName: nome, attributeValue: valor }));
  };
};

export const mudarVariaveisTHLAction = (payload) => {
  return (dispatch) => {
    dispatch(updateManyTHLState(payload));
  };
};

export const abrirMultilegTHLAction = (props) => {
  // Actions
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
      thlReducer: { booksSelecionados },
    } = getState();

    let { zIndex, dispatchGlobal } = props;

    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    dispatchGlobal(atualizarDivKeyAction("multileg"));

    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();
      dispatch(abrirItemBarraLateralAction(props, "isOpenMultileg"));
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = zIndex + 1;
      dispatchGlobal(aumentarZindexAction("multileg", zIndex, true));
    }

    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const tabIndex = updatedMultilegTabs.length - 1;

    try {
      for (const [offerIndex, book] of booksSelecionados.entries()) {
        let updatedData = await updateMultilegTab({
          multilegTabs: updatedMultilegTabs,
          tabIndex,
          attributeName: "ativo",
          attributeValue: book.ativo,
        });

        updatedMultilegTabs = updatedData.multilegTabs;

        updatedData = await searchMultilegSymbolData({
          multilegTabs: updatedMultilegTabs,
          tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });

        updatedMultilegTabs = updatedData.multilegTabs;
        updatedMultilegQuotes = updatedData.multilegQuotes;

        const options = updatedMultilegTabs[tabIndex].opcoes.filter(
          (option) => option.symbol === book.ativo,
        );

        let offerType = "";
        if (options.length > 0) offerType = options[0].type.toLowerCase();
        else offerType = "acao";

        //Adicionar oferta
        const dadosMultileg = await addMultilegOffer({
          multilegTabs: updatedMultilegTabs,
          offerType,
          tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });
        updatedMultilegTabs = dadosMultileg.multilegTabs;
        updatedMultilegQuotes = dadosMultileg.multilegQuotes;

        const newOffer =
          updatedMultilegTabs[tabIndex].tabelaMultileg[offerIndex];

        newOffer.qtde = 100;
        newOffer.cv = book.tipo;
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
    }

    result.multilegTabs = updatedMultilegTabs;

    dispatch(
      updateManyMultilegState({
        multileg: result.multilegTabs,
        abaSelecionada: result.currentTab,
        cotacoesMultileg: updatedMultilegQuotes,
      }),
    );

    updateMultilegQuotesAction({
      dispatch,
      multilegQuotes: updatedMultilegQuotes,
      eventSourceMultilegQuotes: eventSourceCotacao,
      setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
      token,
    });

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "menusTelaPrincipal",
      parentID: "body",
    });
  };
};
