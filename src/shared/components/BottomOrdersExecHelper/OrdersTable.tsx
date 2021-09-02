import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { Order } from "modules/ordersExec/types/ordersExec";
import React, { useState, useMemo, useEffect } from "react";
import { Row, Table } from "react-bootstrap";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import OrderItem from "./OrderItem";

interface Props {
  data: Order[];
  allowOpenOptions: boolean;
}

const OrdersTable: React.FC<Props> = ({ data, allowOpenOptions }) => {
  const {
    ordersExecReducer: { ordemAtual: selectedOrder },
  } = useStateStorePrincipal();

  const [, setInitialTop] = useState<number | null>(null);

  // if pages updates with a selected order, gets offset top of order to position order options menu
  useEffect(() => {
    if (selectedOrder) {
      const line = document.getElementById(selectedOrder.id.toString());

      if (line) {
        const { height: lineHeight } = line.getBoundingClientRect();

        setInitialTop(line.offsetTop + 40 + lineHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const top = useMemo(() => {
  //   if (selectedOrder) {
  //     const line = document.getElementById(selectedOrder.id.toString());

  //     if (line) {
  //       const { height: lineHeight } = line.getBoundingClientRect();

  //       setInitialTop(null);

  //       return line.offsetTop + 40 + lineHeight;
  //     }
  //   }

  //   return null;
  // }, [selectedOrder]);

  const formattedOrders = useMemo(() => {
    return data.map((orderItem) => {
      const offers = orderItem.offers.map((offerItem) => {
        const formattedPrices = {};

        ["precoDisparo", "precoEnvio", "precoLimite", "precoExecutado"].forEach(
          (key) => {
            if ((offerItem as any)[key] || (offerItem as any)[key] === 0) {
              (formattedPrices as any)[key] = formatarNumDecimal(
                (offerItem as any)[key],
              );
            }
          },
        );

        return { ...offerItem, formattedPrices };
      });

      return {
        ...orderItem,
        offers,
        initialPrice: formatarNumDecimal(orderItem.initialPrice),
      };
    });
  }, [data]);

  // const shouldDisplayOrdersOptions = useMemo(() => {
  //   return opcoesOrdemAberto && selectedOrder && !!(top || initialTop);
  // }, [initialTop, opcoesOrdemAberto, selectedOrder, top]);

  const renderedOrders = useMemo(() => {
    return formattedOrders.map((orderItem, index) => {
      const ofertaPrincipal = (
        <OrderItem
          allowOpenOptions={allowOpenOptions}
          order={orderItem}
          key={index}
          type="mainOffer"
        />
      );

      const ordensNext = orderItem.nextOrders.map((nextOrder, nextIndex) => (
        <OrderItem
          order={nextOrder as any}
          key={`ON${nextIndex}` as any}
          type="nextOffer"
          allowOpenOptions={false}
        />
      ));

      return (
        <>
          {ofertaPrincipal}

          {ordensNext}
        </>
      );
    });
  }, [allowOpenOptions, formattedOrders]);

  return (
    <div className="bodyOrdensExecucao">
      <Row>
        <Table
          variant="dark"
          bordered={false}
          borderless
          className="tableOrdensExecucao text-center"
          responsive="lg"
        >
          <thead>
            <tr>
              <th>Progresso</th>
              <th>Cadastro</th>
              <th>Corretora</th>
              <th>Conta</th>
              <th>Operação</th>
              <th>Modo Exec</th>
              <th>Ativo</th>
              <th>Oferta</th>
              <th>Qtde Oferta</th>
              <th>Qtde Executada</th>
              <th>Qtde Cancelada</th>
              <th>Preço</th>
              <th>Preço Disparo</th>
              <th>Preço Envio</th>
              <th>Preço Limite</th>
              <th>Preço Executado</th>
              <th>Validade</th>
              <th>Roteador</th>
              <th>St</th>
              <th>Msg</th>
              <th>Posição na carteira</th>
            </tr>
          </thead>
          <tbody className="verticalAlignColunaTabela">{renderedOrders}</tbody>
        </Table>
        {/* {shouldDisplayOrdersOptions && allowOpenOptions && (
          <OpcoesOrdemExec
            style={{
              top: `${top || initialTop}px`,
            }}
            id="opcoes_ordens"
            key={`opcoes${selectedOrder?.id}`}
          />
        )} */}
      </Row>
    </div>
  );
};

export default OrdersTable;
