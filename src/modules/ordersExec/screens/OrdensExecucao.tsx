import React, { useCallback, useMemo, useState } from "react";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
import { listOrdersExecAction } from "../duck/actions/OrdensExecActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import { MdRefresh } from "react-icons/md";
import OrdersTable from "./OrdersTable";
import { useEffect } from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import bringToForegroundOnMount from "shared/utils/PopupLifeCycle/bringToForegroundOnMount";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import usePrevious from "hooks/usePrevious";
import { Order } from "../types/ordersExec";

interface Props {
  headerTitle: string;
  // mainPopup is the one opened by left side menu
  // helperPopup is showed bellow multileg and boletas
  type: "mainPopup" | "helperPopup";
  data?: Order[];
}

const popupDivKey = "ordens_execucao";

const OrdensExecucao: React.FC<Props> = ({ headerTitle, type, data = [] }) => {
  const dispatch = useDispatchStorePrincipal();
  const dispatchGlobal = useDispatchGlobalStore();

  const { zIndex: currentZIndex, divkey: currentDivKey } =
    useStateGlobalStore();

  const {
    ordersExecReducer: { tabelaOrdensExecucao },
    systemReducer: { isOpenOrdersExec },
  } = useStateStorePrincipal();

  const previousDivkey = usePrevious(currentDivKey);

  useEffect(() => {
    bringToForegroundOnMount({
      popupDivKey,
      currentDivKey,
      currentZIndex,
      increaseZIndex: () =>
        dispatchGlobal(aumentarZindexAction(popupDivKey, currentZIndex, true)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPopupZIndexFromSecondaryTab({
      zIndex: currentZIndex,
      previousDivkey,
      currentDivkey: currentDivKey,
      divkeyToCheck: popupDivKey,
      popupVisibility: isOpenOrdersExec,
      updateFunction: (...data) =>
        dispatchGlobal(aumentarZindexAction(...data)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDivKey, isOpenOrdersExec]);

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenOrdersExec"));
  }, [dispatch]);

  const ordersData = useMemo(() => {
    if (type === "mainPopup") {
      return tabelaOrdensExecucao;
    }

    return data;
  }, [data, tabelaOrdensExecucao, type]);

  const renderModalBody = useCallback(() => {
    return (
      <OrdersTable data={ordersData} allowOpenOptions={type === "mainPopup"} />
    );
  }, [ordersData, type]);

  const renderHeader = useCallback(() => {
    return (
      <PopupHeader
        headerTitle={headerTitle}
        headerClass="border-green"
        onConfig={() => {}}
        onClose={onClose}
        icons={
          <>
            <RefreshButton />
          </>
        }
      />
    );
  }, [headerTitle, onClose]);

  if (type === "helperPopup") {
    if (data.length === 0) {
      return <div className="ordens_execucao hidden"></div>;
    }

    return (
      <div className="ordens_execucao">
        <div className="mcontent">{renderModalBody()}</div>
      </div>
    );
  }

  return (
    <DraggableModal
      id="ordens_execucao"
      renderModalBody={renderModalBody}
      renderHeader={renderHeader}
    />
  );
};

const RefreshButton = () => {
  const dispatch = useDispatchStorePrincipal();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    await dispatch(listOrdersExecAction());

    setIsRefreshing(false);
  }, [dispatch]);

  const refreshingClass = useMemo(() => {
    if (isRefreshing) {
      return "isRefreshing";
    }

    return "";
  }, [isRefreshing]);

  return (
    <button
      onClick={handleRefresh}
      className={`brokerCustomButton iconesHeader headerRefreshButton ${refreshingClass}`}
    >
      <MdRefresh size={24} />
    </button>
  );
};

export default OrdensExecucao;
