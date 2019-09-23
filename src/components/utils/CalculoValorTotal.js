import { formatarNumDecimal } from "components/utils/Formatacoes";

export const CalculoValorTotalAgendada = (disparo, execucao, qtde) => {
  let total = qtde * execucao;
  let stringValorTotal = "";

  if (qtde !== "") {
    if (execucao === "" && disparo !== "") {
      total = qtde * disparo;
      stringValorTotal = "VALOR APROXIMADO: R$ ";
      return stringValorTotal + formatarNumDecimal(total);
    }
    if (execucao !== "") {
      stringValorTotal = "VALOR TOTAL: R$ ";
      return stringValorTotal + formatarNumDecimal(total);
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

    return "VALOR TOTAL: R$ " + formatarNumDecimal(total);
  }

  return "";
};

export const CalculoValorAproximadoMercado = (qtde, dadosPesquisa) => {
  if (dadosPesquisa && qtde !== "") {
    let { cotacaoAtual } = dadosPesquisa;

    const total = qtde * Number(cotacaoAtual);

    return "VALOR ESTIMADO: R$ " + formatarNumDecimal(total);
  }

  return "";
};
