import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import {
  abrirItemBarraLateralAction,
  sendMultilegToCurrentTabAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import {
  addMultilegTab,
  updateMultilegTab,
  addMultilegOffer,
  cloneMultilegQuotes,
  cloneMultilegTabs,
  updateMultilegStateAction,
} from "modules/multileg/duck/actions/MultilegActions";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { searchMultilegSymbolData } from "modules/multileg/duck/actions/MultilegAPIAction";
import { calculatePrice } from "modules/multileg/screens/CalculoPreco";
import { formatarNumero } from "shared/utils/Formatacoes";
import { updateManyTHLState } from "./utils";
import { updateManyMultilegState } from "modules/multileg/duck/actions/utils";
import { globalStore } from "redux/StoreCreation";
import { toast } from "react-toastify";

export const mudarVariavelTHLAction = (nome, valor) => {
  return (dispatch) => {
    dispatch(updateManyTHLState({ [nome]: valor }));
  };
};

export const mudarVariaveisTHLAction = (payload) => {
  return (dispatch) => {
    dispatch(updateManyTHLState(payload));
  };
};

export const abrirMultilegTHLAction = () => {
  // Actions
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg, cotacoesMultileg },
      systemReducer: { isOpenMultileg },
      thlReducer: { booksSelecionados },
    } = getState();

    const {
      GlobalReducer: { zIndex },
    } = globalStore.getState();

    dispatch(sendMultilegToCurrentTabAction());

    dispatch(updateMultilegStateAction("loadingOffers", true));

    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    globalStore.dispatch(atualizarDivKeyAction("multileg"));

    if (isOpenMultileg) {
      //Traz para primeiro plano se já estiver aberto
      globalStore.dispatch(aumentarZindexAction("multileg", zIndex + 1, true));
    } //
    else {
      clonedMultilegTabs.pop();
      dispatch(abrirItemBarraLateralAction("isOpenMultileg"));
    }

    dispatch(
      updateManySystemState({
        multilegButtonsVisibility: true,
        createAlertButtonVisibility: false,
      }),
    );

    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const tabIndex = updatedMultilegTabs.length - 1;

    dispatch(
      updateManyMultilegState({
        abaSelecionada: result.currentTab,
        multileg: result.multilegTabs,
      }),
    );

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

      let tabPrice = calculatePrice({
        multilegTab: updatedMultilegTabs[tabIndex],
        type: "ultimo",
        multilegQuotes: updatedMultilegQuotes,
      }).toFixed(2);

      tabPrice = formatarNumero(tabPrice, 2, ".", ",");
      updatedMultilegTabs[tabIndex].preco = tabPrice;
    } catch (erro) {
      console.log(erro);
      toast.error(erro_exportar_ordens_multileg);
    }

    result.multilegTabs = updatedMultilegTabs;

    dispatch(
      updateManyMultilegState({
        multileg: result.multilegTabs,
        abaSelecionada: result.currentTab,
        cotacoesMultileg: updatedMultilegQuotes,
      }),
    );

    dispatch(updateMultilegStateAction("loadingOffers", false));
  };
};
