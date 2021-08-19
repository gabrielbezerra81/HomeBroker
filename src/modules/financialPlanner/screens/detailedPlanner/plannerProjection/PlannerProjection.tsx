import React, { useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

import { FormControl, Table } from "react-bootstrap";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  calculateProjections,
  calculateSimulationResult,
  convertFrequencyToLocalValues,
} from "../../utils";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import SimulationLine from "./SimulationLine";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  addNewSimulationAction,
  updateDetailedPlannerStateAction,
} from "modules/financialPlanner/duck/actions/detailedPlannerActions";
import { DetailedProjection } from "modules/financialPlanner/types/FinancialPlannerState";
import moment from "moment";
import { Projection } from "../../initialPlanner/InitialPlanner";

const COLORS = [
  "#9999CC",
  "#FF9933",
  "#8AA5C2",
  "#339999",
  "#0254be",
  "#770a72",
  "#0f6d27",
  "#940d0d",
  "#6b6a11",
];

const PlannerProjection: React.FC = () => {
  const {
    financialPlannerReducer: { detailedPlanner },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { simulations, selectedSimulation } = detailedPlanner;

  const simulationResults: DetailedProjection[] = useMemo(() => {
    const filteredSimulations = simulations.filter(
      (sim) =>
        sim.title === selectedSimulation || selectedSimulation === "todos",
    );

    return filteredSimulations.map((simulation) => {
      const [day, month, year] = simulation.startDate.split("/");

      const startDate = new Date(Number(year), Number(month) - 1, Number(day));

      let unitOfTime: moment.unitOfTime.Diff = "months";

      if (simulation.rateFrequency === "semanal") {
        unitOfTime = "weeks";
      } //

      const diff = moment(new Date()).diff(startDate, unitOfTime);

      // marks end date
      const numberOfPeriods = Math.round(diff);

      const projections = calculateProjections({
        startDate,
        numberOfPeriods,
        initialValue: simulation.initialDeposit,
        periodValue: simulation.period,
        interestRate: simulation.rate,
        ratePeriodicity: convertFrequencyToLocalValues(
          simulation.rateFrequency,
        ),
        contribution: simulation.periodicDeposit,
        contributionPeriodicity: convertFrequencyToLocalValues(
          simulation.depositFrequency,
        ),
        periodicity: simulation.periodType,
      });

      const lastProjection = projections[projections.length - 1] as
        | Projection
        | undefined;

      const result = calculateSimulationResult({
        contribution: simulation.periodicDeposit,
        contributionPeriodicity: convertFrequencyToLocalValues(
          simulation.depositFrequency,
        ),
        initialValue: simulation.initialDeposit,
        interestRate: simulation.rate,
        ratePeriodicity: convertFrequencyToLocalValues(
          simulation.rateFrequency,
        ),
        periodValue: simulation.period,
        periodicity: simulation.periodType,
        numberOfPeriods,
      });

      const {
        totalInvested,
        formattedTotalInvested,
        formattedTotalIncome,
        totalIncome,
      } = result;

      const { period: _, ...simulationRest } = simulation;

      const tax = simulation?.tax || 0;

      const realIncome = totalIncome * (1 - tax);
      const realIncomePercentage = lastProjection
        ? (realIncome / lastProjection?.calcBase) * 100
        : 0;

      return {
        ...lastProjection,
        ...simulationRest,
        totalInvested,
        formattedTotalInvested,
        formattedTotal: lastProjection?.total
          ? formatarNumDecimal(lastProjection?.total, 2, 2)
          : "",
        formattedTotalIncome: formattedTotalIncome.replace("R$ ", ""),
        startDate,
        periodValue: simulation.period,
        formattedCalcBase: lastProjection?.calcBase
          ? formatarNumDecimal(lastProjection.calcBase, 2, 2)
          : "",
        timePassed: diff,
        tax,
        formattedTax: simulation?.tax ? simulation?.tax * 100 : 0,
        realIncome,
        formattedRealIncome: formatarNumDecimal(realIncome, 2, 2),
        realIncomePercentage,
        formattedRealIncomePercentage: formatarNumDecimal(
          realIncomePercentage,
          2,
          2,
        ),
      };
    });
  }, [selectedSimulation, simulations]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.currentTarget;

      dispatch(updateDetailedPlannerStateAction({ [name]: value }));
    },
    [dispatch],
  );

  const renderLegend = useCallback((props: any) => {
    const { payload } = props;
    return (
      <>
        <span className="legendTitle">Planejamento</span>

        <div className="customLegendContainer">
          {payload.map((entry: any, index: any) => (
            <div key={`item-${index}`}>
              <span
                style={{ borderColor: COLORS[index] }}
                className="inner-circle"
              />
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      </>
    );
  }, []);

  const handleIncludeLine = useCallback(() => {
    dispatch(addNewSimulationAction());
  }, [dispatch]);

  const handleSimulate = useCallback(() => {}, []);

  const investmentOptions = useMemo(() => {
    return simulations.map((sim) => (
      <option key={sim.title} value={sim.title}>
        {sim.title}
      </option>
    ));
  }, [simulations]);

  const totalInvested = useMemo(() => {
    const total = simulationResults.reduce((prev, curr) => {
      return prev + curr.totalInvested;
    }, 0);

    return total;
  }, [simulationResults]);

  const totalResult = useMemo(() => {
    return simulationResults.reduce((prev, curr) => {
      return prev + (curr?.total || 0);
    }, 0);
  }, [simulationResults]);

  const formattedTotalInvested = useMemo(() => {
    return formatarNumDecimal(totalInvested, 2, 2);
  }, [totalInvested]);

  const formattedTotalResult = useMemo(() => {
    return formatarNumDecimal(totalResult, 2, 2);
  }, [totalResult]);

  const graphData = useMemo(() => {
    return simulationResults.map((res) => ({
      name: res.title,
      value: res.total,
    }));
  }, [simulationResults]);

  return (
    <div className="plannerProjection">
      <div className="firstRow">
        <div>
          <div className="inputGroup">
            <span>Investimento: </span>
            <FormControl
              as="select"
              className="darkInputSelect"
              value={selectedSimulation}
              name="selectedSimulation"
              onChange={handleInputChange}
            >
              <option value="todos">TODOS</option>
              {investmentOptions}
            </FormControl>
          </div>

          <div className="inputGroup">
            <span>Referência: </span>
            <FormControl
              as="select"
              className="darkInputSelect"
              name="reference"
            >
              <option value="atual">Mês atual</option>
            </FormControl>
          </div>

          <div className="inputGroup">
            <span>Total Investido:</span>
            <FormControl
              value={formattedTotalInvested}
              className="darkSimpleInput"
              disabled
            />
          </div>
        </div>

        <div className="graphContainer">
          <ResponsiveContainer
            height={150}
            width="100%"
            className="graphContainer"
          >
            <PieChart>
              <Pie
                data={graphData}
                cx={120}
                cy={48}
                innerRadius={34}
                outerRadius={46}
                paddingAngle={2}
                dataKey="value"
              >
                {graphData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                content={renderLegend}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>

          <h6>PLANEJAMENTO / PROJECÃO</h6>
        </div>
      </div>

      <div>
        <Table className="planningTable" borderless striped={false}>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th className="realTaxHead" colSpan={2}>Taxa real</th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th></th>
              <th>Prazo</th>
              <th>Investimento</th>
              <th>Valor financeiro</th>
              <th>100%</th>
              <th>Rentabilidade</th>
              <th>Aporte</th>
              <th>Rendimento</th>
              <th>Imposto</th>
              <th>%</th>
              <th>Valor</th>
              <th>Acumulado</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {simulationResults.map((simulation, simIndex) => (
              <SimulationLine
                totalResult={totalResult}
                simulation={simulation}
                simIndex={simIndex}
              />
            ))}

            <tr>
              <td colSpan={2}>
                <button
                  className="brokerCustomButton"
                  onClick={handleIncludeLine}
                >
                  + Incluir linha
                </button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>

              <td>Total:</td>

              <td>{formattedTotalResult}</td>
              <td>0,00</td>
              <td></td>
              <td></td>
              <td></td>
              <td>100,00%</td>
            </tr>
          </tbody>
        </Table>

        <button
          className="brokerCustomButton simulationButton"
          onClick={handleSimulate}
        >
          Executar simulação
        </button>
      </div>
    </div>
  );
};

export default PlannerProjection;
