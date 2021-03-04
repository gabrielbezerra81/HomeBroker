import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect, useMemo, useState } from "react";

import _ from "lodash";

import {
  startProactiveMultiBoxUpdateAction,
  startReactiveMultiBoxUpdateAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";
import { startProactiveBoxSymbolsUpdateAction } from "../duck/actions/tab4Actions";
import { ParsedConfiguration } from "../types/MultiBoxState";

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, selectedTab },
    multiBoxReducer: { boxesTab1Data, boxes, symbolsData },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const symbols = useMemo(() => {
    const symbols: string[] = [];

    boxes.forEach((multiBox) => {
      const structureData = boxesTab1Data.find(
        (data) => data.boxId === multiBox.id,
      );

      if (!structureData) {
        return;
      }

      const configuration = JSON.parse(
        structureData.configuration,
      ) as ParsedConfiguration;

      if (configuration.tabKey !== selectedTab && !isInitialLoading) {
        return;
      }

      multiBox.topSymbols.forEach((topSymbol) => {
        if (
          !symbols.includes(topSymbol.code) &&
          (multiBox.activeTab === "2" || isInitialLoading)
        ) {
          symbols.push(topSymbol.code);
        }
      });
    });

    return symbols;
  }, [boxes, boxesTab1Data, isInitialLoading, selectedTab]);

  const previousSymbols = usePrevious(symbols);

  const structureIds = useMemo(() => {
    const filtered = boxesTab1Data.filter((data) => {
      const configuration = JSON.parse(
        data.configuration,
      ) as ParsedConfiguration;

      return configuration.tabKey === selectedTab;
    });

    const uniqueIdsList = [
      ...new Set(filtered.map((data) => data.structureID)),
    ];

    return uniqueIdsList.join(",");
  }, [boxesTab1Data, selectedTab]);

  const previousStructureIds = usePrevious(structureIds);

  // Atualização da estrutura
  useEffect(() => {
    function checkIfBoxChanged() {
      if (!_.isEqual(previousStructureIds, structureIds)) {
        return true;
      }

      if (previousStructureIds === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        // dispatch(startReactiveBoxUpdateAction());
        dispatch(startReactiveMultiBoxUpdateAction(structureIds));
      } //
      else if (updateMode === "proactive") {
        // dispatch(startProactiveBoxUpdateAction());
        // dispatch(startProactiveMultiBoxUpdateAction(structureIds));
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
  }, [updateInterval, updateMode, dispatch, structureIds]);

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
  }, [symbols, updateInterval, updateMode, dispatch]);

  useEffect(() => {
    if (symbolsData.length > 0) {
      setIsInitialLoading(false);
    }
  }, [symbolsData.length]);

  return null;
};

export default BoxUpdateManager;
