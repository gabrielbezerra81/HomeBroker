export const CalculoValorTotalAgendada = (disparo, execucao, qtde) => {
  let total = qtde * execucao;
  let stringValorTotal = "VALOR TOTAL: R$ ";
  if (
    execucao === "0.00" ||
    execucao === 0 ||
    execucao === "0" ||
    (execucao === "" && disparo)
  ) {
    total = qtde * disparo;
    stringValorTotal = "VALOR APROXIMADO: R$ ";
  }

  return stringValorTotal + Number(total).toFixed(2);
};

export const CalculoValorTotalLimitada = (preco, qtde) => {
  while (preco.search(",") !== -1) {
    preco = preco.replace(",", "");
  }
  let total = qtde * Number(preco);

  return "VALOR TOTAL: R$ " + Number(total).toFixed(2);
};

export const CalculoValorAproximadoMercado = (qtde, cotacaoAtual) => {
  while (cotacaoAtual.search(",") !== -1) {
    cotacaoAtual = cotacaoAtual.replace(",", ".");
  }
  const total = qtde * Number(cotacaoAtual);

  return "VALOR ESTIMADO: R$" + Number(total).toFixed(2);
};
