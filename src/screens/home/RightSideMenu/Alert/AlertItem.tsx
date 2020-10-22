import React, { useEffect, useMemo, useState } from "react";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import moment from "moment";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { AlertAPI } from "types/multileg/multileg";

interface AlertItemProps {
  alert: AlertAPI;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const [hasOverflow, setHasOverflow] = useState(() => {
    const symbolsArray: string[] = [];

    alert.structure.components.forEach((componentItem) => {
      symbolsArray.push(componentItem.stock.symbol);
    });

    const symbols = symbolsArray.join("");

    return symbols.length > 13;
  });

  const formattedData = useMemo(() => {
    return {
      price: formatarNumDecimal(alert.price, 2),
      expiration: moment("20/10/2020 22:00:00", "DD/MM/YYYY HH:mm:ss").format(
        "DD/MM/YY",
      ),
    };
  }, [alert]);

  const arrowColor = useMemo(() => {
    switch (alert.param) {
      case "Bid":
        return "#207FA5";
      case "Ask":
        return "#996666";
      default:
        return "#ccc";
    }
  }, [alert.param]);

  useEffect(() => {
    const positionItem = document.getElementById(`alertItem${alert.id}`);

    if (positionItem) {
      setHasOverflow(positionItem.getBoundingClientRect().width > 198);
    }
  }, [alert.id]);

  return hasOverflow ? (
    <>
      {alert.structure.components.map((componentItem, index) => (
        <div
          className="alertItem"
          key={`${componentItem.stock.symbol}${index}`}
        >
          <div>
            <span style={{ color: "#ddd" }}>{componentItem.stock.symbol}</span>
            <span>
              {componentItem.qtty > 0
                ? `+${componentItem.qtty}`
                : componentItem.qtty}
            </span>
          </div>
          <div>
            <span>
              {formattedData.price}{" "}
              {alert.operator === "Less" ? (
                <FaLongArrowAltDown fill={arrowColor} />
              ) : (
                <FaLongArrowAltUp fill={arrowColor} />
              )}
            </span>
            <span>val: {formattedData.expiration}</span>
          </div>
        </div>
      ))}
    </>
  ) : (
    <div className="alertItem" id={`alertItem${alert.id}`}>
      {alert.structure.components.map((componentItem, index) => (
        <div key={`${componentItem.stock.symbol}${index}`}>
          <span style={{ color: "#ddd" }}>{componentItem.stock.symbol}</span>
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
          {alert.operator === "Less" ? (
            <FaLongArrowAltDown fill={arrowColor} />
          ) : (
            <FaLongArrowAltUp fill={arrowColor} />
          )}
        </span>
        <span>val: {formattedData.expiration}</span>
      </div>
    </div>
  );
};

export default AlertItem;
