import React, { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Popconfirm } from "antd";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import { enviarOrdemAction } from "../duck/actions/boletasAPIActions";
import {
  BoletaNamespace,
  COMPRA_GAINREDUCAO_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE,
} from "constants/ActionTypes";

interface Props {
  namespace: BoletaNamespace;
  orderInfo?: {
    nome: string;
    tipoOrdem: string;
    tipoOferta: "C" | "V";
  };
}

export const BoletaSendOrderButton: React.FC<Props> = ({ orderInfo, namespace }) => {
  const { systemReducer } = useStateStorePrincipal();

  const dispatch = useDispatchBoletas();

  const { accounts, selectedAccount } = systemReducer;

  const handleSendOrder = useCallback(() => {
    dispatch(enviarOrdemAction({ selectedAccount, namespace, orderInfo }));
  }, [dispatch, namespace, orderInfo, selectedAccount]);

  const buttonType = useMemo(() => {
    if (namespace === VENDA_GAINREDUCAO_NAMESPACE) {
      return "danger";
    } //
    else if (namespace === COMPRA_GAINREDUCAO_NAMESPACE) {
      return "primary";
    }

    return orderInfo && orderInfo.tipoOferta === "C" ? "primary" : "danger";
  }, [namespace, orderInfo]);

  const buttonLabel = useMemo(() => {
    if (namespace === VENDA_GAINREDUCAO_NAMESPACE) {
      return "Vender";
    } //
    else if (namespace === COMPRA_GAINREDUCAO_NAMESPACE) {
      return "Comprar";
    }

    return orderInfo && orderInfo.tipoOferta === "C" ? "Comprar" : "Vender";
  }, [namespace, orderInfo]);

  if (accounts.length > 1) {
    return (
      <Popconfirm
        okText="Sim"
        cancelText="Não"
        onConfirm={handleSendOrder}
        title={
          <div style={{ width: "260px" }}>
            Você possui mais de uma conta ativa. Tem certeza que a ordem é para
            esta conta?
          </div>
        }
      >
        <Button variant={buttonType} size="sm">
          <h6>{buttonLabel}</h6>
        </Button>
      </Popconfirm>
    );
  }

  return (
    <div>
      <Button variant={buttonType} size="sm" onClick={handleSendOrder}>
        <h6>{buttonLabel}</h6>
      </Button>
    </div>
  );
};
