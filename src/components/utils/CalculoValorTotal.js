export const CalculoValorTotalAgendada = (disparo, execucao, qtde) => {
  let total = qtde * execucao;
  let stringValorTotal = "";

  if (qtde !== "") {
    if (execucao === "" && disparo !== "") {
      total = qtde * disparo;
      stringValorTotal = "VALOR APROXIMADO: R$ ";
      return stringValorTotal + Number(total).toFixed(2);
    }
    if (execucao !== "") {
      stringValorTotal = "VALOR TOTAL: R$ ";
      return stringValorTotal + Number(total).toFixed(2);
    }
  }

  return "";
};

export const CalculoValorTotalLimitada = (preco, qtde) => {
  if (preco !== "" && qtde !== "") {
    while (preco.search(",") !== -1) {
      preco = preco.replace(",", "");
    }
    let total = qtde * Number(preco);

    return "VALOR TOTAL: R$ " + Number(total).toFixed(2);
  }

  return "";
};

export const CalculoValorAproximadoMercado = (qtde, cotacaoAtual) => {
  if (cotacaoAtual !== "" && qtde !== "") {
    while (cotacaoAtual.search(",") !== -1) {
      cotacaoAtual = cotacaoAtual.replace(",", ".");
    }
    const total = qtde * Number(cotacaoAtual);

    return "VALOR ESTIMADO: R$" + Number(total).toFixed(2);
  }

  return "";
};
