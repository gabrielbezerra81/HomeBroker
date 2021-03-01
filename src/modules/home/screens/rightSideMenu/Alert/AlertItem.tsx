import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

import closeIcon from "assets/closeIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";

import moment from "moment";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { AlertAPI } from "modules/multileg/types/multileg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateAlertAPI } from "api/API";
import {} from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import produce from "immer";
import { updateOneMultilegState } from "modules/multileg/duck/actions/utils";
import { openAlertInMultileg } from "modules/multileg/duck/actions/AlertsAction";
import SymbolCard from "shared/components/SymbolCard/SymbolCard";
import getSymbolExpirationInDays from "shared/utils/getSymbolExpirationInDays";
import { Table } from "react-bootstrap";

interface AlertItemProps {
  alert: AlertAPI;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert: alertItem }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
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

  const handleRemove = useCallback(async () => {
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

  const handleOpenInMultileg = useCallback(() => {
    dispatch(openAlertInMultileg(alertItem));
  }, [alertItem, dispatch]);

  const formattedData = useMemo(() => {
    let condition = "Últ ";

    if (alertItem.param === "Bid") {
      condition = "Compra ";
    } //
    else if (alertItem.param === "Ask") {
      condition = "Venda ";
    }

    if (alertItem.operator === "Greater") {
      condition += ">=";
    } //
    else if (alertItem.operator === "Less") {
      condition += "<=";
    }

    return {
      price: formatarNumDecimal(alertItem.price, 2),
      expiration: moment(alertItem.expiration, "DD/MM/YYYY HH:mm:ss").format(
        "DD/MM/YY",
      ),
      condition,
    };
  }, [alertItem]);

  const arrowColor = useMemo(() => {
    switch (alertItem.param) {
      case "Bid":
        return "#207FA5";
      case "Ask":
        return "#FF2A00";
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

  const symbolCardsData = useMemo(() => {
    return alertItem.structure.components.map((component) => {
      return {
        code: component.stock.symbol,
        qtty: component.qtty,
        model: component.stock.model as any,
        type: component.stock.type || ("" as any),
        strike: component.stock.strike,
        offerType: component.qtty > 0 ? "C" : "V",
        formattedCode: "",
        expiration: component.stock.option
          ? getSymbolExpirationInDays(component.stock.endBusiness)
          : "",
        viewMode: "code",
      };
    });
  }, [alertItem.structure.components]);

  const firstSymbolCardData = useMemo(() => {
    if (symbolCardsData.length) {
      return symbolCardsData[0];
    }

    return null;
  }, [symbolCardsData]);

  return (
    <div className="alertItemContainer">
      <div className="symbolCardRow">
        {!!firstSymbolCardData && (
          <SymbolCard data={firstSymbolCardData as any} showQtty showQttyPlus />
        )}

        <button
          className="brokerCustomButton openInMultilegButton"
          onClick={handleOpenInMultileg}
        >
          <img src={openInNewIcon} alt="" />
        </button>

        <button className="brokerCustomButton" onClick={handleRemove}>
          <img src={closeIcon} alt="" />
        </button>
      </div>

      {symbolCardsData.map((data, index) => {
        if (index === 0) {
          return null;
        }

        return (
          <div className="symbolCardRow">
            <SymbolCard data={data as any} showQtty showQttyPlus />
          </div>
        );
      })}

      <Table borderless>
        <thead>
          <tr>
            <th>Condição</th>
            <th>Preço</th>
            <th>Validade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formattedData.condition}</td>
            <td className="priceColumn">
              <div>
                {formattedData.price}{" "}
                {alertItem.operator === "Less" ? (
                  <FaLongArrowAltDown fill={arrowColor} />
                ) : (
                  <FaLongArrowAltUp fill={arrowColor} />
                )}
              </div>
            </td>
            <td className="expirationColumn">
              <div>{formattedData.expiration}</div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

// 5188 1401 8309 7648 11/24 SORAYA M D BEZERRA

export default AlertItem;

/*


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

*/
