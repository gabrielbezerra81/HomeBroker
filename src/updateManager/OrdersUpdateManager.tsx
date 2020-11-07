import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "./utils";
import {
  listOrdersExecAction,
  startProactiveOrdersUpdateAction,
  startReactiveOrdersUpdateAction,
} from "redux/actions/ordensExecucao/OrdensExecActions";

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
        dispatch(startReactiveOrdersUpdateAction());
      } //
      else {
        dispatch(startProactiveOrdersUpdateAction());
      }
    }

    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (hasUpdateConfigChanged && ordersExecList.length) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch]);

  useEffect(() => {
    dispatch(listOrdersExecAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      Array.isArray(previousOrdersExecList) &&
      previousOrdersExecList.length === 0 &&
      ordersExecList.length
    ) {
      console.log("atualização inicial");
      if (updateMode === "reactive") {
        dispatch(startReactiveOrdersUpdateAction());
      } //
      else {
        dispatch(startProactiveOrdersUpdateAction());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ordersExecList]);

  return null;
};

export default OrdersUpdateManager;