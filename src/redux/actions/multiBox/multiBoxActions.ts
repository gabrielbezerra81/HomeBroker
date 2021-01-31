import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, {
  MultiBoxData,
  Tab1Data,
} from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";

import { uuid } from "uuidv4";

export const addMultiBoxAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const newMultiBox: MultiBoxData = {
      id: uuid(),
      activeTab: "1",
      minimized: false,
      //tab5
      symbolInput: "",
      searchedSymbol: "",
      stockSymbol: "",
      stockOptions: [],
      expirations: [],
      selectedStrike: 0,
      selectedExpiration: "",
      boxOffers: [],
      //tab5
      strikeViewMode: "strike",
      topSymbols: [],
      tab1Id: -1,
    };

    const updatedBoxes = produce(boxes, (draft) => {
      draft.push(newMultiBox);
    });

    dispatch(
      updateManyMultiBoxAction({
        boxes: updatedBoxes,
      }),
    );
  };
};

export const updateManyMultiBoxAction = (
  payload: Partial<MultiBoxState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MANY_MULTIBOX,
      payload,
    });
  };
};

export const updateBoxAttrAction = (
  id: string,
  payload: Partial<MultiBoxData>,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const updatedBoxes = produce(boxes, (draft) => {
      const index = draft.findIndex((box) => box.id === id);

      if (index !== -1) {
        Object.assign(draft[index], payload);
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};

export const loadMultiBoxFromAPIAction = (data: any[]): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxesTab1Data },
    } = getState();

    // const openedBoxes: OpenedBoxes[] = [];

    const newData: Tab1Data[] = data.map((boxItem: any) => {
      const { structure } = boxItem;

      const configuration = JSON.parse(boxItem.configuration);

      // openedBoxes.push({
      //   menuKey: `box${boxItem.id}`,
      //   tabKey: configuration.tabKey,
      // });

      const codes = structure.components.map((component: any) => {
        return {
          qtty: component.qtty,
          symbol: component.stock.symbol,
          type: component.qtty >= 0 ? "buy" : "sell",
        };
      });

      const box: Tab1Data = {
        id: boxItem.id,
        structureID: structure.id,
        max: 0,
        min: 0,
        quote: structure.last,
        codes,
        dayOscilation: structure.change || 0,
        buy: structure.max,
        sell: structure.min,
        book: {
          buy: structure.bookBuy || [],
          sell: structure.bookSell || [],
        },
        configuration: boxItem.configuration,
        structure,
        boxId: configuration.boxId,
      };

      return box;
    });

    const updatedTab1Data = produce(boxesTab1Data, (draft) => {
      newData.forEach((newBoxItem) => {
        const boxIndex = draft.findIndex(
          (boxItem) => boxItem.id === newBoxItem.id,
        );

        if (boxIndex === -1) {
          draft.push(newBoxItem);
        } else {
          draft[boxIndex] = newBoxItem;
        }
      });
    });

    // dispatch(handleAddBoxesToTabsAction(openedBoxes));
    dispatch(
      updateManyMultiBoxAction({
        boxesTab1Data: updatedTab1Data,
      }),
    );
    dispatch(addMultiBoxesFromTab1DataAction(updatedTab1Data));
  };
};

export const addMultiBoxesFromTab1DataAction = (
  tab1Data: Tab1Data[],
): MainThunkAction => {
  return (dispatch) => {
    const multiBoxes = tab1Data.map((data) => {
      const newMultiBox: MultiBoxData = {
        id: data.boxId,
        activeTab: "1",
        minimized: false,
        //tab5
        symbolInput: "",
        searchedSymbol: "",
        stockSymbol: "",
        stockOptions: [],
        expirations: [],
        selectedStrike: 0,
        selectedExpiration: "",
        boxOffers: [],
        //tab5

        strikeViewMode: "strike",
        topSymbols: [],
        tab1Id: data.id,
      };

      return newMultiBox;
    });

    dispatch(
      updateManyMultiBoxAction({
        boxes: multiBoxes,
      }),
    );
  };
};
