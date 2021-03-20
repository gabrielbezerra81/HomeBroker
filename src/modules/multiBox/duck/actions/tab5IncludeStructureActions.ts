import moment from "moment";

import {
  addBoxStructureAPI,
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import produce from "immer";

import {
  BoxOffer,
  BoxPosition,
  BoxStockOption,
  MultiBoxData,
  ParsedConfiguration,
  TopSymbol,
} from "modules/multiBox/types/MultiBoxState";

import { MainThunkAction } from "types/ThunkActions";

import { findClosestStrike } from "modules/multileg/duck/actions/utils";

import {
  updateStructuresAndLoadBoxesAction,
  updateBoxAttrAction,
  updateManyMultiBoxAction,
} from "./multiBoxActions";
import { mountOrderForOperations } from "./util";
import { getSymbolInfoAPI } from "api/symbolAPI";
import { success_add_box } from "constants/AlertaErros";
import { toast } from "react-toastify";

export interface SearchedBoxOptionsData {
  expirations: string[];
  searchedSymbol: string;
  stockSymbol: string;
  selectedExpiration: string;
  stockOptions: BoxStockOption[];
  selectedStrike: number;
}

export const searchBoxOptions = async (
  symbol: string,
): Promise<SearchedBoxOptionsData | null> => {
  const data = await pesquisarAtivoMultilegAPI(symbol);

  if (data) {
    const payload: SearchedBoxOptionsData = {
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

    return payload;
  }

  return null;
};

export const handleSearchBoxSymbolOptionsAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch) => {
    const payload: Partial<MultiBoxData> | null = await searchBoxOptions(
      symbol,
    );

    if (payload) {
      dispatch(updateBoxAttrAction(id, payload));
    } //
    else {
      // toast.error("Falha ao pesquisar código");
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

    const multiBox = boxes.find((box) => box?.id === boxId);

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

export const handleAddOfferDirectlyAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    try {
      const symbolInfo = await getSymbolInfoAPI(symbol);

      if (!symbolInfo) {
        toast.error("Falha ao adicionar código");
        return;
      } //
      if (symbolInfo.option && symbolInfo.type) {
        await dispatch(handleSearchBoxSymbolOptionsAction(id, symbol));
        await dispatch(handleAddOptionOfferAction(id, symbolInfo.type));
      } //
      else {
        await dispatch(handleAddStockOffer(id, symbol));
      }
    } catch (error) {}
  };
};

export const handleAddStockOffer = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    // Adicionar stock symbol às ofertas

    const multiBox = boxes.find((box) => box?.id === id);

    if (multiBox && multiBox.boxOffers.length === 6) {
      toast.info("Número máximo de 6 ofertas atingido");
      return;
    }

    const data = await pesquisarAtivoMultilegAPI(symbol);

    if (data && multiBox) {
      const stockSymbol = data.ativoPrincipal;

      const offer = {
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
        updateBoxAttrAction(id, {
          boxOffers: [...multiBox.boxOffers, offer],
          searchedSymbol: symbol,
          stockSymbol: symbol,
        }),
      );
    } //
    else {
      toast.error("Falha ao adicionar código");
    }
  };
};

export const handleAddOptionOfferAction = (
  id: string,
  type: "PUT" | "CALL",
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box?.id === id);

    if (multiBox) {
      if (multiBox.boxOffers.length === 6) {
        toast.info("Número máximo de 6 ofertas atingido");
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
      const multiBox = draft.find((box) => box?.id === boxId);

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
            toast.error("Falha ao pesquisar opções");
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

export const handleConcludeTab5Action = (boxId: string): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const multiBox = boxes.find((box) => box?.id === boxId);

    if (multiBox) {
      const topSymbols: TopSymbol[] = [];
      const boxPositions: BoxPosition[] = [];

      for await (const offer of multiBox.boxOffers) {
        const [year, month, day] = offer.selectedExpiration
          .split("-")
          .map((value) => Number(value));

        const expirationDate = new Date(year, month - 1, day);

        const dateDiff = moment(expirationDate).diff(new Date(), "days") + "d";

        const symbolData = await getSymbolInfoAPI(offer.selectedCode);

        const topSymbol: TopSymbol = {
          qtty: offer.offerType === "C" ? offer.qtty : -offer.qtty,
          code: offer.selectedCode,
          model: offer.model,
          strike: offer.selectedStrike,
          offerType: offer.offerType,
          viewMode: multiBox.strikeViewMode,
          expiration: offer.model ? dateDiff : "",
          type: offer.type,
        };

        topSymbols.push(topSymbol);

        if (symbolData) {
          boxPositions.push({
            account: null as any,
            groupPositions: null as any,
            id: null as any,
            structure: null as any,
            stock: symbolData,
            price: 0,
            qtty: 0,
            symbol: offer.selectedCode,
          });
        }
      }

      return dispatch(
        addNewMultiBoxStructureAction({ multiBox, topSymbols, boxPositions }),
      );
    }
  };
};

interface addNewBoxStructureAction {
  multiBox: MultiBoxData;
  topSymbols: TopSymbol[];
  boxPositions: BoxPosition[];
}

export const addNewMultiBoxStructureAction = ({
  multiBox,
  topSymbols,
  boxPositions,
}: addNewBoxStructureAction): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      systemReducer: { selectedTab },
    } = getState();

    const boxId = multiBox.id;

    const configData: ParsedConfiguration = {
      tabKey: selectedTab,
      boxId,
      position: {
        x: 0,
        y: 0,
      },
      title: multiBox.title,
    };

    const element = document.getElementById(multiBox.id);

    let isDuplicating = false;

    if (element) {
      const { x, y } = element.getBoundingClientRect();

      configData.position.x = x - 116;
      configData.position.y = y - 85;
    }

    const newBoxRequestData = await mountOrderForOperations({
      multiBox,
      dispatch,
      getState,
      commentConfig: JSON.stringify(configData),
    });

    if (newBoxRequestData) {
      const responseData = await addBoxStructureAPI({
        groupName: boxId,
        payload: newBoxRequestData,
        shouldAlertSuccess: isDuplicating ? false : true,
      });

      if (responseData) {
        toast.success(success_add_box);

        const boxStructure = responseData[0];

        dispatch(
          updateBoxAttrAction(boxId, {
            tab1Id: boxStructure.id,
            activeTab: "0",
            topSymbols,
            boxPositions,
          }),
        );

        dispatch(updateStructuresAndLoadBoxesAction(responseData, false));
      }
    } //
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
