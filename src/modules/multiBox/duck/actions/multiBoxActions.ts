import {
  getProactiveBoxBooksAPI,
  getProactiveBoxStructQuotesAPI,
} from "api/proactive/ProativosAPI";
import { updateBoxStructuresAPI } from "api/reactive/ReativosAPI";
import {
  getStockInfoAPI,
  getSymbolInfoAPI,
  SymbolInfoAPI,
} from "api/symbolAPI";
import { UPDATE_MANY_MULTIBOX } from "constants/MenuActionTypes";
import produce from "immer";
import MultiBoxState, {
  BoxOffer,
  BoxPosition,
  MultiBoxData,
  StockSymbolData,
  StructureBook,
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
import {
  handleConcludeTab5Action,
  searchBoxOptions,
  SearchedBoxOptionsData,
} from "./tab5IncludeStructureActions";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { success_add_box } from "constants/AlertaErros";

interface OpenedBoxes {
  menuKey: string;
  tabKey: string;
}

const initialOnLoad = "0";
const initialEmpty = "5";

export const addMultiBoxAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
      systemReducer: { openedMenus, selectedTab },
    } = getState();

    const newMultiBox: MultiBoxData = {
      id: v4(),
      activeTab: initialEmpty,
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
      boxPositions: [],
      isLoadingBox: false,
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
      const index = draft.findIndex((box) => box?.id === id);

      if (index !== -1) {
        Object.assign(draft[index], payload);
      }
    });

    dispatch(updateManyMultiBoxAction({ boxes: updatedBoxes }));
  };
};

export const updateStructuresAndLoadBoxesAction = (
  data: any[],
  createBoxes: boolean,
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
        max: structure.max,
        min: structure.min,
        quote: structure.last,
        codes,
        dayOscilation: structure.oscilation || 0,
        buy: structure.max,
        sell: structure.min,
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
      updateManySystemState({
        openedMenus: updatedOpenedMenus,
      }),
    );

    const nullBoxes = tab1Data.map((data) => null);

    dispatch(
      updateManyMultiBoxAction({
        boxes: nullBoxes,
      }),
    );

    // Posições de todos os boxes
    const allPositions = (await listBoxPositionAPI()) as BoxPosition[];

    // Monta a lista de boxes a partir das estruturas incluídas
    const boxPromises = tab1Data.map(async (structureData) => {
      const symbolsData: Array<SymbolInfoAPI & { offerType: "C" | "V" }> = [];

      // Para montar os atributos "topSymbols", "boxPositions" e "boxOffers" é necessário pesquisar as informações dos ativos
      for await (const code of structureData.codes) {
        const symbolInfo = await getSymbolInfoAPI(code.symbol);
        if (symbolInfo) {
          symbolsData.push({
            ...symbolInfo,
            offerType: code.type === "buy" ? "C" : "V",
          });
        }
      }

      const topSymbols: TopSymbol[] = loadInitialTopSymbols({
        structureData,
        symbolsData,
      });

      const stockSymbol = await findStockSymbol(topSymbols);

      const boxOptionsData = await searchBoxOptions(stockSymbol || "");

      const boxPositions: BoxPosition[] = loadInitialBoxPositions({
        allPositions,
        symbolsData,
        structureData,
      });

      const boxOffers: BoxOffer[] = await loadInitialBoxOffers({
        symbolsData,
        boxOptionsData,
        structureData,
      });

      const newMultiBox: MultiBoxData = {
        id: structureData.boxId,
        activeTab: initialOnLoad,
        minimized: false,
        //tab5
        symbolInput: stockSymbol || "",
        searchedSymbol: "",
        stockSymbol: "",
        stockOptions: [],
        expirations: [],
        selectedStrike: 0,
        selectedExpiration: "",
        boxOffers,
        //tab5

        strikeViewMode: "strike",
        topSymbols,
        tab1Id: structureData.id,
        selectedValidity: "DAY",
        selectedDate: new Date(),
        alertPrice: 0,
        consideredPrice: "Bid",
        condition: "Less",
        observation: "",
        boxPositions,
        isLoadingBox: false,
      };

      if (boxOptionsData) {
        Object.assign(newMultiBox, boxOptionsData);
      }

      return newMultiBox;
    });

    const multiBoxes: MultiBoxData[] = [];

    for await (const boxes of boxPromises) {
      multiBoxes.push(boxes);
    }

    dispatch(
      updateManyMultiBoxAction({
        boxes: multiBoxes,
      }),
    );
  };
};

interface LoadTopSymbols {
  symbolsData: Array<SymbolInfoAPI & { offerType: "C" | "V" }>;
  structureData: Tab1Data;
}

const loadInitialTopSymbols = ({
  symbolsData,
  structureData,
}: LoadTopSymbols) => {
  const topSymbols: TopSymbol[] = symbolsData.map((symbolInfo) => {
    const dateDiff = getSymbolExpirationInDays(symbolInfo.endBusiness);

    const code = structureData.codes.find(
      (item) => item.symbol === symbolInfo.symbol,
    );

    const topSymbol: TopSymbol = {
      code: symbolInfo.symbol,
      qtty: code?.qtty || 1,
      offerType: symbolInfo.offerType,
      expiration: symbolInfo.model ? dateDiff : "",
      model: symbolInfo.model || ("" as any),
      strike: symbolInfo.strike,
      type: symbolInfo.type || ("" as any),
      viewMode: "strike",
    };

    return topSymbol;
  });

  return topSymbols;
};

interface LoadPositions {
  allPositions: BoxPosition[];
  structureData: Tab1Data;
  symbolsData: SymbolInfoAPI[];
}

const loadInitialBoxPositions = ({
  allPositions,
  structureData,
  symbolsData,
}: LoadPositions) => {
  const boxPositions = allPositions.filter(
    (position) => position.groupPositions === structureData.id,
  );

  let hasPositionsAdded = true;

  if (boxPositions.length === 0) {
    hasPositionsAdded = false;
  }

  symbolsData.forEach((data) => {
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
  });

  return boxPositions;
};

interface LoadBoxOffers {
  symbolsData: Array<SymbolInfoAPI & { offerType: "C" | "V" }>;
  boxOptionsData: SearchedBoxOptionsData | null;
  structureData: Tab1Data;
}

const loadInitialBoxOffers = async ({
  symbolsData,
  boxOptionsData,
  structureData,
}: LoadBoxOffers) => {
  const boxOffers: BoxOffer[] = [];

  for await (const data of symbolsData) {
    const [day, month, year] = data.endBusiness.split(" ")[0].split("/");

    const offerExpiration = `${year}-${month}-${day}`;

    const sameSymbolInStructure = structureData.codes.find(
      (item) => item.symbol === data.symbol,
    );

    const offer: BoxOffer = {
      qtty: Math.abs(sameSymbolInStructure?.qtty || 1),
      model: data.model || ("" as any),
      type: data.type || ("" as any),
      selectedCode: data.symbol,
      offerType: data.offerType,
      selectedStrike: data.strike,
      selectedExpiration: offerExpiration,
      expirations: data.option ? [] : [],
      stockOptions: data.option ? [] : [],
      stockSymbol: data.option ? "" : data.symbol,
    };

    if (data.referenceStock) {
      const stockInfo = await getStockInfoAPI(data.referenceStock);

      const isSameStockSymbol =
        stockInfo?.symbol === boxOptionsData?.stockSymbol;

      if (boxOptionsData && isSameStockSymbol) {
        offer.expirations = boxOptionsData.expirations;
        offer.stockOptions = boxOptionsData.stockOptions;
        offer.stockSymbol = boxOptionsData.stockSymbol;
      } //
      else if (stockInfo) {
        const optionsData = await searchBoxOptions(stockInfo.symbol);

        if (optionsData) {
          offer.expirations = optionsData?.expirations;
          offer.stockOptions = optionsData?.stockOptions;
          offer.stockSymbol = optionsData?.stockSymbol;
        }
      }
    }

    boxOffers.push(offer);
  }

  return boxOffers;
};

export const startReactiveMultiBoxUpdateAction = (
  ids: string,
): MainThunkAction => {
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

interface ProactiveBox {
  searchedSymbolsIds: Array<{
    id: string;
    symbol: string;
  }>;
  idsTab0: string;
}

// atualiza cotações da estrutura e dos códigos pesquisados
export const startProactiveMultiBoxUpdateAction = ({
  idsTab0,
  searchedSymbolsIds,
}: ProactiveBox): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { updateInterval },
      multiBoxReducer: { esource_multiBox, interval_multiBox, boxes },
    } = getState();

    const searchedSymbols: string[] = [];

    boxes.forEach((box) => {
      if (box && !searchedSymbols.includes(box.searchedSymbol)) {
        searchedSymbols.push(box.searchedSymbol);
      }
    });

    if (esource_multiBox && esource_multiBox.close) {
      esource_multiBox.close();
    }

    if (interval_multiBox !== null) {
      clearInterval(interval_multiBox);
    }

    const idsArray = idsTab0 ? idsTab0.split(",") : [];

    searchedSymbolsIds.forEach((item) => {
      if (!idsArray.includes(item.id)) {
        idsArray.push(item.id);
      }
    });

    const ids = idsArray.join(",");

    if (ids) {
      const interval = setInterval(async () => {
        const structuresQuotes = await getProactiveBoxStructQuotesAPI(ids);

        if (!structuresQuotes.length) {
          return;
        }

        const {
          multiBoxReducer: { stockSymbolsData, boxesTab1Data },
        } = getState();

        let updatedStockSymbolsData: StockSymbolData[] = [...stockSymbolsData];

        updatedStockSymbolsData = produce(updatedStockSymbolsData, (draft) => {
          searchedSymbolsIds.forEach((symbolIdObj) => {
            const updatedStockData = structuresQuotes.find(
              (structureItem) => structureItem.id.toString() === symbolIdObj.id,
            );

            const itemToUpdate = draft.find(
              (item) => item.symbol === symbolIdObj.symbol,
            );

            if (updatedStockData) {
              const updatedItem: StockSymbolData = {
                id: updatedStockData.id,
                last: updatedStockData.last || 0,
                symbol: symbolIdObj.symbol,
                min: updatedStockData.min || 0,
                max: updatedStockData.max || 0,
                oscilation: updatedStockData.oscilacao || 0,
              };

              if (itemToUpdate) {
                Object.assign(itemToUpdate, updatedItem);
              } //
              else {
                updatedStockSymbolsData.push(updatedItem);
              }
            }
          });
        });

        const updatedBoxesTab1Data = boxesTab1Data.map((boxItem) => {
          const boxFromAPI = {
            id: boxItem.id,
            configuration: boxItem.configuration,
            structure: boxItem.structure,
          };

          const structureQuote = structuresQuotes.find(
            (structureItem) => structureItem.id === boxItem.structureID,
          );

          if (structureQuote) {
            const { id, ...quotes } = structureQuote;

            for (const key in quotes) {
              const parsedKey = key as "max" | "min" | "last" | "oscilacao";

              const value = quotes[parsedKey];

              const isNumberValid = value?.toString() !== "0.0031415";

              if (typeof value === "number" && isNumberValid) {
                const boxKey =
                  parsedKey === "oscilacao" ? "oscilation" : parsedKey;

                Object.assign(boxFromAPI.structure, {
                  [boxKey]: value,
                });
              }
            }
          } else {
            boxFromAPI.structure = boxItem.structure;
          }

          return boxFromAPI;
        });

        dispatch(
          updateStructuresAndLoadBoxesAction(updatedBoxesTab1Data, false),
        );

        dispatch(
          updateManyMultiBoxAction({
            stockSymbolsData: updatedStockSymbolsData,
          }),
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
      const index = draft.findIndex((box) => box?.id === boxId);

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

export const findStockSymbol = async (topSymbols: TopSymbol[]) => {
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
      return stockSymbol;
      // const data = await getOneSymbolDataAPI(stockSymbol);

      // if (data) {
      //   const stockData: Omit<StockSymbolData, "id"> = {
      //     symbol: stockSymbol,
      //     last: data.ultimo,
      //     min: data.minimo,
      //     max: data.maximo,
      //     oscilation: data.oscilacao,
      //   };

      //   return stockData;
      // }
    }
  }

  return null;
};

// atualiza books das estruturas
export const startProactiveStructureBookUpdateAction = (
  ids: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { updateInterval },
      multiBoxReducer: { esource_books, interval_books },
    } = getState();

    if (esource_books && esource_books.close) {
      esource_books.close();
    }

    if (interval_books !== null) {
      clearInterval(interval_books);
    }

    if (ids) {
      const interval = setInterval(async () => {
        const data = await getProactiveBoxBooksAPI(ids);

        const {
          multiBoxReducer: { structuresBooks },
        } = getState();

        const updatedStructureBooks = produce(structuresBooks, (draft) => {
          data.forEach((updatedBook) => {
            const bookToUpdate = draft.find(
              (itemToUpdate) => itemToUpdate.structureId === updatedBook.id,
            );

            if (updatedBook) {
              const newBook: StructureBook = {
                structureId: updatedBook.id,
                book: {
                  buy: [],
                  sell: [],
                },
              };

              if (updatedBook.bookBuy) {
                newBook.book.buy = updatedBook.bookBuy
                  .filter(
                    (bookLine) =>
                      bookLine.price?.toString() !== "0.0031415" &&
                      bookLine.qtty?.toString() !== "0.0031415",
                  )
                  .map((bookLine) => ({
                    price: bookLine.price || 0,
                    qtty: bookLine.qtty || 0,
                    formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
                    formattedPrice: formatarNumDecimal(bookLine.price),
                  }));
              }

              if (updatedBook.bookSell) {
                newBook.book.sell = updatedBook.bookSell
                  .filter(
                    (bookLine) =>
                      bookLine.price?.toString() !== "0.0031415" &&
                      bookLine.qtty?.toString() !== "0.0031415",
                  )
                  .map((bookLine) => ({
                    price: bookLine.price || 0,
                    qtty: bookLine.qtty || 0,
                    formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
                    formattedPrice: formatarNumDecimal(bookLine.price),
                  }));
              }

              if (bookToUpdate) {
                bookToUpdate.book = newBook.book;
              } //
              else {
                draft.push(newBook);
              }
            }
          });
        });

        dispatch(
          updateManyMultiBoxAction({ structuresBooks: updatedStructureBooks }),
        );
      }, updateInterval);

      dispatch(
        updateManyMultiBoxAction({
          interval_books: interval,
        }),
      );
    }
  };
};

export const handleDuplicateBoxAction = (id: string): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: { boxes },
      systemReducer: { openedMenus, selectedTab },
    } = getState();

    const multiBox = boxes.find((box) => box?.id === id);

    if (multiBox) {
      const duplicatedBox = produce(multiBox, (draft) => {
        draft.id = v4();
        draft.tab1Id = -1;
        draft.toggleShowId = false;
        draft.isLoadingBox = true;
      });

      const updatedOpenedMenus = produce(openedMenus, (draft) => {
        draft.push({
          menuKey: `multiBox${duplicatedBox.id}`,
          tabKey: selectedTab,
        });
      });

      const updatedBoxes = produce(boxes, (draft) => {
        draft.push(duplicatedBox);
      });

      dispatch(
        updateManySystemState({
          openedMenus: updatedOpenedMenus,
        }),
      );

      dispatch(
        updateManyMultiBoxAction({
          boxes: updatedBoxes,
        }),
      );

      await dispatch(handleConcludeTab5Action(duplicatedBox.id));

      dispatch(
        updateBoxAttrAction(duplicatedBox.id, {
          isLoadingBox: false,
        }),
      );
    }
  };
};
