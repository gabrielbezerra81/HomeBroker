import React, { useMemo } from "react";
// import { Tooltip } from "antd";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
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

  const formattedPrices = useMemo(() => {
    const offer = order.offers[0];

    return {
      trigger: formatarNumDecimal(offer.precoDisparo || 0),
      send: formatarNumDecimal(offer.precoEnvio || 0),
      limit: formatarNumDecimal(offer.precoLimite || 0),
      executed: formatarNumDecimal(offer.precoLimite || 0),
    };
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

      <OverlayTrigger
        placement="top"
        overlay={({ arrowProps, ...props }) => (
          <Tooltip
            id={`tooltip${order.id}`}
            {...props}
            arrowProps={{
              ...arrowProps,
              style: {
                ...arrowProps.style,
                bottom: 0,
                color: "#4c4b4b",
              },
            }}
            className="resumedOrderTooltip"
          >
            <div>
              <header>
                <span>Preço</span>
              </header>

              <main>
                <div>
                  <span>Disparo</span>
                  <span>{formattedPrices.trigger}</span>
                </div>
                <div>
                  <span>Envio</span>
                  <span>{formattedPrices.send}</span>
                </div>
                <div>
                  <span>Limite</span>
                  <span>{formattedPrices.limit}</span>
                </div>
                <div>
                  <span>Executado</span>
                  <span>{formattedPrices.executed}</span>
                </div>
              </main>
            </div>
          </Tooltip>
        )}
      >
        <span>
          R${" "}
          {formatarNumDecimal(
            order.offers[0].precoDisparo || order.offers[0].precoEnvio || 0,
          )}
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default ResumedOrderItem;
