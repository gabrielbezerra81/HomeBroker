import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

import { FormControl, Table } from "react-bootstrap";
import CustomInput from "shared/componentes/CustomInput";

const data = [
  { name: "Pós-fixados", value: 600 },
  { name: "Prefixados", value: 100 },
  { name: "IPCA+Juros", value: 150 },
  { name: "Renda Variável", value: 200 },
];

const COLORS = ["#9999CC", "#FF9933", "#8AA5C2", "#339999"];

const PlannerProjection: React.FC = () => {
  const [planningData, setPlanningData] = useState<PlanningLine[]>([
    {
      periodValue: "05",
      period: "anos",
      investmentType: "Pós-fixados",
      "100%": "75%",
      rentability: 5.9,
      rentabilityPeriod: "ano",
      monthlyValue: 4425,
      monthlyValuePeriod: "ano",
      income: 4425,
      tax: 4425,
      result: 65.31,
    },
    {
      periodValue: "23",
      period: "meses",
      investmentType: "Prefixados",
      "100%": "10%",
      rentability: 7,
      rentabilityPeriod: "ano",
      monthlyValue: 700,
      monthlyValuePeriod: "ano",
      income: 700,
      tax: 700,
      result: 10.33,
    },
    {
      periodValue: "10",
      period: "anos",
      investmentType: "ICPA+Juros",
      "100%": "10%",
      rentability: 6.5,
      rentabilityPeriod: "ano",
      monthlyValue: 650,
      monthlyValuePeriod: "ano",
      income: 650,
      tax: 650,
      result: 9.59,
    },
    {
      periodValue: "60",
      period: "meses",
      investmentType: "Renda Variável",
      "100%": "5%",
      rentability: 20,
      rentabilityPeriod: "ano",
      monthlyValue: 1000,
      monthlyValuePeriod: "ano",
      income: 1000,
      tax: 1000,
      result: 14.76,
    },
  ]);

  const renderLegend = useCallback((props: any) => {
    const { payload } = props;
    return (
      <>
        <span className="legendTitle">Planejamento</span>

        <div className="customLegendContainer">
          {payload.map((entry: any, index: any) => (
            <div key={`item-${index}`}>
              <span
                style={{ borderColor: COLORS[index % COLORS.length] }}
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

  return (
    <div className="plannerProjection">
      <div className="firstRow">
        <div>
          <div className="inputGroup">
            <span>Investimento: </span>
            <FormControl as="select" className="darkInputSelect">
              <option value="todos">TODOS</option>
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
            <CustomInput
              type="preco"
              name="initialValue"
              step={1}
              renderArrows={false}
              theme="dark"
              onChange={() => {}}
              value={100000}
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
                data={data}
                cx={120}
                cy={48}
                innerRadius={34}
                outerRadius={46}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
            {planningData.map((planningLine, index) => (
              <tr key={index}>
                <td>
                  <div className="cellContent periodCell">
                    <FormControl
                      className="darkSimpleInput"
                      name="periodValue"
                      maxLength={2}
                      placeholder="0"
                    />
                    <FormControl
                      as="select"
                      className="darkInputSelect"
                      name="period"
                    >
                      <option value={"anos"}>anos</option>
                      <option value={"meses"}>meses</option>
                    </FormControl>
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    <FormControl
                      className="darkSimpleInput"
                      name="investmentType"
                      placeholder="Investimento"
                    />
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    <CustomInput
                      type="preco"
                      name="100%"
                      step={0.01}
                      renderArrows={false}
                      theme="dark"
                      suffix="%"
                      onChange={() => {}}
                      value=""
                    />
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    {/* rentabilidade */}
                    <CustomInput
                      type="preco"
                      name="rentability"
                      step={0.01}
                      renderArrows={false}
                      theme="dark"
                      suffix="%"
                      onChange={() => {}}
                      value=""
                    />
                    <FormControl
                      as="select"
                      className="darkInputSelect"
                      name="rentabilityPeriod"
                    >
                      <option value={"ano"}>ano</option>
                      <option value={"mês"}>mês</option>
                    </FormControl>
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    {/* aporte */}
                    <CustomInput
                      type="preco"
                      name="monthlyValue"
                      step={0.01}
                      renderArrows={false}
                      theme="dark"
                      onChange={() => {}}
                      value=""
                    />
                    <FormControl
                      as="select"
                      className="darkInputSelect"
                      name="monthlyValuePeriod"
                    >
                      <option value={"ano"}>ano</option>
                      <option value={"mês"}>mês</option>
                    </FormControl>
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    <CustomInput
                      type="preco"
                      name="income"
                      step={0.01}
                      renderArrows={false}
                      theme="dark"
                      onChange={() => {}}
                      value=""
                    />
                  </div>
                </td>
                <td>
                  <div className="cellContent">
                    <CustomInput
                      type="preco"
                      name="tax"
                      step={0.01}
                      renderArrows={false}
                      theme="dark"
                      onChange={() => {}}
                      value=""
                    />
                  </div>
                </td>
                <td>{planningLine.result}%</td>
              </tr>
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
              <td>6.775,00</td>
              <td>6.775,00</td>
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

interface PlanningLine {
  periodValue: string;
  period: "anos" | "meses";
  investmentType:
    | "Pós-fixados"
    | "Prefixados"
    | "ICPA+Juros"
    | "Renda Variável";
  "100%": string;
  rentability: number;
  rentabilityPeriod: "ano" | "mês";
  monthlyValue: number;
  monthlyValuePeriod: "ano" | "mês";
  income: number;
  tax: number;
  result: number;
}
