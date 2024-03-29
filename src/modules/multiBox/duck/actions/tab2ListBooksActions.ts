import { getProactiveBoxSymbolsBookAPI } from "api/proactive/ProativosAPI";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { MainThunkAction } from "types/ThunkActions";
import { updateManyMultiBoxAction } from "./multiBoxActions";

import { BoxSymbolData } from "../../types/MultiBoxState";
import produce from "immer";
import {
  clearIntervalAsync,
  setIntervalAsync,
  SetIntervalAsyncTimer,
} from "set-interval-async/dynamic";
import shouldDispatchAsyncUpdate from "shared/utils/shouldDispatchAsyncUpdate";

export const startProactiveBoxSymbolsUpdateAction = (
  idsArray: string[],
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      systemReducer: { updateInterval },
      multiBoxReducer: { esource_tab4Box, interval_tab4Box },
    } = getState();

    if (esource_tab4Box && esource_tab4Box.close) {
      esource_tab4Box.close();
    }

    if (interval_tab4Box !== null) {
      await clearIntervalAsync(interval_tab4Box);
    }

    const ids = idsArray.join(",");

    if (ids) {
      const updateBoxSymbols = async (interval: SetIntervalAsyncTimer) => {
        const data = await getProactiveBoxSymbolsBookAPI(ids);

        if (!data.length) {
          return;
        }

        const {
          multiBoxReducer: { symbolsData, interval_tab4Box },
        } = getState();

        let updatedSymbolsData: BoxSymbolData[] = [...symbolsData];

        updatedSymbolsData = produce(updatedSymbolsData, (draft) => {
          data.forEach((item) => {
            // Atualizar cotações e books dos ativos
            if (item.books) {
              item.books.forEach((book) => {
                const itemWithSameSymbol = draft.find(
                  (item) => item.symbol === book.symbol,
                );

                const symbolData: BoxSymbolData = {
                  symbol: book.symbol,
                  last: book.ultimo || 0,
                  buy: book.compra || 0,
                  buyQtty: book.compraQtde || 0,
                  sell: book.venda || 0,
                  sellQtty: book.vendaQtde || 0,
                  formattedBuy: "",
                  formattedBuyQtty: "",
                  formattedLast: "",
                  formattedSell: "",
                  formattedSellQtty: "",
                };

                Object.keys(symbolData).forEach((key) => {
                  const typedKey = key as keyof BoxSymbolData;

                  if (typeof symbolData[typedKey] === "number") {
                    const formattedKey =
                      "formatted" +
                      key.substr(0, 1).toLocaleUpperCase() +
                      key.substr(1);

                    let value = formatarNumDecimal(symbolData[typedKey]);

                    if (
                      ["formattedBuyQtty", "formattedSellQtty"].includes(
                        formattedKey,
                      )
                    ) {
                      value = formatarQuantidadeKMG(symbolData[typedKey]);
                    }

                    Object.assign(symbolData, {
                      [formattedKey]: value,
                    });
                  }
                });

                if (itemWithSameSymbol) {
                  Object.assign(itemWithSameSymbol, symbolData);
                } //
                else {
                  updatedSymbolsData.push(symbolData);
                }
              });
            }
          });
        });

        const shouldDispatch = shouldDispatchAsyncUpdate(
          interval,
          interval_tab4Box,
        );

        if (shouldDispatch) {
          dispatch(
            updateManyMultiBoxAction({
              symbolsData: updatedSymbolsData,
            }),
          );
        }
      };

      const interval = setIntervalAsync(async () => {
        await updateBoxSymbols(interval);
      }, updateInterval);

      dispatch(
        updateManyMultiBoxAction({
          interval_tab4Box: interval,
        }),
      );
    }
  };
};
