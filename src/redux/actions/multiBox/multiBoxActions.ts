import { getProactiveBoxAPI } from "api/proactive/ProativosAPI";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, {
  MultiBoxData,
  Tab1Data,
} from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";

import { v4 } from "uuid";

export const addMultiBoxAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const newMultiBox: MultiBoxData = {
      id: v4(),
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

export const updateStructuresAndLoadBoxesAction = (
  data: any[],
  createBoxes = true,
): MainThunkAction => {
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
      newData.forEach((newStructure) => {
        const index = draft.findIndex(
          (structure) =>
            structure.id === newStructure.id ||
            structure.boxId === newStructure.boxId,
        );

        if (index === -1) {
          draft.push(newStructure);
        } else {
          console.log(newStructure);
          Object.assign(draft[index], newStructure);
        }
      });
    });

    console.log(updatedTab1Data);

    // dispatch(handleAddBoxesToTabsAction(openedBoxes));
    dispatch(
      updateManyMultiBoxAction({
        boxesTab1Data: updatedTab1Data,
      }),
    );

    if (createBoxes) {
      dispatch(addMultiBoxesFromStructureDataAction(updatedTab1Data));
    }
  };
};

export const addMultiBoxesFromStructureDataAction = (
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

// export const startReactiveMultiBoxUpdateAction = (): MainThunkAction => {
//   return (dispatch, getState) => {
//     const {
//       systemReducer: { token, esource_box, interval_box, quoteBoxes },
//     } = getState();

//     if (esource_box && esource_box.close) {
//       esource_box.close();
//     }

//     if (interval_box !== null) {
//       clearInterval(interval_box);
//     }

//     const idArray: string[] = [];

//     quoteBoxes.forEach((boxItem) => {
//       if (!idArray.includes(boxItem.structureID.toString())) {
//         idArray.push(boxItem.structureID.toString());
//       }
//     });

//     const ids = idArray.join(",");

//     if (ids) {
//       const boxSource = updateBoxDataAPI({ ids, token, dispatch, quoteBoxes });

//       dispatch(updateOneSystemStateAction("esource_box", boxSource));
//     }
//   };
// };

export const startProactiveMultiBoxUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { updateInterval },
      multiBoxReducer: { boxesTab1Data, esource_multiBox, interval_multiBox },
    } = getState();

    if (esource_multiBox && esource_multiBox.close) {
      esource_multiBox.close();
    }

    if (interval_multiBox !== null) {
      clearInterval(interval_multiBox);
    }

    const idArray: string[] = [];

    boxesTab1Data.forEach((boxItem) => {
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

        const updatedBoxesTab1Data = boxesTab1Data.map((boxItem) => {
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

        dispatch(
          updateStructuresAndLoadBoxesAction(updatedBoxesTab1Data, false),
        );
      }, updateInterval);

      dispatch(
        updateManyMultiBoxAction({
          interval_multiBox: interval,
        }),
      );
    }
  };
};
