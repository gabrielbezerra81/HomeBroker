import React from "react";
import { Button } from "react-bootstrap";
import { Popconfirm } from "antd";
import { useSelectorStorePrincipal } from "components/redux/StoreCreation";

export const BotaoEnviarOrdem = ({ props, tipoCompraVenda }) => {
  const state = useSelectorStorePrincipal(
    (state) => state.telaPrincipalReducer
  );
  const { conta, contaSelecionada, token } = state;
  const variacaoBotao = tipoCompraVenda === "Comprar" ? "primary" : "danger";

  if (conta.length > 1) {
    return (
      <Popconfirm
        okText="Sim"
        cancelText="Não"
        onConfirm={() =>
          props.enviarOrdemAction(props, contaSelecionada, token)
        }
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
      <Button
        variant={variacaoBotao}
        size="sm"
        onClick={() => props.enviarOrdemAction(props, contaSelecionada, token)}
      >
        <h6>{tipoCompraVenda}</h6>
      </Button>
    </div>
  );
};
