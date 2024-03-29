import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";
import {
  startProactiveThlQuoteUpdateAction,
  startProactiveThlStructuresUpdateAction,
  startReactiveThlQuoteUpdateAction,
  startReactiveThlStructuresUpdateAction,
} from "modules/thl/duck/actions/ThlAPIAction";

import { clearIntervalAsync } from "set-interval-async";

const THLUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenTHL },
    thlReducer: {
      opcoesStrike: thlLines,
      esource_thlQuotes,
      esource_thlStructures,
      interval_thlQuotes,
      interval_thlStructures,
      combinacoesTabela: thlCombinations,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousIsOpenTHL = usePrevious(isOpenTHL);
  const previousThlLines = usePrevious(thlLines);
  const previousThlCombinations = usePrevious(thlCombinations);

  // Iniciar atualizações
  useEffect(() => {
    function checkIfPricesChanged() {
      if (previousThlLines !== thlLines && thlLines.length) {
        return true;
      }
      return false;
    }

    function checkIfCombinationsChanged() {
      if (
        previousThlCombinations !== thlCombinations &&
        thlCombinations.length
      ) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        if (hasPricesChanged || hasUpdateConfigChanged) {
          dispatch(startReactiveThlStructuresUpdateAction());
        }
        if (hasCombinationsChanged || hasUpdateConfigChanged) {
          dispatch(startReactiveThlQuoteUpdateAction());
        }
      } //
      else if (updateMode === "proactive") {
        if (hasPricesChanged || hasUpdateConfigChanged) {
          dispatch(startProactiveThlStructuresUpdateAction());
        }
        if (hasCombinationsChanged || hasUpdateConfigChanged) {
          dispatch(startProactiveThlQuoteUpdateAction());
        }
      }
    }

    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });
    const hasPricesChanged = checkIfPricesChanged();
    const hasCombinationsChanged = checkIfCombinationsChanged();

    if (isOpenTHL) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateInterval,
    updateMode,
    dispatch,
    isOpenTHL,
    thlLines,
    thlCombinations,
  ]);

  // Parar atualização ao fechar THL
  useEffect(() => {
    if (!isOpenTHL && previousIsOpenTHL) {
      if (esource_thlQuotes && esource_thlQuotes.close) {
        esource_thlQuotes.close();
      }

      if (interval_thlQuotes) {
        clearIntervalAsync(interval_thlQuotes);
      }

      if (esource_thlStructures && esource_thlStructures.close) {
        esource_thlStructures.close();
      }

      if (interval_thlStructures) {
        clearIntervalAsync(interval_thlStructures);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenTHL]);

  return null;
};

export default THLUpdateManager;
