import produce from "immer";
import { MainThunkAction } from "types/ThunkActions";
import { BoxVisibility } from "types/system/system";
import {
  updateManySystemState,
  updateOneSystemStateAction,
} from "./SystemActions";
import { BoxProps } from "screens/home/QuoteBox/types";

interface OpenedBoxes {
  menuKey: string;
  tabKey: string;
}

export const addBoxFromAPIAction = (data: any[]): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { quoteBoxes },
    } = getState();

    const boxesVisibility: BoxVisibility[] = [];
    const openedBoxes: OpenedBoxes[] = [];

    const boxes: BoxProps[] = data.map((boxItem: any) => {
      const { structure } = boxItem;

      const configuration = JSON.parse(boxItem.configuration);

      openedBoxes.push({
        menuKey: `box${boxItem.id}`,
        tabKey: configuration.tabKey,
      });

      boxesVisibility.push({ boxKey: `box${boxItem.id}`, visibility: true });

      const codes = structure.components.map((component: any) => {
        return {
          qtty: component.qtty,
          symbol: component.stock.symbol,
          type: component.qtty >= 0 ? "buy" : "sell",
        };
      });

      const box: BoxProps = {
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
      };

      return box;
    });

    const updatedQuoteBoxes = produce(quoteBoxes, (draft) => {
      boxes.forEach((newBoxItem) => {
        const alreadyAdded = quoteBoxes.some(
          (boxItem) => boxItem.id === newBoxItem.id,
        );

        if (!alreadyAdded) {
          draft.push(newBoxItem);
        }
      });
    });

    dispatch(handleAddBoxesToTabsAction(openedBoxes));
    dispatch(updateOneSystemStateAction("quoteBoxes", updatedQuoteBoxes));
  };
};

export const handleAddBoxesToTabsAction = (
  openedBoxes: OpenedBoxes[],
): MainThunkAction => {
  return (dispatch, getState) => {
    const { openedMenus, boxesVisibility } = getState().systemReducer;

    const updatedOpenedMenus = produce(openedMenus, (draft) => {
      openedBoxes.forEach((boxItem) => {
        const alreadyAdded = openedMenus.some(
          (menuItem) => menuItem.menuKey === boxItem.menuKey,
        );

        if (!alreadyAdded) {
          draft.push(boxItem);
        }
      });
    });

    const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
      openedBoxes.forEach((boxItem) => {
        const alreadyAdded = boxesVisibility.some(
          (visibility) => boxItem.menuKey === visibility.boxKey,
        );

        if (!alreadyAdded) {
          draft.push({ boxKey: boxItem.menuKey, visibility: true });
        }
      });
    });

    dispatch(
      updateManySystemState({
        openedMenus: updatedOpenedMenus,
        boxesVisibility: updatedBoxesVisibility,
      }),
    );
  };
};