import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";
import {
  listOrdersExecAction,
  startProactiveOrdersUpdateAction,
  startReactiveOrdersUpdateAction,
} from "modules/ordersExec/duck/actions/OrdensExecActions";

const OrdersUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval },
    ordersExecReducer: { tabelaOrdensExecucao: ordersExecList },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousOrdersExecList = usePrevious(ordersExecList);

  useEffect(() => {
    function startUpdate() {
      if (updateMode === "reactive") {
        // dispatch(startReactiveOrdersUpdateAction());
      } //
      else {
        // dispatch(startProactiveOrdersUpdateAction());
      }
    }

    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    // TODO: proactive => verificar se ordersExecList.length pode ser 0. No caso do box, onde há deleção, quando apagava o ultimo
    //                    deveria executar novamente
    if (hasUpdateConfigChanged && ordersExecList.length) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch]);

  // Listagem das ordens
  useEffect(() => {
    dispatch(listOrdersExecAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualização inicial
  useEffect(() => {
    const initialCondition =
      Array.isArray(previousOrdersExecList) &&
      previousOrdersExecList.length === 0 &&
      ordersExecList.length;

    const hasAddedOrder =
      Array.isArray(previousOrdersExecList) &&
      previousOrdersExecList.length !== 0 &&
      previousOrdersExecList.length !== ordersExecList.length;

    if (initialCondition || hasAddedOrder) {
      if (updateMode === "reactive") {
        // dispatch(startReactiveOrdersUpdateAction());
      } //
      else {
        dispatch(startProactiveOrdersUpdateAction());
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ordersExecList.length, updateMode]);

  return null;
};

export default OrdersUpdateManager;
