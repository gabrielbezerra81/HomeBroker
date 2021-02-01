import moment from "moment";

import {
  addBoxStructureAPI,
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
  setPointerWhileAwaiting,
} from "api/API";
import produce from "immer";

import {
  BoxOffer,
  BoxStockOption,
  MultiBoxData,
  TopSymbol,
} from "types/multiBox/MultiBoxState";

import { MainThunkAction } from "types/ThunkActions";

import { updateMultilegStateAction } from "../multileg/MultilegActions";

import {
  findClosestStrike,
  mountMultilegOrder,
  updateManyMultilegState,
  validateMultilegOrder,
} from "../multileg/utils";

import {
  updateStructuresAndLoadBoxesAction,
  updateBoxAttrAction,
  updateManyMultiBoxAction,
} from "./multiBoxActions";
import { exportBoxToMultileg } from "./util";

export const handleSearchBoxSymbolOptionsAction = (
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
    } //
    else {
      // alert("Falha ao pesquisar código");
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
        selectedExpiration: "",
        selectedStrike: 0,
        type: "",
        stockOptions: [],
        expirations: [],
        stockSymbol,
      } as any;

      dispatch(
        updateBoxAttrAction(id, { boxOffers: [...multiBox.boxOffers, offers] }),
      );
    } //
    else {
      // alert("Falha ao pesquisar código");
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
    dispatch(updateMultilegStateAction("loadingOffers", true));

    const data = await exportBoxToMultileg({
      boxId,
      dispatch,
      getState,
      ...globalProps,
    });

    dispatch(updateManyMultilegState(data));

    dispatch(updateMultilegStateAction("loadingOffers", false));
  };
};

interface ConcludeTab5 {
  dispatchGlobal: any;
  zIndex: number;
  boxId: string;
}

export const handleConcludeTab5Action = (
  data: ConcludeTab5,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box.id === data.boxId);

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
      dispatch(addNewMultiBoxStructureAction({ ...data, multiBox }));
    }
  };
};

interface addNewBoxStructureAction {
  dispatchGlobal: any;
  zIndex: number;
  multiBox: MultiBoxData;
}

export const addNewMultiBoxStructureAction = ({
  dispatchGlobal,
  zIndex,
  multiBox,
}: addNewBoxStructureAction): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      systemReducer: { selectedAccount, selectedTab },
    } = getState();

    const boxId = multiBox.id;

    // Obtem os dados no formato do multileg, porém não dispara a abertura da multileg
    const data = await exportBoxToMultileg({
      boxId,
      dispatch,
      getState,
      zIndex,
      dispatchGlobal,
      shouldOpenMultileg: false,
    });

    if (data) {
      const configData = { tabKey: selectedTab, boxId };

      const tabIndex = data.multileg.length - 1;

      data.multileg[tabIndex].editingOrderId =
        multiBox.tab1Id !== -1 ? multiBox.tab1Id : null;

      const mountOrderProps = {
        multilegTabs: data.multileg,
        selectedAccount: selectedAccount,
        tabIndex,
        comment: JSON.stringify(configData),
      };

      const newBoxRequestData = mountMultilegOrder(mountOrderProps);

      setPointerWhileAwaiting({ lockMode: "travar", id: "boxId" });

      if (validateMultilegOrder(mountOrderProps)) {
        const responseData = await addBoxStructureAPI(boxId, newBoxRequestData);

        if (responseData) {
          const boxStructure = responseData[0];

          dispatch(updateBoxAttrAction(boxId, { tab1Id: boxStructure.id }));

          dispatch(updateStructuresAndLoadBoxesAction(responseData, false));
        }
      }
    }

    setPointerWhileAwaiting({ lockMode: "destravar", id: "boxId" });
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
