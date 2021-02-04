import moment from "moment";

import { getProactiveBoxAPI } from "api/proactive/ProativosAPI";
import { updateBoxStructuresAPI } from "api/reactive/ReativosAPI";
import { getSymbolInfoAPI } from "api/symbolAPI";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, {
  MultiBoxData,
  Tab1Data,
  TopSymbol,
} from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";

import { v4 } from "uuid";
import { deleteQuoteBoxAPI } from "api/API";

export const addMultiBoxAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
    } = getState();

    const newMultiBox: MultiBoxData = {
      id: v4(),
      activeTab: "5",
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
      selectedValidity: "DAY",
      selectedDate: new Date(),
      price: 0,
      consideredPrice: "Bid",
      condition: "Less",
      observation: "",
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
          Object.assign(draft[index], newStructure);
        }
      });
    });

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
  return async (dispatch) => {
    const promises = tab1Data.map(async (data) => {
      const topSymbols: TopSymbol[] = [];

      for await (const code of data.codes) {
        const data = await getSymbolInfoAPI(code.symbol);

        if (data) {
          const [date] = data.endBusiness.split(" ");

          const [day, month, year] = date
            .split("/")
            .map((value) => Number(value));

          const expirationDate = new Date(year, month - 1, day);

          const dateDiff =
            moment(expirationDate).diff(new Date(), "days") + "d";

          const topSymbol: TopSymbol = {
            code: code.symbol,
            qtty: code.qtty,
            offerType: code.type === "buy" ? "C" : "V",
            expiration: data.model ? dateDiff : "",
            model: data.model || ("" as any),
            strike: data.strike,
            type: data.type || ("" as any),
            viewMode: "strike",
          };

          topSymbols.push(topSymbol);
        }
      }

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
        topSymbols,
        tab1Id: data.id,
        selectedValidity: "DAY",
        selectedDate: new Date(),
        price: 0,
        consideredPrice: "Bid",
        condition: "Less",
        observation: "",
      };

      return newMultiBox;
    });

    const multiBoxes: MultiBoxData[] = [];

    for await (const boxes of promises) {
      multiBoxes.push(boxes);
    }

    dispatch(
      updateManyMultiBoxAction({
        boxes: multiBoxes,
      }),
    );
  };
};

export const startReactiveMultiBoxUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token },
      multiBoxReducer: { esource_multiBox, interval_multiBox, boxesTab1Data },
    } = getState();

    if (esource_multiBox && esource_multiBox.close) {
      esource_multiBox.close();
    }

    if (interval_multiBox !== null) {
      clearInterval(interval_multiBox);
    }

    const idArray: string[] = [];

    boxesTab1Data.forEach((structure) => {
      if (!idArray.includes(structure.structureID.toString())) {
        idArray.push(structure.structureID.toString());
      }
    });

    const ids = idArray.join(",");

    if (ids) {
      const boxSource = updateBoxStructuresAPI({
        ids,
        token,
        dispatch,
        boxesTab1Data,
      });

      dispatch(
        updateManyMultiBoxAction({
          esource_multiBox: boxSource,
        }),
      );
    }
  };
};

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

export const handleDeleteBoxAction = (boxId: string): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxesTab1Data, boxes },
    } = getState();

    const structureData = boxesTab1Data.find((data) => data.boxId === boxId);

    if (!structureData) {
      return;
    }

    try {
      const shouldDelete = await deleteQuoteBoxAPI(structureData.id);

      if (shouldDelete) {
        const updatedMultiBoxes = produce(boxes, (draft) => {
          const index = draft.findIndex(
            (box) => box.tab1Id === structureData.id,
          );

          if (index >= 0) draft.splice(index, 1);
        });

        const updatedBoxesTab1Data = produce(boxesTab1Data, (draft) => {
          const index = draft.findIndex(
            (tab1Data) => tab1Data.id === structureData.id,
          );

          if (index >= 0) draft.splice(index, 1);
        });

        dispatch(
          updateManyMultiBoxAction({
            boxesTab1Data: updatedBoxesTab1Data,
            boxes: updatedMultiBoxes,
          }),
        );
      }
    } catch (error) {}
  };
};
