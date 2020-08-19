import React from "react";
import moment from "moment";

export const RenderDynamicColumnsByYearsAndMonths = ({
  yearList,
  lastMonthToStop,
  elementToRender,
  elementBaseKey,
}) => {
  const mesAtual = moment().month();

  const months = moment.months();

  return yearList.map((ano, indiceAno) =>
    months.map((mes, indiceMes) => {
      const celula = (
        <td key={`${elementBaseKey}${ano}${mes}`}>
          {elementToRender(indiceMes, ano)}
        </td>
      );

      // Meses anteriores
      const condicaoPrimeiroAno = indiceMes >= mesAtual;
      // Se estiver renderizando no ultimo ano, o mês não pode ser maior que o ultimo mês. Ex: opções do ano 2021 termina em junho
      const condicaoUltimoAno = indiceMes <= lastMonthToStop - 1;

      switch (indiceAno) {
        case 0:
          if (condicaoPrimeiroAno) return celula;
          return null;
        case yearList.length - 1:
          if (condicaoUltimoAno) return celula;
          return null;
        default:
          return celula;
      }
    })
  );
};

export const checkIfMonthHasContentInAnyLine = (
  opcoesStrike,
  mes,
  ano = ""
) => {
  const stocks = [];

  opcoesStrike.forEach((linha) => {
    linha.stocks.forEach((stock) => {
      stocks.push(stock);
    });
  });
  return stocks.some(
    (stock) =>
      stock.vencimento.month() + 1 === mes && stock.vencimento.year() === ano
  );
};
