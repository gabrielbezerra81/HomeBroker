import React, { useMemo } from "react";

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

import { formatarNumDecimal } from "shared/utils/Formatacoes";

import { Projection, FormattedProjection } from "./InitialPlanner";

interface Props {
  data: Array<Projection & FormattedProjection>;
}
const ProjectionGraph: React.FC<Props> = ({ data }) => {
  const tickCount = useMemo(() => {
    let interval = 2;

    if (data.length > 12) {
      interval = 3;
    }

    if (data.length > 24) {
      interval = 4;
    }

    if (data.length >= 48) {
      interval = 8;
    }

    return Math.ceil(data.length / interval);
  }, [data]);

  if (!data.length) {
    return null;
  }

  return (
    <ResponsiveContainer className="graphContainer" width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="5 5"
          stroke="#B1B2B1"
          horizontal={false}
        />
        <XAxis
          label={{
            value: "Mês",
            fill: "#D2D5D2",
            position: "insideBottom",
            offset: -1,
          }}
          dataKey={(item) => item.month}
          type="number"
          tickCount={tickCount}
          tick={tickStyle}
          axisLine={axisStyle}
        />
        <YAxis tick={tickStyle} axisLine={axisStyle} />
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelStyle={labelStyle}
          labelFormatter={(label: any, payload: any) => {
            if (payload && payload.length) {
              const [line1] = payload as any;

              return line1.payload.formattedPeriod;
            }

            return <>{"Mês " + label.toString()}</>;
          }}
          formatter={(value: any) => formatarNumDecimal(value, 2)}
        />
        <Legend iconSize={9} iconType="rect" wrapperStyle={labelStyle} />

        <Line
          type="monotone"
          dataKey="total"
          stroke="#009933"
          strokeWidth={3}
          dot={false}
          name="Dinheiro Acumulado"
        />
        <Line
          type="monotone"
          dataKey="investment"
          stroke="#CC3333"
          strokeWidth={3}
          dot={false}
          name="Dinheiro Investido"
        />
        <Line
          type="monotone"
          dataKey="totalIncome"
          stroke="#FFFF00"
          strokeWidth={3}
          dot={false}
          name="Total em Juros"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProjectionGraph;

const tickStyle = { fill: "#D2D5D2" };

const axisStyle = { stroke: "#D2D5D2" };

const tooltipContentStyle = {
  backgroundColor: "#333",
  borderColor: "#333",
  borderRadius: 4,
};

const labelStyle = {
  color: "#D2D5D2",
};
