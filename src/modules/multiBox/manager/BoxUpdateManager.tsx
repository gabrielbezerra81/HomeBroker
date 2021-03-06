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
import { startProactiveBoxSymbolsUpdateAction } from "../duck/actions/tab4Actions";
import { ParsedConfiguration } from "../types/MultiBoxState";

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, selectedTab },
    multiBoxReducer: { boxesTab1Data, boxes, symbolsData, structuresBooks },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);

  const [isLoadingTab1, setIsLoadingTab1] = useState(true);
  const [isLoadingTab2, setIsLoadingTab2] = useState(true);

  const filteredStructIds = useMemo(() => {
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

  const idsTab0 = useMemo(() => {
    return filteredStructIds;
  }, [filteredStructIds]);

  const previousIdsTab0 = usePrevious(idsTab0);

  const idsTab1 = useMemo(() => {
    const ids: string[] = [];

    boxesTab1Data.forEach((data) => {
      const boxIsInActiveMainTab = filteredStructIds.includes(
        data.structureID.toString(),
      );

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
  }, [boxes, boxesTab1Data, filteredStructIds, isLoadingTab1]);

  const previousIdsTab1 = usePrevious(idsTab1);

  const idsTab2 = useMemo(() => {
    const ids: string[] = [];

    boxesTab1Data.forEach((data) => {
      const boxIsInActiveMainTab = filteredStructIds.includes(
        data.structureID.toString(),
      );

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
  }, [boxes, boxesTab1Data, filteredStructIds, isLoadingTab2]);

  const previousIdsTab2 = usePrevious(idsTab2);

  // Atualização das cotações da estrutura
  useEffect(() => {
    function checkIfTab0IdsChanged() {
      if (!_.isEqual(previousIdsTab0, idsTab0)) {
        return true;
      }

      if (previousIdsTab0 === undefined) {
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
        dispatch(startProactiveMultiBoxUpdateAction(idsTab0));
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
  }, [updateInterval, updateMode, dispatch, idsTab0]);

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
