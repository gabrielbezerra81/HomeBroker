import produce from "immer";
import { MainThunkAction } from "types/ThunkActions";
import {
  updateManySystemState,
  updateOneSystemStateAction,
} from "./SystemActions";
import { BoxProps } from "screens/popups/quoteBox/types";
import { updateBoxDataAPI } from "api/reactive/ReativosAPI";
import { getProactiveBoxAPI } from "api/proactive/ProativosAPI";

interface OpenedBoxes {
  menuKey: string;
  tabKey: string;
}

export const addBoxFromAPIAction = (data: any[]): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { quoteBoxes },
    } = getState();

    // const boxesVisibility: BoxVisibility[] = [];
    const openedBoxes: OpenedBoxes[] = [];

    const boxes: BoxProps[] = data.map((boxItem: any) => {
      const { structure } = boxItem;

      const configuration = JSON.parse(boxItem.configuration);

      openedBoxes.push({
        menuKey: `box${boxItem.id}`,
        tabKey: configuration.tabKey,
      });

      // boxesVisibility.push({ boxKey: `box${boxItem.id}`, visibility: true });

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
        configuration: boxItem.configuration,
        structure,
      };

      return box;
    });

    const updatedQuoteBoxes = produce(quoteBoxes, (draft) => {
      boxes.forEach((newBoxItem) => {
        const boxIndex = quoteBoxes.findIndex(
          (boxItem) => boxItem.id === newBoxItem.id,
        );

        if (boxIndex === -1) {
          draft.push(newBoxItem);
        } else {
          draft[boxIndex] = newBoxItem;
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

export const startReactiveBoxUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token, esource_box, interval_box, quoteBoxes },
    } = getState();

    if (esource_box && esource_box.close) {
      esource_box.close();
    }

    if (interval_box !== null) {
      clearInterval(interval_box);
    }

    const idArray: string[] = [];

    quoteBoxes.forEach((boxItem) => {
      if (!idArray.includes(boxItem.structureID.toString())) {
        idArray.push(boxItem.structureID.toString());
      }
    });

    const ids = idArray.join(",");

    if (ids) {
      const boxSource = updateBoxDataAPI({ ids, token, dispatch, quoteBoxes });

      dispatch(updateOneSystemStateAction("esource_box", boxSource));
    }
  };
};

export const startProactiveBoxUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { esource_box, interval_box, quoteBoxes, updateInterval },
    } = getState();

    if (esource_box && esource_box.close) {
      esource_box.close();
    }

    if (interval_box !== null) {
      clearInterval(interval_box);
    }

    const idArray: string[] = [];

    quoteBoxes.forEach((boxItem) => {
      if (!idArray.includes(boxItem.structureID.toString())) {
        idArray.push(boxItem.structureID.toString());
      }
    });

    const ids = idArray.join(",");

    if (ids) {
      const interval = setInterval(async () => {
        const structures = await getProactiveBoxAPI(ids);

        if (!structures.length) {
          return;
        }

        const updatedBoxData = quoteBoxes.map((boxItem) => {
          const boxFromAPI: any = {
            id: boxItem.id,
            configuration: boxItem.configuration,
          };

          const updatedStructure = structures.find(
            (structureItem: any) => structureItem.id === boxItem.structureID,
          );

          if (updatedStructure) {
            boxFromAPI.structure = updatedStructure;
          } else {
            boxFromAPI.structure = boxItem.structure;
          }

          return boxFromAPI;
        });

        dispatch(addBoxFromAPIAction(updatedBoxData));
      }, updateInterval);

      dispatch(updateOneSystemStateAction("interval_box", interval));
    }
  };
};
