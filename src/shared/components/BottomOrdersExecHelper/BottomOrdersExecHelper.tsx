import OrdersTable from "./OrdersTable";
import { Order } from "modules/ordersExec/types/ordersExec";
import React from "react";
import { useMemo } from "react";
import { PopupHeader } from "../PopupHeader";

interface Props {
  data: Order[];
  headerTitle?: string;
}

const BottomOrdersExecHelper: React.FC<Props> = ({
  data,
  headerTitle = "HISTÓRICO DE OPERAÇÕES",
}) => {
  const renderedHeader = useMemo(() => {
    return (
      <PopupHeader
        showCloseButton={false}
        headerTitle={headerTitle}
        headerClass="border-green"
        showSearchButton={false}
      />
    );
  }, [headerTitle]);

  const className = useMemo(
    () => `ordens_execucao${data.length ? "" : " hidden"}`,
    [data.length],
  );

  // const ordersWithPosition = useMemo(() => {
  //   return data.map((order) => {
  //     const position = posicoesCustodia.find(
  //       (positionItem) => positionItem.agrupadorPrincipal === order?.group,
  //     );

  //     const offers = order.offers.map((offer) => {
  //       const qttyInPosition = 0;

  //       return { ...offer, qttyInPosition };
  //     });

  //     if (position) {
  //     }

  //     return { ...order, offers };
  //   });
  // }, [data, posicoesCustodia]);

  return (
    <div className={className}>
      <div className="mcontent">
        {renderedHeader}
        <OrdersTable data={data} allowOpenOptions={false} />
      </div>
    </div>
  );
};

export default BottomOrdersExecHelper;
