import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import moment from "moment";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { AlertAPI } from "types/multileg/multileg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateAlertAPI } from "api/API";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import {
  abrirItemBarraLateralAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import produce from "immer";
import { updateOneMultilegState } from "redux/actions/multileg/utils";

interface AlertItemProps {
  alert: AlertAPI;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert: alertItem }) => {
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isOpenMultileg },
    multilegReducer: { alerts },
  } = useStateStorePrincipal();

  const [hasOverflow, setHasOverflow] = useState(() => {
    const symbolsArray: string[] = [];

    alertItem.structure.components.forEach((componentItem) => {
      symbolsArray.push(componentItem.stock.symbol);
    });

    const symbols = symbolsArray.join("");

    return symbols.length > 13;
  });

  const [headerVisible, setHeaderVisible] = useState(false);

  const handleHeaderVisibilityChange = useCallback(
    () => setHeaderVisible((oldValue) => !oldValue),
    [],
  );

  const handleClose = useCallback(async () => {
    const response = await updateAlertAPI(alertItem.id, { status: "Disabled" });

    if (response.success) {
      const updatedAlerts = produce(alerts, (draft) => {
        return draft.filter((item) => item.id !== alertItem.id);
      });

      dispatch(
        updateOneMultilegState({
          attributeName: "alerts",
          attributeValue: updatedAlerts,
        }),
      );
    }
  }, [alertItem.id, alerts, dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(
      updateManySystemState({
        multilegButtonsVisibility: false,
        createAlertButtonVisibility: true,
      }),
    );

    dispatchGlobal(atualizarDivKeyAction("multileg"));
    dispatch(
      abrirItemBarraLateralAction({ isOpenMultileg }, "isOpenMultileg", true),
    );
  }, [dispatch, dispatchGlobal, isOpenMultileg]);

  const formattedData = useMemo(() => {
    return {
      price: formatarNumDecimal(alertItem.price, 2),
      expiration: moment(alertItem.expiration, "DD/MM/YYYY HH:mm:ss").format(
        "DD/MM/YY",
      ),
    };
  }, [alertItem]);

  const arrowColor = useMemo(() => {
    switch (alertItem.param) {
      case "Bid":
        return "#207FA5";
      case "Ask":
        return "#996666";
      default:
        return "#ccc";
    }
  }, [alertItem.param]);

  useEffect(() => {
    const positionItem = document.getElementById(`alertItem${alertItem.id}`);

    if (positionItem) {
      setHasOverflow(positionItem.getBoundingClientRect().width > 198);
    }
  }, [alertItem.id]);

  return (
    <div className="alertItemContainer">
      <header className="itemHeader" style={{ opacity: headerVisible ? 1 : 0 }}>
        <button onClick={handleSearch}>
          <FiSearch size={20} stroke="#444" />
        </button>

        <button onClick={handleClose}>
          <RiCloseCircleFill size={20} fill="#444" />
        </button>
      </header>
      {hasOverflow ? (
        <>
          {alertItem.structure.components.map((componentItem, index) => (
            <button
              className="alertItem"
              key={`${componentItem.stock.symbol}${index}`}
              onClick={handleHeaderVisibilityChange}
            >
              <div>
                <span style={{ color: "#ddd" }}>
                  {componentItem.stock.symbol}
                </span>
                <span>
                  {componentItem.qtty > 0
                    ? `+${componentItem.qtty}`
                    : componentItem.qtty}
                </span>
              </div>
              <div>
                <span>
                  {formattedData.price}{" "}
                  {alertItem.operator === "Less" ? (
                    <FaLongArrowAltDown fill={arrowColor} />
                  ) : (
                    <FaLongArrowAltUp fill={arrowColor} />
                  )}
                </span>
                <span>val: {formattedData.expiration}</span>
              </div>
            </button>
          ))}
        </>
      ) : (
        <button
          className="alertItem"
          id={`alertItem${alertItem.id}`}
          onClick={handleHeaderVisibilityChange}
        >
          {alertItem.structure.components.map((componentItem, index) => (
            <div key={`${componentItem.stock.symbol}${index}`}>
              <span style={{ color: "#ddd" }}>
                {componentItem.stock.symbol}
              </span>
              <span>
                {componentItem.qtty > 0
                  ? `+${componentItem.qtty}`
                  : componentItem.qtty}
              </span>
            </div>
          ))}
          <div>
            <span>
              {formattedData.price}{" "}
              {alertItem.operator === "Less" ? (
                <FaLongArrowAltDown fill={arrowColor} />
              ) : (
                <FaLongArrowAltUp fill={arrowColor} />
              )}
            </span>
            <span>val: {formattedData.expiration}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AlertItem;
