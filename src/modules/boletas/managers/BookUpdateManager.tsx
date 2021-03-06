import React, { useEffect } from "react";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "managers/updateManager/utils";
import useStateBoletas from "hooks/useStateBoletas";
import {
  startProactiveOffersBookUpdateAction,
  startReactiveOffersBookUpdateAction,
} from "../duck/actions/bookOfertaAPIActions";

const BookUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval },
  } = useStateStorePrincipal();

  const { searchedSymbol } = useStateBoletas().bookOfertaReducer;

  const dispatch = useDispatchBoletas();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousSearchedSymbol = usePrevious(searchedSymbol);

  useEffect(() => {
    function checkIfBookChanged() {
      if (previousSearchedSymbol !== searchedSymbol) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        dispatch(startReactiveOffersBookUpdateAction());
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveOffersBookUpdateAction());
      }
    }

    const hasBookChanged = checkIfBookChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasBookChanged) {
      startUpdate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, updateInterval, updateMode, searchedSymbol]);

  return null;
};

export default BookUpdateManager;
