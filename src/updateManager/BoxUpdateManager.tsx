import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import {
  startProactiveMultiBoxUpdateAction,
  startReactiveMultiBoxUpdateAction,
} from "redux/actions/multiBox/multiBoxActions";

import checkIfUpdateConfigChanged from "./utils";

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval },
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousBoxesStructureData = usePrevious(boxesTab1Data);

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

  return null;
};

export default BoxUpdateManager;
