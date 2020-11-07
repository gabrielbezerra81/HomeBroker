import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import {
  startReactiveBoxUpdateAction,
  startProactiveBoxUpdateAction,
} from "redux/actions/system/boxesActions";

import checkIfUpdateConfigChanged from "./utils";

const BoxUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, quoteBoxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousQuoteBoxes = usePrevious(quoteBoxes);

  useEffect(() => {
    function checkIfBoxChanged() {
      if (
        previousQuoteBoxes &&
        previousQuoteBoxes.length !== quoteBoxes.length
      ) {
        return true;
      }

      if (previousQuoteBoxes === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        dispatch(startReactiveBoxUpdateAction());
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveBoxUpdateAction());
      }
    }

    const hasBoxesChanged = checkIfBoxChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if ((hasUpdateConfigChanged || hasBoxesChanged) && quoteBoxes.length) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch, quoteBoxes.length]);

  return null;
};

export default BoxUpdateManager;
