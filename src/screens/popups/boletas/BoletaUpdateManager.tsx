import { BoletaNamespace } from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import usePrevious from "hooks/usePrevious";
import useStateBoletas from "hooks/useStateBoletas";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import {
  startProactiveBoletaQuoteUpdateAction,
  startReactiveBoletaQuoteUpdateAction,
} from "redux/actions/boletas/boletasAPIActions";
import checkIfUpdateConfigChanged from "managers/updateManager/utils";

interface BoletaUpdateManagerProps {
  namespace: BoletaNamespace;
}

const BoletaUpdateManager: React.FC<BoletaUpdateManagerProps> = ({
  namespace,
}) => {
  const {
    systemReducer: { updateMode, updateInterval },
  } = useStateStorePrincipal();

  const { dadosPesquisa: symbolData } = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousSymbolData = usePrevious(symbolData);

  useEffect(() => {
    function checkIfBoletaChanged() {
      if (previousSymbolData && previousSymbolData.ativo !== symbolData.ativo) {
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

  return null;
};

export default BoletaUpdateManager;
