import React from "react";
import moment from "moment";

import { CelulaMes } from "./CelulaMes";
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
  const { THLReducer: thlState } = useStateStorePrincipal();

  const { opcoesStrike, precosTabelaVencimentos } = thlState;

  const bodyContent = strikeList.map((strike, strikeIndex) => {
    const emptyLineWithStrike = (
      <tr key={`strikeLine${strikeIndex}`} className="linhasStrike">
        <td>
          <InputStrikeSelecionado
            strikeLinha={strike}
            indiceStrike={strikeIndex}
          />
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
            renderEmptyColumn({
              month: monthIndex + 1,
              tableData: opcoesStrike,
              year,
            }),
          elementBaseKey: "colunaMesLinhaStrike",
        })}
      </tr>
    );

    const vencimentosStrike = opcoesStrike.filter(
      (linhaVencimentos) => parseInt(linhaVencimentos.strikeLine) === strike
    );

    const linhaVencimentos = vencimentosStrike.map((linha, indiceLinha) => {
      const IDs = linha.structuresIds;
      const idColunaTotal = IDs[IDs.length - 1];
      const precosColunaTotal = precosTabelaVencimentos.find(
        (estrutura) => estrutura.id === idColunaTotal
      );

      let precoTotalMontar = "";
      let precoTotalDesmontar = "";
      let precoMensalMontar = "";
      let precoMensalDesmontar = "";

      if (precosColunaTotal && precosColunaTotal.components.length === 2) {
        let { max, min, components } = precosColunaTotal;

        const [componentA, componentB] = components;

        const qtdeMontar = formatarQuantidadeKMG(
          Math.min(componentA.compraQtde || 0, componentB.vendaQtde || 0)
        );
        const qtdeDesmont = formatarQuantidadeKMG(
          Math.min(componentA.vendaQtde || 0, componentB.compraQtde || 0)
        );

        const primeiroMes = moment(
          componentA.stock.endBusiness,
          "DD-MM-YYYY HH:mm:ss"
        ).startOf("month");
        const ultimoMes = moment(
          componentB.stock.endBusiness,
          "DD-MM-YYYY HH:mm:ss"
        ).startOf("month");

        const diferencaMeses = ultimoMes.diff(primeiroMes, "months");
        const textoMeses = diferencaMeses === 1 ? "mês" : "meses";

        precoMensalMontar = `${formatarNumDecimal(
          max / (diferencaMeses || 1)
        )} | ${diferencaMeses} ${textoMeses}`;
        precoMensalDesmontar = `${formatarNumDecimal(
          min / (diferencaMeses || 1)
        )} | ${diferencaMeses} ${textoMeses}`;

        max = formatarNumDecimal(max);
        min = formatarNumDecimal(min);

        precoTotalMontar = `${max} | ${qtdeMontar}`;
        precoTotalDesmontar = `${min} | ${qtdeDesmont}`;
      }

      return (
        <tr key={`linhaVenc${indiceLinha}`}>
          <td>{formatarNumDecimal(linha.strikeLine)}</td>
          <td>
            <div className="colunaDividida colunaPrecoLinha">
              <div>
                <div className="precoLinhaMontar">{precoTotalMontar}</div>
                <div className="precoLinhaDesmontar">{precoTotalDesmontar}</div>
              </div>
              <div>
                <div className="precoLinhaMontar">{precoMensalMontar}</div>
                <div className="precoLinhaDesmontar">
                  {precoMensalDesmontar}
                </div>
              </div>
            </div>
          </td>

          {/* Colunas dos meses */}
          {RenderDynamicColumnsByYearsAndMonths({
            yearList,
            lastMonthToStop: lastMonth,
            elementToRender: (indiceMes, ano) => {
              const indMes = indiceMes + 1;
              const indiceStock = linha.stocks.findIndex(
                (itemColuna) =>
                  itemColuna.vencimento.month() + 1 === indMes &&
                  itemColuna.vencimento.year() === ano
              );

              if (indiceStock !== -1) {
                const id = IDs[indiceStock];

                return (
                  <CelulaMes
                    id={id}
                    cellData={linha.stocks[indiceStock]}
                    isLastColumn={idColunaTotal === id && indiceStock !== 0}
                  />
                );
              } //
              else {
                const possuiVencimento = checkIfMonthHasContentInAnyLine(
                  opcoesStrike,
                  indMes,
                  ano
                );

                return possuiVencimento ? emptyColumn : null;
              }
            },
            elementBaseKey: "colunaVencimento",
          })}
        </tr>
      );
    });

    return [emptyLineWithStrike, ...linhaVencimentos];
  });

  return bodyContent;
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

const renderEmptyColumn = ({ month, tableData, year }) => {
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
