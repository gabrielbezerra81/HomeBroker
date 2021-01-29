import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
} from "api/API";
import produce from "immer";
import {
  BoxOffer,
  BoxStockOption,
  MultiBoxData,
} from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";
import { findClosestStrike } from "../multileg/utils";
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

export const handleAddStockOfferAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    // Adicionar stock symbol às ofertas

    const data = await pesquisarAtivoMultilegAPI(symbol);

    if (data) {
      const stockSymbol = data.ativoPrincipal;

      const offers = [
        {
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
        },
      ] as any;

      dispatch(updateBoxAttrAction(id, { boxOffers: offers }));
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
      const { selectedExpiration, selectedStrike, stockOptions } = multiBox;

      const option = stockOptions.find(
        (option) =>
          option.expiration === selectedExpiration &&
          option.strike === selectedStrike &&
          option.type === type,
      );

      if (option) {
        const offers = [
          {
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
          },
        ] as any;

        dispatch(updateBoxAttrAction(id, { boxOffers: offers }));
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
