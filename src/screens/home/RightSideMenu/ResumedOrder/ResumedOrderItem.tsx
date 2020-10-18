import React, { useMemo } from "react";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { Order } from "types/ordersExec/ordersExec";

interface ResumedOrderItemProps {
  order: Order;
}

const ResumedOrderItem: React.FC<ResumedOrderItemProps> = ({ order }) => {
  const progress = useMemo(() => {
    const initial = { offerQtty: 0, execQtty: 0 };

    const qttyValues = order.offers.reduce((acc, cur) => {
      return {
        offerQtty: acc.offerQtty + cur.qtdeOferta,
        execQtty: acc.execQtty + cur.qtdeExecutada,
      };
    }, initial);

    return (qttyValues.execQtty / qttyValues.offerQtty) * 100;
  }, [order]);

  return (
    <div className="resumedOrderItem">
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <div className="offersContainer">
        {order.offers.map((offerItem) => (
          <div className="offer">
            <div
              className={`offerType ${
                offerItem.oferta === "C" ? "buyType" : "sellType"
              }`}
            >
              <strong>{offerItem.oferta}</strong>
            </div>
            <span className="symbol">{offerItem.ativo}</span>
            <span>
              {offerItem.qtdeExecutada < 1000
                ? offerItem.qtdeExecutada
                : formatarQuantidadeKMG(offerItem.qtdeExecutada)}
            </span>
          </div>
        ))}
      </div>

      <span>
        R${" "}
        {formatarNumDecimal(
          order.offers[0].precoDisparo || order.offers[0].precoEnvio || 0,
        )}
      </span>
    </div>
  );
};

export default ResumedOrderItem;
