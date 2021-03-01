import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronDown } from "react-icons/fi";
import PerfectScroll from "react-perfect-scrollbar";

// import borderedPlusIcon from "assets/borderedPlus.png";
import { IoMdAddCircle, IoMdRepeat } from "react-icons/io";

import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import AlertItem from "./AlertItem";
import { listAlertsAPI } from "api/API";
import { updateOneMultilegState } from "modules/multileg/duck/actions/utils";
import { Table } from "react-bootstrap";

const Alert: React.FC = () => {
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();
  const {
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
        isOpenRightSideMenu: false,
      }),
    );

    dispatchGlobal(atualizarDivKeyAction("multileg"));
    dispatch(abrirItemBarraLateralAction("isOpenMultileg", true));
  }, [dispatch, dispatchGlobal]);

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
      <button
        onClick={handleOpenMultileg}
        className="brokerCustomButton newAlertButton"
      >
        <h6>ALERTAS</h6>
        <IoMdAddCircle fill="#333333" size={22} />
        {/* <div>
          <img src={borderedPlusIcon} alt="+" />
        </div> */}
      </button>
      <PerfectScroll
        containerRef={(ref) => {
          containerRef.current = ref;
        }}
        id="alertScroll"
        options={{ wheelPropagation: false }}
        onScrollY={handleDisplayArrowChange}
      >
        <div className="alertRightMenuContainer">
          <Table borderless>
            <thead>
              <tr>
                <th>Qtde</th>
                <th>Strike</th>
                <th>
                  <button className="brokerCustomButton">
                    <IoMdRepeat size={18} color="#dadada" />
                  </button>
                </th>
                <th>Preço</th>
              </tr>
            </thead>
          </Table>
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
