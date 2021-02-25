import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect, useMemo } from "react";

import _ from "lodash";

import {
  startProactiveMultiBoxUpdateAction,
  startReactiveMultiBoxUpdateAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";
import { startProactiveBoxSymbolsUpdateAction } from "../duck/actions/tab4Actions";

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval },
    multiBoxReducer: { boxesTab1Data, boxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousBoxesStructureData = usePrevious(boxesTab1Data);

  const symbols = useMemo(() => {
    const symbols: string[] = [];

    boxes.forEach((multiBox) => {
      multiBox.topSymbols.forEach((topSymbol) => {
        if (!symbols.includes(topSymbol.code) && multiBox.activeTab === "2") {
          symbols.push(topSymbol.code);
        }
      });
    });

    return symbols;
  }, [boxes]);

  const previousSymbols = usePrevious(symbols);

  // Atualização da estrutura
  useEffect(() => {
    function checkIfBoxChanged() {
      if (
        previousBoxesStructureData &&
        previousBoxesStructureData.length !== boxesTab1Data.length
      ) {
        return true;
      }

      if (previousBoxesStructureData === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        // dispatch(startReactiveBoxUpdateAction());
        dispatch(startReactiveMultiBoxUpdateAction());
      } //
      else if (updateMode === "proactive") {
        // dispatch(startProactiveBoxUpdateAction());
        dispatch(startProactiveMultiBoxUpdateAction());
      }
    }

    const hasBoxesChanged = checkIfBoxChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasBoxesChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch, boxesTab1Data.length]);

  // Atualizar books e cotações da 2ª aba (books dos ativos)
  useEffect(() => {
    function checkIfSymbolsChanged() {
      if (!_.isEqual(previousSymbols, symbols)) {
        return true;
      }

      if (previousSymbols === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveBoxSymbolsUpdateAction(symbols));
      }
    }

    const hasSymbolsChanged = checkIfSymbolsChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasSymbolsChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols, updateInterval, updateMode]);

  return null;
};

export default BoxUpdateManager;
