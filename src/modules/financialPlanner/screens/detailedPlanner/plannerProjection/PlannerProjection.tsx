import React, { useCallback, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

import { FormControl, Table } from "react-bootstrap";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  calculateSimulationResult,
  convertFrequencyToLocalValues,
} from "../../utils";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import SimulationLine from "./SimulationLine";
import {
  Simulation,
  SimulationResult,
} from "modules/financialPlanner/types/FinancialPlannerState";

const COLORS = [
  "#9999CC",
  "#FF9933",
  "#8AA5C2",
  "#339999",
  "#0254be",
  "#770a72",
];

const PlannerProjection: React.FC = () => {
  const {
    financialPlannerReducer: { detailedPlanner },
  } = useStateStorePrincipal();

  const { simulations } = detailedPlanner;

  const [addedSimulations, setAddedSimulations] = useState<
    Array<Simulation & SimulationResult>
  >([]);

  const simulationsResult = useMemo(() => {
    return simulations.map((simulation) => {
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
      });

      return {
        ...result,
        ...simulation,
      };
    });
  }, [simulations]);

  const totalInvested = useMemo(() => {
    const total = simulationsResult.reduce((prev, curr) => {
      return prev + curr.totalInvested;
    }, 0);

    return total;
  }, [simulationsResult]);

  const totalResult = useMemo(() => {
    return simulationsResult.reduce((prev, curr) => {
      return prev + curr.total;
    }, 0);
  }, [simulationsResult]);

  const formattedTotalInvested = useMemo(() => {
    return formatarNumDecimal(totalInvested, 2, 2);
  }, [totalInvested]);

  const formattedTotalResult = useMemo(() => {
    return formatarNumDecimal(totalResult, 2, 2);
  }, [totalResult]);

  const graphData = useMemo(() => {
    return simulationsResult.map((res) => ({
      name: res.title,
      value: res.total,
    }));
  }, [simulationsResult]);

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

  const handleIncludeLine = useCallback(() => {}, []);

  const investmentOptions = useMemo(() => {
    return simulations.map((sim) => (
      <option key={sim.title} value={sim.title}>
        {sim.title}
      </option>
    ));
  }, [simulations]);

  return (
    <div className="plannerProjection">
      <div className="firstRow">
        <div>
          <div className="inputGroup">
            <span>Investimento: </span>
            <FormControl as="select" className="darkInputSelect">
              <option value="todos">TODOS</option>
              {investmentOptions}
            </FormControl>
          </div>

          <div className="inputGroup">
            <span>Referência: </span>
            <FormControl as="select" className="darkInputSelect">
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
              <th>Prazo</th>
              <th>Investimento</th>
              <th>100%</th>
              <th>Rentabilidade</th>
              <th>Aporte</th>
              <th>Rendimento</th>
              <th>Imposto</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {simulationsResult.map((simulation) => (
              <SimulationLine
                totalResult={totalResult}
                simulation={simulation}
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
              <td>Total:</td>
              <td>{formattedTotalResult}</td>
              <td>0,00</td>
              <td>100,00%</td>
            </tr>
          </tbody>
        </Table>

        <button className="brokerCustomButton simulationButton">
          Executar simulação
        </button>
      </div>
    </div>
  );
};

export default PlannerProjection;
