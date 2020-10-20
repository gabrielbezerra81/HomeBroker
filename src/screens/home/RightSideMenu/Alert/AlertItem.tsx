import React, { useMemo } from "react";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import moment from "moment";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { AlertAPI } from "types/multileg/multileg";

interface AlertItemProps {
  alert: AlertAPI;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
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

  return (
    <div className="alertItem">
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
