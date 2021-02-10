import { setPointerWhileAwaiting } from "api/API";
import { error_open_alert } from "constants/AlertaErros";
import { formatarNumero } from "shared/utils/Formatacoes";
import { AlertAPI } from "modules/multileg/types/multileg";
import { MainThunkAction } from "types/ThunkActions";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import {
  addMultilegOffer,
  addMultilegTab,
  cloneMultilegQuotes,
  cloneMultilegTabs,
  updateMultilegStateAction,
  updateMultilegTab,
} from "./MultilegActions";
import { searchMultilegSymbolData } from "./MultilegAPIAction";
import { updateManyMultilegState } from "./utils";
import { globalStore } from "redux/StoreCreation";

export const openAlertInMultileg = (alertItem: AlertAPI): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg, cotacoesMultileg },
      systemReducer: { isOpenMultileg },
    } = getState();

    const { price, param, operator, comment } = alertItem;
    // multileg[0].isAlertOpen = true;
    // multileg[0].ativoAtual = alertItem.structure.symbol;

    dispatch(updateMultilegStateAction("loadingOffers", true));

    dispatch(
      updateManySystemState({
        multilegButtonsVisibility: false,
        createAlertButtonVisibility: true,
      }),
    );

    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    const symbols = alertItem.structure.components.map((component) => {
      return {
        symbol: component.stock.symbol,
        type: component.stock.option ? component.stock.type : undefined,
        model: component.stock.option ? component.stock.model : undefined,
        strike: component.stock.strike,
        qtty: component.qtty,
      };
    });

    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();
    }

    globalStore.dispatch(atualizarDivKeyAction("multileg") as any);
    dispatch(abrirItemBarraLateralAction("isOpenMultileg", true));

    // Adicionar aba
    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const tabIndex = updatedMultilegTabs.length - 1;

    updatedMultilegTabs[tabIndex].isAlertOpen = true;
    updatedMultilegTabs[tabIndex].param = param;
    updatedMultilegTabs[tabIndex].operator = operator;
    updatedMultilegTabs[tabIndex].comment = comment;

    try {
      for (const [offerIndex, offer] of symbols.entries()) {
        //Alterar ativo
        let updatedData = await updateMultilegTab({
          multilegTabs: updatedMultilegTabs,
          tabIndex: tabIndex,
          attributeName: "ativo",
          attributeValue: offer.symbol,
        });

        updatedMultilegTabs = updatedData.multilegTabs;

        //Pesquisar ativo
        updatedData = await searchMultilegSymbolData({
          multilegTabs: updatedMultilegTabs,
          tabIndex: tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });

        updatedMultilegTabs = updatedData.multilegTabs;
        updatedMultilegQuotes = updatedData.multilegQuotes as any;

        const options = updatedMultilegTabs[tabIndex].opcoes.filter(
          (option) => option.symbol === offer.symbol,
        );
        let offerType: any = "";
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

        newOffer.qtde = offer.qtty;

        // Temporario, por enquanto as quantidades não estão multiplas de 100
        if (offer.qtty === 1) {
          newOffer.qtde = offer.qtty * 100;
        } else if (offer.qtty === -1) {
          newOffer.qtde = offer.qtty * 100 * -1;
        }

        if (offer.qtty > 0) {
          newOffer.cv = "compra";
        } else {
          newOffer.cv = "venda";
        }
      }

      let tabPrice = price.toFixed(2);

      tabPrice = formatarNumero(tabPrice, 2, ".", ",");
      updatedMultilegTabs[tabIndex].preco = tabPrice;
    } catch (error) {
      console.log(error);
      alert(error_open_alert);
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

    dispatch(updateMultilegStateAction("loadingOffers", false));
  };
};
