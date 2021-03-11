import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect, useMemo, useState } from "react";

import _ from "lodash";

import {
  startProactiveMultiBoxUpdateAction,
  startProactiveStructureBookUpdateAction,
  startReactiveMultiBoxUpdateAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";
import { startProactiveBoxSymbolsUpdateAction } from "../duck/actions/tab2ListBooksActions";
import { getStructureBySymbolAPI } from "api/symbolAPI";

interface SymbolIdObj {
  id: string;
  symbol: string;
}

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, selectedTab, openedMenus },
    multiBoxReducer: { boxesTab1Data, boxes, symbolsData, structuresBooks },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);

  const [isLoadingTab1, setIsLoadingTab1] = useState(true);
  const [isLoadingTab2, setIsLoadingTab2] = useState(true);
  const [searchedSymbolsIds, setSearchedSymbolsIds] = useState<SymbolIdObj[]>(
    [],
  );

  const previousSearchedSymbolsIds = usePrevious(searchedSymbolsIds);

  const boxesInActiveMainTab = useMemo(() => {
    return openedMenus
      .filter(
        (item) =>
          item.tabKey === selectedTab && item.menuKey.includes("multiBox"),
      )
      .map((item) => item.menuKey.replace("multiBox", ""));
  }, [openedMenus, selectedTab]);

  const filteredStructIds = useMemo(() => {
    const filtered = boxesTab1Data.filter((data) => {
      return boxesInActiveMainTab.includes(data.boxId);
    });

    const uniqueIdsList = [
      ...new Set(filtered.map((data) => data.structureID)),
    ];

    return uniqueIdsList.join(",");
  }, [boxesInActiveMainTab, boxesTab1Data]);

  const searchedSymbols = useMemo(() => {
    const symbols: string[] = [];

    boxes.forEach((box) => {
      if (!box) {
        return;
      }

      const isBoxInActiveMainTab = boxesInActiveMainTab.includes(box.id);

      if (!isBoxInActiveMainTab) {
        return;
      }

      if (box.searchedSymbol && !symbols.includes(box.searchedSymbol)) {
        symbols.push(box.searchedSymbol);
      }
    });

    return symbols;
  }, [boxes, boxesInActiveMainTab]);

  useEffect(() => {
    async function getSearchedSymbolsIds() {
      if (searchedSymbols.length) {
        const ids: SymbolIdObj[] = [];

        for await (const symbol of searchedSymbols) {
          const data = await getStructureBySymbolAPI(symbol);

          if (data) {
            ids.push({ id: data.id.toString(), symbol });
          }
        }

        setSearchedSymbolsIds(ids);
      } //
      else {
        setSearchedSymbolsIds([]);
      }
    }

    getSearchedSymbolsIds();
  }, [searchedSymbols]);

  const idsTab0 = useMemo(() => {
    return filteredStructIds;
  }, [filteredStructIds]);

  const previousIdsTab0 = usePrevious(idsTab0);

  const idsTab1 = useMemo(() => {
    const ids: string[] = [];

    boxesTab1Data.forEach((data) => {
      const boxIsInActiveMainTab = boxesInActiveMainTab.includes(data.boxId);

      const multiBox = boxes.find((box) => box?.id === data.boxId);
      const alreadyAddedId = ids.includes(data.structureID.toString());

      if (!multiBox) {
        return;
      }

      if (
        !alreadyAddedId &&
        ((boxIsInActiveMainTab && multiBox.activeTab === "1") || isLoadingTab1)
      ) {
        ids.push(data.structureID.toString());
      }
    });

    return ids;
  }, [boxes, boxesInActiveMainTab, boxesTab1Data, isLoadingTab1]);

  const previousIdsTab1 = usePrevious(idsTab1);

  const idsTab2 = useMemo(() => {
    const ids: string[] = [];

    boxesTab1Data.forEach((data) => {
      const boxIsInActiveMainTab = boxesInActiveMainTab.includes(data.boxId);

      const multiBox = boxes.find((box) => box?.id === data.boxId);
      const alreadyAddedId = ids.includes(data.structureID.toString());

      if (!multiBox) {
        return;
      }

      if (
        !alreadyAddedId &&
        ((boxIsInActiveMainTab && multiBox.activeTab === "2") || isLoadingTab2)
      ) {
        ids.push(data.structureID.toString());
      }
    });

    return ids;
  }, [boxes, boxesInActiveMainTab, boxesTab1Data, isLoadingTab2]);

  const previousIdsTab2 = usePrevious(idsTab2);

  // Atualização das cotações da estrutura
  useEffect(() => {
    function checkIfTab0IdsChanged() {
      if (!_.isEqual(previousIdsTab0, idsTab0)) {
        return true;
      }

      if (!_.isEqual(previousSearchedSymbolsIds, searchedSymbolsIds)) {
        return true;
      }

      if (previousIdsTab0 === undefined) {
        return true;
      }

      if (previousSearchedSymbolsIds === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        // dispatch(startReactiveBoxUpdateAction());
        dispatch(startReactiveMultiBoxUpdateAction(idsTab0));
      } //
      else if (updateMode === "proactive") {
        // dispatch(startProactiveBoxUpdateAction());
        dispatch(
          startProactiveMultiBoxUpdateAction({
            idsTab0,
            searchedSymbolsIds,
          }),
        );
      }
    }

    const hasTab0IdsChanged = checkIfTab0IdsChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasTab0IdsChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch, idsTab0, searchedSymbolsIds]);

  // Atualização do book da estrutura
  useEffect(() => {
    function checkIfTab1IdsChanged() {
      if (!_.isEqual(previousIdsTab1, idsTab1)) {
        return true;
      }

      if (previousIdsTab1 === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveStructureBookUpdateAction(idsTab1.join(",")));
      }
    }

    const hasTab1IdsChanged = checkIfTab1IdsChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasTab1IdsChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, idsTab1, updateInterval, updateMode]);

  // Atualizar books e cotações da aba 2 (books dos ativos) - Apenas para carregamento inicial dos books
  useEffect(() => {
    function checkIfTab2IdsChanged() {
      if (!_.isEqual(previousIdsTab2, idsTab2)) {
        return true;
      }

      if (previousIdsTab2 === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveBoxSymbolsUpdateAction(idsTab2));
      }
    }

    const hasTab2IdsChanged = checkIfTab2IdsChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasTab2IdsChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsTab2, updateInterval, updateMode, dispatch]);

  // Interromper a atualização inicial da aba 1 quando o array for preenchido
  useEffect(() => {
    if (structuresBooks.length > 0) {
      setIsLoadingTab1(false);
    }
  }, [structuresBooks.length]);

  // Interromper a atualização inicial da aba 2 quando o array for preenchido
  useEffect(() => {
    if (symbolsData.length > 0) {
      setIsLoadingTab2(false);
    }
  }, [symbolsData.length]);

  return null;
};

export default BoxUpdateManager;
