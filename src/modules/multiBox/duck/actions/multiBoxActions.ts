import moment from "moment";

import { getProactiveBoxAPI } from "api/proactive/ProativosAPI";
import { updateBoxStructuresAPI } from "api/reactive/ReativosAPI";
import {
  getOneSymbolDataAPI,
  getStockInfoAPI,
  getSymbolInfoAPI,
} from "api/symbolAPI";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, {
  BoxPosition,
  MultiBoxData,
  StockSymbolData,
  Tab1Data,
  TopSymbol,
} from "modules/multiBox/types/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";
import { updateMultilegStateAction } from "modules/multileg/duck/actions/MultilegActions";

import { v4 } from "uuid";
import { deleteQuoteBoxAPI, listBoxPositionAPI } from "api/API";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import { updateManyMultilegState } from "modules/multileg/duck/actions/utils";
import { exportBoxToMultileg } from "./util";
import getSymbolExpirationInDays from "shared/utils/getSymbolExpirationInDays";

interface OpenedBoxes {
  menuKey: string;
  tabKey: string;
}

const initialTab = "2";

export const addMultiBoxAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
      systemReducer: { openedMenus, selectedTab },
    } = getState();

    const newMultiBox: MultiBoxData = {
      id: v4(),
      activeTab: initialTab,
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
      alertPrice: 0,
      consideredPrice: "Bid",
      condition: "Less",
      observation: "",
      stockSymbolData: null,
      boxPositions: [], // TODO: carregar posições?
    };

    const updatedOpenedMenus = produce(openedMenus, (draft) => {
      draft.push({ menuKey: `multiBox${newMultiBox.id}`, tabKey: selectedTab });
    });

    const updatedBoxes = produce(boxes, (draft) => {
      draft.push(newMultiBox);
    });

    dispatch(
      updateManyMultiBoxAction({
        boxes: updatedBoxes,
      }),
    );
    dispatch(
      updateManySystemState({
        openedMenus: updatedOpenedMenus,
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

    const openedBoxes: OpenedBoxes[] = [];

    const newData: Tab1Data[] = data.map((boxItem: any) => {
      const { structure } = boxItem;

      const configuration = JSON.parse(boxItem.configuration);

      openedBoxes.push({
        menuKey: `multiBox${configuration.boxId}`,
        tabKey: configuration.tabKey,
      });

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
      dispatch(
        addMultiBoxesFromStructureDataAction(updatedTab1Data, openedBoxes),
      );
    }
  };
};

export const addMultiBoxesFromStructureDataAction = (
  tab1Data: Tab1Data[],
  openedBoxes: OpenedBoxes[],
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      systemReducer: { openedMenus },
    } = getState();

    // Posições de todos os boxes
    const allPositions = (await listBoxPositionAPI()) as BoxPosition[];

    // Monta a lista de boxes a partir das estruturas incluídas
    const promises = tab1Data.map(async (data) => {
      const topSymbols: TopSymbol[] = [];

      let boxPositions = allPositions.filter(
        (position) => position.groupPositions === data.id,
      );

      let hasPositionsAdded = true;

      if (boxPositions.length === 0) {
        hasPositionsAdded = false;
      }

      // Para montar os atributos "topSymbols" e as posições do box é necessário pesquisar as informações dos ativos
      for await (const code of data.codes) {
        const data = await getSymbolInfoAPI(code.symbol);

        if (data) {
          const dateDiff = getSymbolExpirationInDays(data.endBusiness);

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

          if (!hasPositionsAdded) {
            boxPositions.push({
              account: null as any,
              groupPositions: null as any,
              id: null as any,
              structure: null as any,
              stock: data,
              price: 0,
              qtty: 0,
              symbol: data.symbol,
            });
          }
        }
      }

      const stockSymbolData = await getStockSymbolData(topSymbols);

      const newMultiBox: MultiBoxData = {
        id: data.boxId,
        activeTab: initialTab,
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
        alertPrice: 0,
        consideredPrice: "Bid",
        condition: "Less",
        observation: "",
        stockSymbolData,
        boxPositions,
      };

      return newMultiBox;
    });

    const multiBoxes: MultiBoxData[] = [];

    for await (const boxes of promises) {
      multiBoxes.push(boxes);
    }

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

    dispatch(
      updateManyMultiBoxAction({
        boxes: multiBoxes,
      }),
    );

    dispatch(
      updateManySystemState({
        openedMenus: updatedOpenedMenus,
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
      systemReducer: { openedMenus },
    } = getState();

    const structureData = boxesTab1Data.find((data) => data.boxId === boxId);

    const updatedMultiBoxes = produce(boxes, (draft) => {
      const index = draft.findIndex((box) => box.id === boxId);

      if (index >= 0) draft.splice(index, 1);
    });

    const updatedOpenedMenus = produce(openedMenus, (draft) => {
      const index = draft.findIndex(
        (item) => item.menuKey === `multiBox${boxId}`,
      );

      if (index >= 0) {
        draft.splice(index, 1);
      }
    });

    if (structureData) {
      // Remover box e estrutura adicionada
      const shouldDelete = await deleteQuoteBoxAPI(structureData.id);

      if (shouldDelete) {
        const updatedBoxesTab1Data = produce(boxesTab1Data, (draft) => {
          const index = draft.findIndex(
            (tab1Data) => tab1Data.id === structureData.id,
          );

          if (index >= 0) draft.splice(index, 1);
        });

        dispatch(
          updateManyMultiBoxAction({
            boxesTab1Data: updatedBoxesTab1Data,
          }),
        );
      }
    }

    dispatch(
      updateManyMultiBoxAction({
        boxes: updatedMultiBoxes,
      }),
    );

    dispatch(
      updateManySystemState({
        openedMenus: updatedOpenedMenus,
      }),
    );
  };
};

interface ExportToMultilegProps {
  boxId: string;
}

export const handleExportBoxToMultilegAction = ({
  boxId,
}: ExportToMultilegProps): MainThunkAction => {
  return async (dispatch, getState) => {
    dispatch(updateMultilegStateAction("loadingOffers", true));

    const data = await exportBoxToMultileg({
      boxId,
      dispatch,
      getState,
    });

    dispatch(updateManyMultilegState(data));

    dispatch(updateMultilegStateAction("loadingOffers", false));
  };
};

export const getStockSymbolData = async (topSymbols: TopSymbol[]) => {
  const symbol = topSymbols.length ? topSymbols[0].code : "";

  if (!symbol) {
    return null;
  }

  const data = await getSymbolInfoAPI(symbol);

  if (data) {
    const { option } = data;

    let stockSymbol = "";

    if (option && data.referenceStock) {
      const { symbol: searchSymbol } =
        (await getStockInfoAPI(data.referenceStock)) || {};

      stockSymbol = searchSymbol || "";
    } //
    else {
      stockSymbol = symbol;
    }

    if (stockSymbol) {
      const data = await getOneSymbolDataAPI(stockSymbol);

      if (data) {
        const stockData: StockSymbolData = {
          symbol: stockSymbol,
          last: data.ultimo,
          min: data.minimo,
          max: data.maximo,
          oscilation: data.oscilacao,
        };

        return stockData;
      }
    }
  }

  return null;
};
