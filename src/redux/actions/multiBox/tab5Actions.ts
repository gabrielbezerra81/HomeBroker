import moment from "moment";

import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import produce from "immer";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { calculoPreco } from "screens/popups/multileg_/CalculoPreco";
import {
  BoxOffer,
  BoxStockOption,
  MultiBoxData,
  TopSymbol,
} from "types/multiBox/MultiBoxState";

import { MainThunkAction } from "types/ThunkActions";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "../GlobalAppActions";
import {
  addMultilegOffer,
  addMultilegTab,
  cloneMultilegQuotes,
  cloneMultilegTabs,
  updateMultilegStateAction,
  updateMultilegTab,
} from "../multileg/MultilegActions";
import { searchMultilegSymbolData } from "../multileg/MultilegAPIAction";
import { findClosestStrike, updateManyMultilegState } from "../multileg/utils";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "../system/SystemActions";
import {
  updateBoxAttrAction,
  updateManyMultiBoxAction,
} from "./multiBoxActions";

export const handleSearchBoxSymbolAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch) => {
    const data = await pesquisarAtivoMultilegAPI(symbol);

    if (data) {
      const payload: Partial<MultiBoxData> = {
        expirations: data.vencimentos,
        searchedSymbol: symbol,
        stockSymbol: data.ativoPrincipal,
        selectedExpiration: data.vencimentos[0],
        stockOptions: [],
        selectedStrike: 0,
      };

      payload.stockOptions = data.opcoes.sort(
        (a: BoxStockOption, b: BoxStockOption) => a.strike - b.strike,
      );

      const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

      payload.selectedStrike = findClosestStrike({
        options: data.opcoes,
        symbolQuote: data.cotacaoAtual,
        symbol,
        symbolIsOption,
      });

      dispatch(updateBoxAttrAction(id, payload));
    }
  };
};

export const handleRemoveOfferAction = (
  boxId: string,
  offerIndex: number,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box.id === boxId);

    if (multiBox) {
      const updatedOffers = produce(multiBox.boxOffers, (draft) => {
        draft.splice(offerIndex, 1);
      });

      dispatch(
        updateBoxAttrAction(boxId, {
          boxOffers: updatedOffers,
        }),
      );
    }
  };
};

export const handleAddStockOfferAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    // Adicionar stock symbol às ofertas

    const multiBox = boxes.find((box) => box.id === id);

    if (multiBox && multiBox.boxOffers.length === 6) {
      alert("Número máximo de 6 ofertas atingido");
      return;
    }

    const data = await pesquisarAtivoMultilegAPI(symbol);

    if (data && multiBox) {
      const stockSymbol = data.ativoPrincipal;

      const offers = {
        model: "",
        offerType: "C",
        qtty: 1,
        selectedCode: stockSymbol,
        selectedExpiration: "2100-01-01",
        selectedStrike: -1,
        type: "",
        stockOptions: [],
        expirations: [],
        stockSymbol,
      } as any;

      dispatch(
        updateBoxAttrAction(id, { boxOffers: [...multiBox.boxOffers, offers] }),
      );
    }
  };
};

export const handleAddOptionOfferAction = (
  id: string,
  type: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box.id === id);

    if (multiBox) {
      if (multiBox.boxOffers.length === 6) {
        alert("Número máximo de 6 ofertas atingido");
        return;
      }

      const { selectedExpiration, selectedStrike, stockOptions } = multiBox;

      const option = stockOptions.find(
        (option) =>
          option.expiration === selectedExpiration &&
          option.strike === selectedStrike &&
          option.type === type,
      );

      if (option) {
        const offers = {
          offerType: "C",
          qtty: 1,
          selectedExpiration: selectedExpiration,
          selectedStrike: selectedStrike,
          type: option.type,
          model: option.model,
          selectedCode: option.symbol,
          stockOptions: multiBox.stockOptions,
          expirations: multiBox.expirations,
          stockSymbol: multiBox.stockSymbol,
        } as any;

        dispatch(
          updateBoxAttrAction(id, {
            boxOffers: [...multiBox.boxOffers, offers],
          }),
        );
      }
    }
  };
};

interface ChangeBoxOffer {
  boxId: string;
  offerIndex: number;
  attr: keyof BoxOffer;
  value: any;
}

export const handleChangeBoxOfferAction = ({
  boxId,
  offerIndex,
  attr,
  value,
}: ChangeBoxOffer): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const updatedBoxes = await produce(boxes, async (draft) => {
      const multiBox = draft.find((box) => box.id === boxId);

      if (multiBox) {
        const offer = multiBox.boxOffers[offerIndex];

        Object.assign(offer, { [attr]: value });

        // É preciso lidar com os casos em que um atributo provoca mudança no outro
        if (["type", "selectedStrike"].includes(attr)) {
          setOfferSymbolAndModel(offer);
        } //
        else if (attr === "selectedCode") {
          setOfferModelTypeStrikeAndSeries(offer);
        } //
        else if (attr === "selectedExpiration") {
          const options = await pesquisarStrikesMultilegAPI(
            offer.stockSymbol,
            value,
          );

          if (options.length) {
            offer.stockOptions = options;

            const foundOption = offer.stockOptions.find((option) => {
              return option.strike === offer.selectedStrike;
            });

            if (!foundOption) {
              offer.selectedStrike = findClosestStrike({
                options,
                symbolQuote: offer.selectedStrike,
              });

              setOfferSymbolAndModel(offer);
            }
          } //
          else {
            alert("Falha ao pesquisar opções");
          }
        }
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};

const setOfferSymbolAndModel = (boxOffer: BoxOffer) => {
  boxOffer.stockOptions.forEach((option) => {
    if (
      option.strike === boxOffer.selectedStrike &&
      option.type === boxOffer.type
    ) {
      boxOffer.selectedCode = option.symbol;
      boxOffer.model = option.model;
    }
  });
};

const setOfferModelTypeStrikeAndSeries = (boxOffer: BoxOffer) => {
  boxOffer.stockOptions.forEach((option) => {
    if (option.symbol === boxOffer.selectedCode) {
      boxOffer.model = option.model;
      boxOffer.type = option.type;
      boxOffer.selectedStrike = option.strike;
      boxOffer.selectedExpiration = option.expiration;
    }
  });
};

export const getUpdatedOptionsWhenExpirationChanges = async ({
  stockSymbol,
  selectedStrike,
  selectedExpiration,
}: Pick<
  MultiBoxData,
  "stockSymbol" | "selectedStrike" | "selectedExpiration"
>) => {
  const payload: Partial<MultiBoxData> = {};

  const options = await pesquisarStrikesMultilegAPI(
    stockSymbol,
    selectedExpiration,
  );

  if (options) {
    payload.stockOptions = options;

    payload.selectedStrike = findClosestStrike({
      options,
      symbolQuote: selectedStrike,
    });
  }

  return payload;
};

interface ExportToMultilegProps {
  boxId: string;
  globalProps: {
    zIndex: number;
    dispatchGlobal: any;
  };
}

export const handleExportBoxToMultilegAction = ({
  boxId,
  globalProps,
}: ExportToMultilegProps): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
      multilegReducer: { multileg, cotacoesMultileg },
      systemReducer: { isOpenMultileg },
    } = getState();

    dispatch(updateMultilegStateAction("loadingOffers", true));

    let { zIndex, dispatchGlobal } = globalProps;

    const box = boxes.find((box) => box.id === boxId);

    if (box) {
      const clonedMultilegTabs = cloneMultilegTabs(multileg);

      dispatchGlobal(atualizarDivKeyAction("multileg"));

      if (!isOpenMultileg) {
        clonedMultilegTabs.pop();
        dispatch(
          abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"),
        );
      } else {
        //Traz para primeiro plano se já estiver aberto
        const multilegPopup = document.getElementById("multileg");
        if (multilegPopup) {
          multilegPopup.style.zIndex = `${zIndex + 1}`;
          dispatchGlobal(aumentarZindexAction("multileg", zIndex, true));
        }
      }

      dispatch(
        updateManySystemState({
          multilegButtonsVisibility: true,
          createAlertButtonVisibility: false,
        }),
      );

      // Adicionar nova aba
      let result = addMultilegTab(clonedMultilegTabs);

      let updatedMultilegTabs = result.multilegTabs;
      let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
      const tabIndex = updatedMultilegTabs.length - 1;

      dispatch(
        updateManyMultilegState({
          multileg: result.multilegTabs,
          abaSelecionada: result.currentTab,
        }),
      );

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

      dispatch(
        updateManyMultilegState({
          multileg: result.multilegTabs,
          abaSelecionada: result.currentTab,
          cotacoesMultileg: updatedMultilegQuotes,
        }),
      );
    }

    dispatch(updateMultilegStateAction("loadingOffers", false));
  };
};

export const handleConcludeTab5Action = (
  boxId: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box.id === boxId);

    if (multiBox) {
      const topSymbols: TopSymbol[] = multiBox.boxOffers.map((offer) => {
        const [year, month, day] = offer.selectedExpiration
          .split("-")
          .map((value) => Number(value));

        const expirationDate = new Date(year, month - 1, day);

        const dateDiff = moment(expirationDate).diff(new Date(), "days") + "d";

        const topSymbol: TopSymbol = {
          qtty: offer.qtty,
          code: offer.selectedCode,
          model: offer.model,
          strike: offer.selectedStrike,
          offerType: offer.offerType,
          viewMode: multiBox.strikeViewMode,
          expiration: offer.model ? dateDiff : "",
          type: offer.type,
        };
        return topSymbol;
      });

      dispatch(
        updateBoxAttrAction(multiBox.id, { topSymbols, activeTab: "1" }),
      );
    }
  };
};

/*

   box.boxOffers.forEach((offer) => {
        let offerOptions: any[] = offer.stockOptions;

        const isStockSymbol = offer.selectedCode === offer.stockSymbol;

        if (isStockSymbol) {
          offerOptions = [{ symbol: offer.stockSymbol }];
        }

        multilegOffers.push({
          cv: offer.offerType === "C" ? "compra" : "venda",
          qtde: offer.qtty,
          ativoAtual: offer.stockSymbol,
          codigoSelecionado: offer.selectedCode,
          despernamento: 1000,
          modelo: offer.model,
          prioridade: 1,
          serieSelecionada: offer.selectedExpiration,
          strikeSelecionado: offer.selectedStrike,
          serie: offer.expirations,
          tipo: offer.type.toLocaleLowerCase() as any,
          opcoes: offerOptions,
        });
      });


*/
