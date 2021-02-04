import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { Dispatch } from "redux";
import { MainStoreState } from "redux/reducers";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { calculoPreco } from "screens/popups/multileg_/CalculoPreco";
import { MultiBoxData } from "types/multiBox/MultiBoxState";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "../GlobalAppActions";
import {
  addMultilegOffer,
  addMultilegTab,
  cloneMultilegQuotes,
  cloneMultilegTabs,
  updateMultilegTab,
} from "../multileg/MultilegActions";
import { searchMultilegSymbolData } from "../multileg/MultilegAPIAction";
import { mountMultilegOrder, validateMultilegOrder } from "../multileg/utils";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "../system/SystemActions";

interface ExportBoxProps {
  dispatch: any;
  dispatchGlobal: any;
  getState: () => MainStoreState;
  zIndex: number;
  boxId: string;
  shouldOpenMultileg?: boolean;
}

export const exportBoxToMultileg = async ({
  dispatch,
  dispatchGlobal,
  getState,
  zIndex,
  boxId,
  shouldOpenMultileg = true,
}: ExportBoxProps) => {
  const {
    multiBoxReducer: { boxes },
    multilegReducer: { multileg, cotacoesMultileg },
    systemReducer: { isOpenMultileg },
  } = getState();

  const box = boxes.find((box) => box.id === boxId);

  if (box) {
    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    dispatchGlobal(atualizarDivKeyAction("multileg"));

    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();

      if (shouldOpenMultileg) {
        dispatch(abrirItemBarraLateralAction("isOpenMultileg"));
      }
    } else if (shouldOpenMultileg) {
      //Traz para primeiro plano se já estiver aberto
      const multilegPopup = document.getElementById("multileg");
      if (multilegPopup) {
        multilegPopup.style.zIndex = `${zIndex + 1}`;
        dispatchGlobal(aumentarZindexAction("multileg", zIndex, true));
      }
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

        newOffer.qtde = 100;
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
      alert(erro_exportar_ordens_multileg);
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
  zIndex,
  dispatchGlobal,
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
    zIndex,
    dispatchGlobal,
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
