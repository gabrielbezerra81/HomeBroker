import React, { useMemo, useCallback } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { Row, Col } from "react-bootstrap";
import WalletEvoTable from "./WalletEvoTable";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

const data = [
  {
    projection: 7000,
    result: 18000,
  },
  {
    projection: 10000,
    result: 4666,
  },
  {
    projection: 13500,
    result: 8166,
  },
  {
    projection: 17000,
    result: 27000,
  },
  {
    projection: 20500,
    result: 30500,
  },
  {
    projection: 10000,
    result: 4666,
  },
  {
    projection: 13500,
    result: 23500,
  },
  {
    projection: 17000,
    result: 27000,
  },
  {
    projection: 6500,
    result: 1166,
  },
  {
    projection: 10000,
    result: 20000,
  },
];

const COLORS = ["#9999CC", "#FF9933"];

const WalletEvolution: React.FC = () => {
  const renderLegend = useCallback((props: any) => {
    const { payload } = props;
    return (
      <>
        <div className="walletEvolutionLegend">
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

  const formattedEvolution = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      period: `Mês ${index + 1}`,
      formattedProjection: formatarNumDecimal(item.projection, 2),
      formattedResult: formatarNumDecimal(item.result, 2),
    }));
  }, []);

  return (
    <div className="walletEvolutionContainer">
      <Row>
        <Col md={5}>EVOLUÇÃO DA CARTEIRA</Col>
        <Col md={2}>COMPARAÇÃO:</Col>
        <Col md={3}>PLANEJAMENTO X RESULTADO</Col>
      </Row>

      <div className="content">
        <WalletEvoTable />

        <ResponsiveContainer className="graphContainer" height={250}>
          <LineChart data={formattedEvolution}>
            <CartesianGrid strokeDasharray="5 5" stroke="#B1B2B1" />
            <XAxis
              label={{
                value: "Mês",
                fill: "#B1B2B1",
                position: "insideBottom",
                offset: -1,
              }}
              dataKey={(item) => {
                return Number(item.period.replace("Mês ", ""));
              }}
              type="number"
              // tickCount={tickCount}
              tick={tickStyle}
              axisLine={axisStyle}
            />
            <YAxis tick={tickStyle} axisLine={axisStyle} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={labelStyle}
              labelFormatter={(label) => "Mês " + label.toString()}
              formatter={(value: any) => formatarNumDecimal(value, 2)}
            />
            <Legend
              content={renderLegend}
              iconSize={14}
              iconType="line"
              wrapperStyle={{
                ...labelStyle,
                bottom: 4,
                left: 40,
                right: 0,
              }}
            />

            <Line
              type="linear"
              dataKey="projection"
              stroke="#9999CC"
              strokeWidth={3}
              name="Projeção"
            />
            <Line
              type="linear"
              dataKey="result"
              stroke="#FF9933"
              strokeWidth={3}
              name="Resultado"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WalletEvolution;

const tickStyle = { fill: "#D2D5D2" };

const axisStyle = { stroke: "#B1B2B1" };

const tooltipContentStyle = {
  backgroundColor: "#333",
  borderColor: "#333",
  borderRadius: 4,
};

const labelStyle = {
  color: "#D2D5D2",
};
