import { getProactiveBoxSymbolsBookAPI } from "api/proactive/ProativosAPI";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { MainThunkAction } from "types/ThunkActions";
import { updateManyMultiBoxAction } from "./multiBoxActions";

import { BoxSymbolData } from "../../types/MultiBoxState";

export const startProactiveBoxSymbolsUpdateAction = (
  symbolsArray: string[],
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { updateInterval },
      multiBoxReducer: { esource_tab4Box, interval_tab4Box },
    } = getState();

    if (esource_tab4Box && esource_tab4Box.close) {
      esource_tab4Box.close();
    }

    if (interval_tab4Box !== null) {
      clearInterval(interval_tab4Box);
    }

    const symbols = symbolsArray.join(",");

    if (symbols) {
      const interval = setInterval(async () => {
        const data = await getProactiveBoxSymbolsBookAPI(symbols);

        if (!data.length) {
          return;
        }

        const symbolsData = data.map((item) => {
          const symbolData: BoxSymbolData = {
            symbol: item.symbol,
            last: item.ultimo || 0,
            buy: item.compra || 0,
            buyQtty: item.compraQtde || 0,
            sell: item.venda || 0,
            sellQtty: item.vendaQtde || 0,
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
                ["formattedBuyQtty", "formattedSellQtty"].includes(formattedKey)
              ) {
                value = formatarQuantidadeKMG(symbolData[typedKey]);
              }

              Object.assign(symbolData, {
                [formattedKey]: value,
              });
            }
          });

          return symbolData;
        });

        dispatch(
          updateManyMultiBoxAction({
            symbolsData,
          }),
        );
      }, updateInterval);

      dispatch(
        updateManyMultiBoxAction({
          interval_tab4Box: interval,
        }),
      );
    }
  };
};
