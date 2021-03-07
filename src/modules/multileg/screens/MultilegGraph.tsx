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
      const cost = Math.abs(
        Number(multilegTab.preco.split(".").join("").replace(",", ".")),
      );

      let result = Number.isNaN(cost) ? 0 : -cost;

      callOffers.forEach((offer) => {
        if (price < offer.strikeSelecionado) {
          return;
        }

        if (Number.isNaN(cost)) {
          return;
        }

        const multiplier = offer.cv === "compra" ? 1 : -1;

        const offerResult = offer.qtde * (price - offer.strikeSelecionado);

        result += multiplier * offerResult;
      });

      data.push({ price, result });
    });

    // pricesRange.map((price) => ({
    //   price,
    //   result: 0,
    // }));
    return data;
  }, [callOffers, multilegTab.preco, pricesRange]);

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
        <XAxis
          label={{
            value: "Preço",
            fill: "#D2D5D2",
            position: "insideBottom",
            offset: -1,
          }}
          dataKey={(item) => item.price}
          type="number"
          // tickCount={tickCount} // 5 a mais e 5 a menos
          tick={tickStyle}
          axisLine={axisStyle}
        />
        <YAxis tick={tickStyle} axisLine={axisStyle} />
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
          dot={false}
          name="Lucro"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultilegGraph;

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
