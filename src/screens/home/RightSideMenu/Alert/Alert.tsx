import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "react-bootstrap";
import PerfectScroll from "react-perfect-scrollbar";

import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import AlertItem from "./AlertItem";
import api from "api/apiConfig";
import { listAlertsAPI } from "api/API";
import { updateOneMultilegState } from "redux/actions/multileg/utils";

const Alert: React.FC = () => {
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();
  const {
    systemReducer: { isOpenMultileg },
    multilegReducer: { alerts },
  } = useStateStorePrincipal();

  const [hasOverflow, setHasOverflow] = useState(false);

  const [shouldDisplayArrow, setShouldDisplayArrow] = useState(true);

  const containerRef = useRef<HTMLElement | null>(null);

  const handleOpenMultileg = useCallback(() => {
    dispatch(
      updateManySystemState({
        multilegButtonsVisibility: false,
        createAlertButtonVisibility: true,
      }),
    );

    dispatchGlobal(atualizarDivKeyAction("multileg"));
    dispatch(abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg"));
  }, [dispatch, dispatchGlobal, isOpenMultileg]);

  const handleDisplayArrowChange = useCallback((container: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = container;

    const maxScrollTop = scrollHeight - clientHeight; // 1011

    setShouldDisplayArrow(scrollTop !== maxScrollTop);
  }, []);

  const handleScrollButton = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTop + 250,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    async function loadAlerts() {
      const alertData = await listAlertsAPI();

      dispatch(
        updateOneMultilegState({
          attributeName: "alerts",
          attributeValue: alertData,
        }),
      );
    }

    loadAlerts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const bar = document.getElementById("alertScroll");

    if (bar) {
      if (bar.scrollHeight > bar.clientHeight && alerts.length > 0) {
        setHasOverflow(true);
      } else {
        setHasOverflow(false);
      }
    }
  }, [alerts.length]);

  const scrollButtonVisibility = useMemo(() => {
    return shouldDisplayArrow ? "" : "hiddenButton";
  }, [shouldDisplayArrow]);

  return (
    <>
      <Button onClick={handleOpenMultileg}>Novo +</Button>
      <PerfectScroll
        containerRef={(ref) => {
          containerRef.current = ref;
        }}
        id="alertScroll"
        options={{ wheelPropagation: false }}
        onScrollY={handleDisplayArrowChange}
      >
        <div className="alertRightMenuContainer">
          {alerts.map((alertItem, index) => (
            <AlertItem key={alertItem.id} alert={alertItem} />
          ))}
        </div>
      </PerfectScroll>

      {hasOverflow && (
        <div
          className={`alertScrollButton ${scrollButtonVisibility}`}
          tabIndex={0}
          onClick={handleScrollButton}
        >
          <FiChevronDown size={24} />
        </div>
      )}
    </>
  );
};

export default Alert;
