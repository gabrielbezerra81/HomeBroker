import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { Popconfirm } from "antd";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import { mudarAtributoBoletaAction } from "../duck/actions/boletaActions";

export const BotaoEnviarOrdem = ({ props, tipoCompraVenda, namespace }) => {
  const { systemReducer } = useStateStorePrincipal();

  const dispatch = useDispatchBoletas();

  const { accounts, selectedAccount } = systemReducer;
  const variacaoBotao = tipoCompraVenda === "Comprar" ? "primary" : "danger";

  const handleSendOrder = useCallback(() => {
    dispatch(mudarAtributoBoletaAction(0, namespace, "orderId"));
    props.enviarOrdemAction(props, selectedAccount);
  }, [dispatch, namespace, props, selectedAccount]);

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
        <Button variant={variacaoBotao} size="sm">
          <h6>{tipoCompraVenda}</h6>
        </Button>
      </Popconfirm>
    );
  }

  return (
    <div>
      <Button variant={variacaoBotao} size="sm" onClick={handleSendOrder}>
        <h6>{tipoCompraVenda}</h6>
      </Button>
    </div>
  );
};
