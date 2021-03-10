import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import {
  addMultilegOffer,
  addMultilegTab,
  cloneMultilegQuotes,
  cloneMultilegTabs,
  updateMultilegTab,
} from "modules/multileg/duck/actions/MultilegActions";
import { searchMultilegSymbolData } from "modules/multileg/duck/actions/MultilegAPIAction";
import {
  mountMultilegOrder,
  validateMultilegOrder,
} from "modules/multileg/duck/actions/utils";
import {
  abrirItemBarraLateralAction,
  sendMultilegToCurrentTabAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import { MainStoreState } from "redux/StoreCreation";

import { formatarNumero } from "shared/utils/Formatacoes";
import { calculoPreco } from "modules/multileg/screens/CalculoPreco";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import { globalStore } from "redux/StoreCreation";
import { toast } from "react-toastify";

interface ExportBoxProps {
  dispatch: any;
  getState: () => MainStoreState;
  boxId: string;
  shouldOpenMultileg?: boolean;
}

export const exportBoxToMultileg = async ({
  dispatch,
  getState,
  boxId,
  shouldOpenMultileg = true,
}: ExportBoxProps) => {
  const {
    multiBoxReducer: { boxes },
    multilegReducer: { multileg, cotacoesMultileg },
    systemReducer: { isOpenMultileg },
  } = getState();

  const {
    GlobalReducer: { zIndex },
  } = globalStore.getState();

  const box = boxes.find((box) => box?.id === boxId);

  if (box) {
    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    globalStore.dispatch(atualizarDivKeyAction("multileg") as any);

    dispatch(sendMultilegToCurrentTabAction());

    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();

      if (shouldOpenMultileg) {
        dispatch(abrirItemBarraLateralAction("isOpenMultileg"));
      }
    } //
    else if (shouldOpenMultileg) {
      //Traz para primeiro plano se já estiver aberto
      globalStore.dispatch(
        aumentarZindexAction("multileg", zIndex, true) as any,
      );
    }

    if (shouldOpenMultileg) {
      dispatch(
        updateManySystemState({
          multilegButtonsVisibility: true,
          createAlertButtonVisibility: false,
        }),
      );
    }

    // Adicionar nova aba
    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const tabIndex = updatedMultilegTabs.length - 1;

    try {
      for (const [offerIndex, offer] of box.boxOffers.entries()) {
        let updatedData = await updateMultilegTab({
          multilegTabs: updatedMultilegTabs,
          tabIndex,
          attributeName: "ativo",
          attributeValue: offer.selectedCode,
        });

        updatedMultilegTabs = updatedData.multilegTabs;

        updatedData = await searchMultilegSymbolData({
          multilegTabs: updatedMultilegTabs,
          tabIndex,
          multilegQuotes: updatedMultilegQuotes,
        });

        updatedMultilegTabs = updatedData.multilegTabs;

        if (updatedData.multilegQuotes) {
          updatedMultilegQuotes = updatedData.multilegQuotes;
        }

        const options = updatedMultilegTabs[tabIndex].opcoes.filter(
          (option) => option.symbol === offer.selectedCode,
        );

        let offerType: any = "";
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

        newOffer.qtde = offer.qtty;
        newOffer.cv = offer.offerType === "C" ? "compra" : "venda";

        //
      }

      let tabPrice = calculoPreco(
        updatedMultilegTabs[tabIndex],
        "ultimo",
        updatedMultilegQuotes,
      ).toFixed(2);

      tabPrice = formatarNumero(tabPrice, 2, ".", ",");
      updatedMultilegTabs[tabIndex].preco = tabPrice;
    } catch (error) {
      console.log(error);
      toast.error(erro_exportar_ordens_multileg);
    }

    // Efetuar atualizações feitas com objeto multileg no bloco try/catch
    result.multilegTabs = updatedMultilegTabs;

    return {
      multileg: result.multilegTabs,
      abaSelecionada: result.currentTab,
      cotacoesMultileg: updatedMultilegQuotes,
    };
  }
};

interface MountOrderForOperations
  extends Omit<ExportBoxProps, "shouldOpenMultileg" | "boxId"> {
  multiBox: MultiBoxData;
  commentConfig: string;
}

export const mountOrderForOperations = async ({
  multiBox,
  dispatch,
  getState,
  commentConfig,
}: MountOrderForOperations) => {
  const {
    systemReducer: { selectedAccount },
  } = getState();

  const { id: boxId } = multiBox;

  const data = await exportBoxToMultileg({
    boxId,
    dispatch,
    getState,
    shouldOpenMultileg: false,
  });

  if (data) {
    const tabIndex = data.multileg.length - 1;

    data.multileg[tabIndex].editingOrderId =
      multiBox.tab1Id !== -1 ? multiBox.tab1Id : null;

    const mountOrderProps = {
      multilegTabs: data.multileg,
      selectedAccount: selectedAccount,
      tabIndex,
      comment: commentConfig,
    };

    if (validateMultilegOrder(mountOrderProps)) {
      const newBoxRequestData = mountMultilegOrder(mountOrderProps);

      return newBoxRequestData;
    }
  }

  return null;
};
