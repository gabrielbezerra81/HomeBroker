/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import "moment/locale/pt-br";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { listarTabelaInicialTHLAPIAction } from "redux/actions/thl/ThlAPIAction";
import InputStrikeSelecionado from "telas/popups/thl/tabelaDeVencimentos/InputStrikeSelecionado";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import TableBody from "./TableBody";
import {
  RenderDynamicColumnsByYearsAndMonths,
  checkIfMonthHasContentInAnyLine,
} from "./utils";

export default React.memo(() => {
  const { THLReducer: thlState } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();
  const {
    opcoesStrike,
    strikeSelecionado,
    ativoPesquisado,
    tipo,
    codigoCelulaSelecionada,
    celulaCalculada,
  } = thlState;

  const strikesInteiros = useMemo(() => getStrikesInteiros(opcoesStrike), [
    opcoesStrike,
  ]);
  const { anos, ultimoMes } = useMemo(
    () => getAnosUltimoMesTabela(opcoesStrike),
    [opcoesStrike]
  );

  const prevCodigoSelecionado = usePrevious(codigoCelulaSelecionada);
  const prevCalculada = usePrevious(celulaCalculada);

  useEffect(() => {
    dispatch(listarTabelaInicialTHLAPIAction());
  }, []);

  useEffect(() => {
    if (
      prevCodigoSelecionado !== codigoCelulaSelecionada ||
      prevCalculada !== celulaCalculada
    ) {
      if (!codigoCelulaSelecionada && celulaCalculada) {
        dispatch(listarTabelaInicialTHLAPIAction());
      }
    } //
    else {
      dispatch(listarTabelaInicialTHLAPIAction());
    }
  }, [
    ativoPesquisado,
    strikeSelecionado,
    tipo,
    codigoCelulaSelecionada,
    celulaCalculada,
  ]);

  return (
    <Table
      variant="dark"
      className="text-center tabelaVencimentos"
      bordered
      id="tabela"
    >
      <thead>
        <tr>
          <th>Strike</th>
          <th>Preço da linha</th>
          {anos.map((ano, indice) => {
            let colSpan = 12;
            if (indice === 0) colSpan = 12 - moment().month();
            return (
              <th key={`coluna${ano}`} colSpan={colSpan} className="colunaAno">
                <div style={{ paddingLeft: "5px" }}>{ano}</div>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="verticalAlignColunaTabela">
        <tr>
          <td></td>
          <td>
            <div className="colunaDividida colunaPrecoLinha">
              <div>Total</div>
              <div>Mensal</div>
            </div>
          </td>
          {/* renderiza as colunas com os nomes do meses */}
          {RenderDynamicColumnsByYearsAndMonths({
            yearList: anos,
            lastMonthToStop: ultimoMes,
            elementToRender: (monthIndex, year) =>
              renderMonthNameHeaderColumn({
                month: monthIndex + 1,
                tableData: opcoesStrike,
                year: year,
              }),
            elementBaseKey: "colunaNomesMeses",
          })}
        </tr>
        {opcoesStrike.length === 0 ? <OpcoesStrikeVazio /> : null}
        <TableBody
          strikeList={strikesInteiros}
          yearList={anos}
          lastMonth={ultimoMes}
        />
      </tbody>
    </Table>
  );
});

const getStrikesInteiros = (arrayVencimentos) => {
  return [
    ...new Set(
      arrayVencimentos.map((linhaVencimento) =>
        parseInt(linhaVencimento.strikeLine)
      )
    ),
  ];
};

const getAnosUltimoMesTabela = (arrayVencimentos) => {
  const vencimentos = [];
  let ultimoMes = 12;
  let anos = [moment().year()];
  if (arrayVencimentos.length > 0) {
    arrayVencimentos.forEach((linhaStrike) => {
      linhaStrike.stocks.forEach((stock) => {
        const vencimento = stock.vencimento;
        vencimentos.push(vencimento);
      });
    });
    anos = [...new Set(vencimentos.map((vencimento) => vencimento.year()))];
    const meses = vencimentos.filter(
      (vencimento) => vencimento.year() === anos[anos.length - 1]
    );
    meses.sort((a, b) => a.diff(b));
    ultimoMes = meses[meses.length - 1].month() + 1;
  }

  return { anos: anos, ultimoMes: ultimoMes };
};

const renderMonthNameHeaderColumn = ({ month, tableData, year }) => {
  moment.locale("pt-br");
  let monthName = moment.months()[month - 1];

  monthName =
    monthName.charAt(0).toUpperCase() + monthName.substr(1, monthName.length);

  if (!checkIfMonthHasContentInAnyLine(tableData, month, year))
    return monthName;

  return (
    <div style={{ display: "flex", height: "100%", justifyContent: "center" }}>
      <div className="divNomeMes">{monthName}</div>
      <div className="containerPrecoMontDesmont">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const OpcoesStrikeVazio = () => {
  const {
    THLReducer: { opcoesStrike },
  } = useStateStorePrincipal();

  const tableHasContent = !!opcoesStrike.length;

  return (
    <tr>
      <td>
        <InputStrikeSelecionado isTableEmpty={!tableHasContent} />
      </td>
      <td />
    </tr>
  );
};
