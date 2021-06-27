import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo } from "react";

import { ProgressBar } from "react-bootstrap";
import areEqual from "shared/utils/areEqual";
import { updateOneOrdersExecStateAction } from "../duck/actions/OrdensExecActions";
import { Order, OrderExecOffer } from "../types/ordersExec";

interface FormattedOrder extends Order {}

interface Props {
  order: FormattedOrder;
  type: "mainOffer" | "nextOffer";
  allowOpenOptions: boolean;
}

const OrderItem: React.FC<Props> = ({ order, type, allowOpenOptions }) => {
  const {
    ordersExecReducer: { ordemAtual: selectedOrder },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const openOrdersOptions = useCallback(() => {
    if (type !== "mainOffer") {
      return;
    }

    if (selectedOrder) {
      if (selectedOrder.id === order.id) {
        dispatch(updateOneOrdersExecStateAction("opcoesOrdemAberto", false));
        dispatch(updateOneOrdersExecStateAction("ordemAtual", null));
      } //
      else {
        dispatch(updateOneOrdersExecStateAction("ordemAtual", order));
        dispatch(updateOneOrdersExecStateAction("opcoesOrdemAberto", true));
      }
    } //
    else {
      dispatch(updateOneOrdersExecStateAction("ordemAtual", order));
      dispatch(updateOneOrdersExecStateAction("opcoesOrdemAberto", true));
    }
  }, [dispatch, order, selectedOrder, type]);

  const renderNestedAttribute = useCallback(
    (attr: string, hasBuySellClass: boolean) => {
      return order.offers.map((offer: any, index2: any) => {
        if (
          offer.modoExec === "ajuste" &&
          ["qtdeOferta", "qtdeExecutada", "precoExecutado"].includes(attr)
        )
          return null;

        let value = offer[attr];

        if (attr.includes("preco")) value = offer.formattedPrices[attr] || "";

        return (
          <span
            key={index2 + attr}
            className={hasBuySellClass ? getOfferClass(offer) : ""}
          >
            {value}
            <br />
          </span>
        );
      });
    },
    [order.offers],
  );

  const orderClassName = useMemo(() => {
    let classe = "";

    if (type === "mainOffer" && allowOpenOptions) {
      classe += " divClicavel rowTabelaOrdensExec ";
    } //
    else {
      classe += " ";
    }

    if (selectedOrder) {
      if (order.id === selectedOrder.id) classe += "ordemSelecionada";
      else classe += " ";
    } else classe += " ";

    return classe;
  }, [allowOpenOptions, order.id, selectedOrder, type]);

  const { qtdeExecutada, qtdeOferta } = useMemo(() => {
    let qtdeOferta = 0;
    let qtdeExecutada = 0;

    order.offers.forEach((oferta) => {
      qtdeOferta += oferta.qtdeOferta;
      qtdeExecutada += oferta.qtdeExecutada;
    });

    return { qtdeOferta, qtdeExecutada };
  }, [order.offers]);

  const orderProgress = useMemo(() => {
    return (qtdeExecutada / qtdeOferta) * 100;
  }, [qtdeExecutada, qtdeOferta]);

  return (
    <tr
      id={order.id.toString()}
      className={orderClassName}
      onClick={allowOpenOptions ? openOrdersOptions : undefined}
    >
      <td>
        <ProgressBar
          animated
          variant="success"
          now={orderProgress}
          label={orderProgress + "%"}
          className="barraProgresso"
        />
      </td>
      <td>
        <span>{order.cadastro}</span>
      </td>
      <td>{order.corretora}</td>
      <td>{order.conta}</td>
      <td>
        {order.operacao}
        <br></br>
        {order.offers[0]?.modoExec}
      </td>
      <td>{renderNestedAttribute("modoExec", false)}</td>
      <td>{renderNestedAttribute("ativo", true)}</td>
      <td>{renderNestedAttribute("oferta", true)}</td>
      <td>{renderNestedAttribute("qtdeOferta", true)}</td>
      <td>{renderNestedAttribute("qtdeExecutada", true)}</td>
      <td>{renderNestedAttribute("qtdeCancelada", true)}</td>
      <td>{order.initialPrice}</td>
      <td>{renderNestedAttribute("precoDisparo", true)}</td>
      <td>
        {order.formName === "Multileg"
          ? (order.offers[0] as any).formattedPrices.precoEnvio
          : renderNestedAttribute("precoEnvio", true)}
      </td>
      <td>{renderNestedAttribute("precoLimite", true)}</td>
      <td>{renderNestedAttribute("precoExecutado", true)}</td>
      <td>{order.validade}</td>
      <td>{order.roteador}</td>
      <td>{renderNestedAttribute("status", false)}</td>

      <td>{renderNestedAttribute("msg", false)}</td>
    </tr>
  );
};

export default React.memo(OrderItem, areEqual);

const getOfferClass = (oferta: OrderExecOffer) => {
  if (oferta.oferta === "V") return "colunasOfertaVenda";
  return "";
};
