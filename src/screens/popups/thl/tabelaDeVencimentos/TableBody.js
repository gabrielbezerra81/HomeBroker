import React, { useMemo } from "react";
import moment from "moment";

import { BodyContentCell } from "./BodyContentCell";
import InputStrikeSelecionado from "./InputStrikeSelecionado";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  RenderDynamicColumnsByYearsAndMonths,
  checkIfMonthHasContentInAnyLine,
} from "./utils";

const TableBody = ({ strikeList, yearList, lastMonth }) => {
  const { thlReducer: thlState } = useStateStorePrincipal();

  const { opcoesStrike, precosTabelaVencimentos } = thlState;

  const calculatedDataToRender = useMemo(() => {
    return strikeList.map((strike, strikeIndex) => {
      const linesWithSameBaseStrike = opcoesStrike.filter(
        (line) => parseInt(line.strikeLine) === strike,
      );

      const linesDataToRender = linesWithSameBaseStrike.map(
        (line, lineIndex) => {
          const IDs = line.structuresIds;
          const totalColumnId = IDs[IDs.length - 1];
          const totalColumnPrices = precosTabelaVencimentos.find(
            (structure) => structure.id === totalColumnId,
          );

          let totalMountPrice = "";
          let totalDemountPrice = "";
          let monthMountPrice = "";
          let monthDemountPrice = "";

          if (totalColumnPrices && totalColumnPrices.components.length === 2) {
            let { max, min, components } = totalColumnPrices;

            const [componentA, componentB] = components;

            const mountQtty = formatarQuantidadeKMG(
              Math.min(componentA.compraQtde || 0, componentB.vendaQtde || 0),
            );
            const demountQtty = formatarQuantidadeKMG(
              Math.min(componentA.vendaQtde || 0, componentB.compraQtde || 0),
            );

            const componentAMonth = moment(
              componentA.stock.endBusiness,
              "DD-MM-YYYY HH:mm:ss",
            ).startOf("month");
            const componentBMonth = moment(
              componentB.stock.endBusiness,
              "DD-MM-YYYY HH:mm:ss",
            ).startOf("month");

            const monthDiffBetweenComponents = componentBMonth.diff(
              componentAMonth,
              "months",
            );
            const monthText =
              monthDiffBetweenComponents === 1 ? "mês" : "meses";

            const mountPrice = formatarNumDecimal(
              max / (monthDiffBetweenComponents || 1),
            );
            monthMountPrice = `${mountPrice} | ${monthDiffBetweenComponents} ${monthText}`;

            const demountPrice = formatarNumDecimal(
              min / (monthDiffBetweenComponents || 1),
            );
            monthDemountPrice = `${demountPrice} | ${monthDiffBetweenComponents} ${monthText}`;

            max = formatarNumDecimal(max);
            min = formatarNumDecimal(min);

            totalMountPrice = `${max} | ${mountQtty}`;
            totalDemountPrice = `${min} | ${demountQtty}`;
          }

          const lineData = {
            formattedStrike: formatarNumDecimal(line.strikeLine),
            totalMountPrice,
            totalDemountPrice,
            monthMountPrice,
            monthDemountPrice,
            totalColumnId,
            structureIds: IDs,
            stocks: line.stocks,
          };

          return lineData;
        },
      );

      return { strike, linesData: linesDataToRender };
    });
  }, [strikeList, opcoesStrike, precosTabelaVencimentos]);

  return calculatedDataToRender.map((data, index) => {
    const { strike, linesData } = data;

    const emptyLineWithIntegerStrike = (
      <tr key={`strikeLine${index}`} className="linhasStrike">
        <td>
          <InputStrikeSelecionado strikeLinha={strike} indiceStrike={index} />
        </td>
        <td>
          <div className="colunaDividida colunaPrecoLinha">
            <div></div>
            <div></div>
          </div>
        </td>
        {/* renderiza as colunas vazias na linha que contem o strike inteiro */}
        {RenderDynamicColumnsByYearsAndMonths({
          yearList,
          lastMonthToStop: lastMonth,
          elementToRender: (monthIndex, year) =>
            renderManyEmptyColumns({
              month: monthIndex + 1,
              tableData: opcoesStrike,
              year,
            }),
          elementBaseKey: "colunaMesLinhaStrike",
        })}
      </tr>
    );

    const tableLinesWithContent = linesData.map((lineData, lineIndex) => {
      return (
        <tr key={`linhaVenc${lineIndex}`}>
          <td>{lineData.formattedStrike}</td>
          <td>
            <div className="colunaDividida colunaPrecoLinha">
              <div>
                <div className="precoLinhaMontar">
                  {lineData.totalMountPrice}
                </div>
                <div className="precoLinhaDesmontar">
                  {lineData.totalDemountPrice}
                </div>
              </div>
              <div>
                <div className="precoLinhaMontar">
                  {lineData.monthMountPrice}
                </div>
                <div className="precoLinhaDesmontar">
                  {lineData.monthDemountPrice}
                </div>
              </div>
            </div>
          </td>
          {/* Colunas dos meses */}
          {RenderDynamicColumnsByYearsAndMonths({
            yearList,
            lastMonthToStop: lastMonth,
            elementBaseKey: "colunaVencimento",
            elementToRender: (monthIndex, year) => {
              const monthNumber = monthIndex + 1;
              const stockIndex = lineData.stocks.findIndex(
                (itemColuna) =>
                  itemColuna.vencimento.month() + 1 === monthNumber &&
                  itemColuna.vencimento.year() === year,
              );

              if (stockIndex !== -1) {
                const structureId = lineData.structureIds[stockIndex];

                return (
                  <BodyContentCell
                    id={structureId}
                    cellData={lineData.stocks[stockIndex]}
                    isLastColumn={
                      lineData.totalColumnId === structureId && stockIndex !== 0
                    }
                  />
                );
              } //
              else {
                const monthHasContentInAnyLine = checkIfMonthHasContentInAnyLine(
                  opcoesStrike,
                  monthNumber,
                  year,
                );

                return monthHasContentInAnyLine ? emptyColumn : null;
              }
            },
          })}
        </tr>
      );
    });

    return [emptyLineWithIntegerStrike, ...tableLinesWithContent];
  });
};

export default TableBody;

const emptyColumn = (
  <div className="containerColunaMes">
    <div className="containerCelula">
      <div>
        <div className="itemAtivosQtde"></div>
      </div>
    </div>
    <div className="containerPrecoMontDesmont">
      <div></div>
      <div></div>
    </div>
  </div>
);

const renderManyEmptyColumns = ({ month, tableData, year }) => {
  if (!checkIfMonthHasContentInAnyLine(tableData, month, year)) return null;

  return (
    <div style={{ display: "flex", height: "100%", justifyContent: "center" }}>
      <div className="divNomeMes"></div>
      <div className="containerPrecoMontDesmont">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
