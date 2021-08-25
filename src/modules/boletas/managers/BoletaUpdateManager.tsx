import { BoletaNamespace } from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import usePrevious from "hooks/usePrevious";
import useStateBoletas from "hooks/useStateBoletas";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import {
  startProactiveBoletaQuoteUpdateAction,
  startReactiveBoletaQuoteUpdateAction,
} from "../duck/actions/boletasAPIActions";
import checkIfUpdateConfigChanged from "managers/updateManager/utils";
import { mudarAtributoBoletaAction } from "../duck/actions/boletaActions";
import { clearIntervalAsync } from "set-interval-async";

interface BoletaUpdateManagerProps {
  namespace: BoletaNamespace;
  visibility: boolean;
}

const BoletaUpdateManager: React.FC<BoletaUpdateManagerProps> = ({
  namespace,
  visibility,
}) => {
  const {
    systemReducer: { updateMode, updateInterval },
  } = useStateStorePrincipal();

  const {
    dadosPesquisa: symbolData,
    esource_boletaQuote,
    interval_boletaQuote,
  } = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousSymbolData = usePrevious(symbolData);

  // start updates
  useEffect(() => {
    function checkIfBoletaChanged() {
      if (previousSymbolData && previousSymbolData !== symbolData) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        dispatch(startReactiveBoletaQuoteUpdateAction(namespace));
      } //
      else if (updateMode === "proactive") {
        dispatch(startProactiveBoletaQuoteUpdateAction(namespace));
      }
    }

    const hasBoletaChanged = checkIfBoletaChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged || hasBoletaChanged) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, symbolData, dispatch, namespace]);

  // cancel updates when close
  useEffect(() => {
    if (!visibility) {
      if (esource_boletaQuote) {
        esource_boletaQuote.close();
      }
      if (interval_boletaQuote) {
        clearIntervalAsync(interval_boletaQuote);
      }
      dispatch(mudarAtributoBoletaAction(0, namespace, "orderId"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility, namespace, dispatch]);

  return null;
};

export default BoletaUpdateManager;
