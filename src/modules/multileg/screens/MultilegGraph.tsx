import useStateStorePrincipal from "hooks/useStateStorePrincipal";
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
  ReferenceLine,
} from "recharts";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface Props {
  tabIndex: number;
}

interface GraphData {
  result: number;
  price: number;
}

const MultilegGraph: React.FC<Props> = ({ tabIndex }) => {
  const {
    multilegReducer: { multileg },
  } = useStateStorePrincipal();

  const multilegTab = useMemo(() => {
    return multileg[tabIndex];
  }, [multileg, tabIndex]);

  const callOffers = useMemo(() => {
    return multilegTab.tabelaMultileg.filter((offer) => offer.tipo === "call");
  }, [multilegTab.tabelaMultileg]);

  const putOffers = useMemo(() => {
    return multilegTab.tabelaMultileg.filter((offer) => offer.tipo === "put");
  }, [multilegTab.tabelaMultileg]);

  const cost = useMemo(() => {
    const cost = Number(
      multilegTab.preco.split(".").join("").replace(",", "."),
    );

    if (Number.isNaN(cost)) {
      return null;
    }

    return Math.abs(cost);
  }, [multilegTab.preco]);

  const offersStrike = useMemo(() => {
    return multilegTab.tabelaMultileg.map((offer) => offer.strikeSelecionado);
  }, [multilegTab.tabelaMultileg]);

  const pricesRange = useMemo(() => {
    const minStrike = Math.min(...offersStrike);
    const maxStrike = Math.max(...offersStrike);

    const minValueCompare = Math.floor(minStrike * 0.8);
    const maxValueCompare = Math.ceil(maxStrike * 1.2);

    const pricesRange = [];

    for (var i = minValueCompare; i <= maxValueCompare; i++) {
      pricesRange.push(i);
    }

    return pricesRange;
  }, [offersStrike]);

  const data = useMemo(() => {
    const data: GraphData[] = [];

    pricesRange.forEach((price, index) => {
      let result = typeof cost === "number" ? -cost : 0;

      callOffers.forEach((offer) => {
        if (price < offer.strikeSelecionado) {
          return;
        }

        if (Math.floor(offer.strikeSelecionado) !== offer.strikeSelecionado) {
          if (
            price > offer.strikeSelecionado &&
            pricesRange[index - 1] < offer.strikeSelecionado
          ) {
            data.push({
              price: offer.strikeSelecionado,
              result: typeof cost === "number" ? -cost : 0,
            });
          }
        }

        if (cost === null) {
          return;
        }

        const multiplier = offer.cv === "compra" ? 1 : -1;

        const offerResult = offer.qtde * (price - offer.strikeSelecionado);

        result += multiplier * offerResult;
      });

      data.push({ price, result: +Number(result).toFixed(2) });
    });

    // pricesRange.map((price) => ({
    //   price,
    //   result: 0,
    // }));
    return data;
  }, [callOffers, cost, pricesRange]);

  const lastPoint = useMemo(() => {
    if (data.length > 0) {
      return data[data.length - 1];
    }

    return null;
  }, [data]);

  const yAxisDomain = useMemo(() => {
    if (data.length > 0 && lastPoint) {
      const domain: any[] = ["dataMin"];

      if (lastPoint.result >= 0) {
        domain.push("dataMax");
      } //
      else if (typeof cost === "number") {
        domain.push(Math.floor(cost));
      } //
      else {
        domain.push(3);
      }

      return domain;
    }

    return undefined;
  }, [cost, data.length, lastPoint]);

  const yAxisTicks = useMemo(() => {
    const ticks: number[] = [];

    if (typeof cost === "number") {
      ticks.push(-cost);
    }

    data.forEach((point, index) => {
      const previousPoint = data[index - 1];

      if (previousPoint && point.result > 0 && previousPoint.result < 0) {
        ticks.push(0);
      }

      if (!ticks.includes(point.result)) {
        ticks.push(point.result);
      }
    });

    if (!ticks.includes(0)) {
      ticks.push(0);
    }

    return ticks;
  }, [cost, data]);

  const xAxisLabelValue = useMemo(() => {
    if (data.every((item) => item.result === 0)) {
      return "";
    }

    return "0";
  }, [data]);

  if (!data.length) {
    return null;
  }

  return (
    <ResponsiveContainer
      className="multilegGraphContainer"
      width="97%"
      height={250}
    >
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="5 5"
          stroke="#B1B2B1"
          horizontal={false}
        />
        <ReferenceLine
          y={0}
          stroke="#d2d5d2"
          opacity={0.6}
          strokeWidth={2}
          // label={{
          //   value: xAxisLabelValue,
          //   fill: "#d2d5d2",
          //   position: "insideBottomLeft",
          // }}
        />
        <XAxis
          label={{
            value: "Preço",
            fill: "#D2D5D2",
            position: "insideBottom",
            offset: -1,
          }}
          dataKey={(item) => item.price}
          type="number"
          tickCount={pricesRange.length} // 5 a mais e 5 a menos
          tick={tickStyle}
          domain={["dataMin", "dataMax"]}
          axisLine={false}
          tickLine={false}
        />

        {/* {typeof cost === "number" && (
          <ReferenceLine
            y={cost * -1}
            label={{ value: cost * -1, fill: "#d2d5d2", position: "left" }}
          />
        )} */}

        {/* {!!lastPoint && (
          <ReferenceLine
            y={lastPoint.result}
            label={{
              value: formatarNumDecimal(lastPoint.result, 2, 2),
              fill: "#d2d5d2",
              position: "left",
            }}
          />
        )} */}

        <ReferenceLine
          x={18}
          stroke="#d2d5d2"
          opacity={1}
          strokeWidth={1}
          fill="#fff"
          color="#fff"
        />
        <YAxis
          domain={yAxisDomain}
          tick={tickStyle}
          axisLine={false}
          ticks={yAxisTicks}
          minTickGap={-1}
          // scale="sequential"
        />
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelStyle={labelStyle}
          labelFormatter={(label: any) => {
            return ` ${label}`;
          }}
          formatter={(value: any) => formatarNumDecimal(value, 2)}
        />
        {/* <Legend iconSize={9} iconType="rect" wrapperStyle={labelStyle} /> */}

        <Line
          type="linear"
          dataKey="result"
          stroke="#be9117"
          strokeWidth={3}
          dot={{ fill: "#be9117" }}
          name="Lucro"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultilegGraph;

const tickStyle = { fill: "#D2D5D2" };

const axisStyle = { stroke: "#d2d5d2" };

const tooltipContentStyle = {
  backgroundColor: "#333",
  borderColor: "#333",
  borderRadius: 4,
};

const labelStyle = {
  color: "#D2D5D2",
};
