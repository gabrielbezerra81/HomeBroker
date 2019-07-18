export const CalculoValorTotalAgendada = (disparo, execucao, qtde) => {
  let total = qtde * execucao;
  if (
    execucao === "0.00" ||
    execucao === 0 ||
    execucao === "0" ||
    execucao === ""
  ) {
    total = qtde * disparo;
  }
  return Number(total).toFixed(2);
};

export const CalculoValorTotalLimitada = (preco, qtde) => {
  while (preco.search(",") !== -1) {
    preco = preco.replace(",", "");
  }
  let total = qtde * Number(preco);

  return Number(total).toFixed(2);
};
