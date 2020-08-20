import React from "react";
import moment from "moment";

export const RenderDynamicColumnsByYearsAndMonths = ({
  yearList,
  lastMonthToStop,
  elementToRender,
  elementBaseKey,
}) => {
  const currentMonth = moment().month();

  const months = moment.months();

  return yearList.map((year, yearIndex) =>
    months.map((month, monthIndex) => {
      const renderedCell = (
        <td key={`${elementBaseKey}${year}${month}`}>
          {elementToRender(monthIndex, year)}
        </td>
      );

      // Não pode mostrar celulas de meses passados
      const shouldRenderInFirstYear = monthIndex >= currentMonth;
      // Se estiver renderizando no ultimo ano, o mês não pode ser maior que o ultimo mês que tem vencimentos. Ex: opções do ano 2021 termina em junho, logo
      // não deve ter celulas preenchidas em julho, agosto, etc.
      const shouldRenderInLastYear = monthIndex <= lastMonthToStop - 1;

      switch (yearIndex) {
        case 0:
          if (shouldRenderInFirstYear) return renderedCell;
          return null;
        case yearList.length - 1:
          if (shouldRenderInLastYear) return renderedCell;
          return null;
        default:
          return renderedCell;
      }
    })
  );
};

export const checkIfMonthHasContentInAnyLine = (
  strikeOptions,
  month,
  year = ""
) => {
  const stocks = [];

  strikeOptions.forEach((linha) => {
    linha.stocks.forEach((stock) => {
      stocks.push(stock);
    });
  });
  return stocks.some(
    (stock) =>
      stock.vencimento.month() + 1 === month && stock.vencimento.year() === year
  );
};
