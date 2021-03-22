import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo } from "react";

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
import { MultilegOffer } from "../types/multileg";
import { calcularTotal } from "./CalculoPreco";

interface Props {
  tabIndex: number;
}

interface GraphData {
  result: number;
  price: number;
}

const MultilegGraph: React.FC<Props> = ({ tabIndex }) => {
  const {
    multilegReducer: { multileg, cotacoesMultileg },
  } = useStateStorePrincipal();

  const tooltipFormatter = useCallback((value: number) => {
    let formattedName = "Lucro";
    let formattedValue = value;

    if (value < 0) {
      formattedName = "Prejuízo";
      formattedValue = -value;
    }

    formattedValue = formatarNumDecimal(formattedValue, 2);

    return [formattedValue, formattedName];
  }, []);

  const tickFormatter = useCallback((value) => {
    if (value === +Number(value).toFixed(0)) {
      return value;
    }

    return formatarNumDecimal(value, 2, 2);
  }, []);

  const multilegTab = useMemo(() => {
    return multileg[tabIndex];
  }, [multileg, tabIndex]);

  const callOffers = useMemo(() => {
    return multilegTab.tabelaMultileg.filter(
      (offer) =>
        offer.tipo === "call" && offer.ativoAtual !== offer.codigoSelecionado,
    );
  }, [multilegTab.tabelaMultileg]);

  const putOffers = useMemo(() => {
    return multilegTab.tabelaMultileg.filter(
      (offer) =>
        offer.tipo === "put" && offer.ativoAtual !== offer.codigoSelecionado,
    );
  }, [multilegTab.tabelaMultileg]);

  const stockOffers = useMemo(() => {
    return multilegTab.tabelaMultileg
      .filter((offer) => offer.ativoAtual === offer.codigoSelecionado)
      .map((offer) => {
        const symbolQuote = cotacoesMultileg.find(
          (item) => item.codigo === offer.codigoSelecionado,
        );

        return { ...offer, quote: symbolQuote?.valor || 0 };
      });
  }, [cotacoesMultileg, multilegTab.tabelaMultileg]);

  const cost = useMemo(() => {
    const cost = Number(
      multilegTab.preco.split(".").join("").replace(",", "."),
    );

    if (Number.isNaN(cost)) {
      return null;
    }

    return cost;
  }, [multilegTab.preco]);

  const totalCost = useMemo(() => {
    return calcularTotal({
      multileg,
      cotacoesMultileg,
      indice: tabIndex,
    });
  }, [cotacoesMultileg, multileg, tabIndex]);

  const offersStrike = useMemo(() => {
    return multilegTab.tabelaMultileg
      .filter((offer) => offer.ativoAtual !== offer.codigoSelecionado)
      .map((offer) => offer.strikeSelecionado);
  }, [multilegTab.tabelaMultileg]);

  const pricesRange = useMemo(() => {
    const stockOffersPrices = stockOffers.map((offer) => offer.quote);

    const minStrike = Math.min(...offersStrike, ...stockOffersPrices);
    const maxStrike = Math.max(...offersStrike, ...stockOffersPrices);

    const minValueCompare = Math.floor(minStrike * 0.8);
    const maxValueCompare = Math.ceil(maxStrike * 1.2);

    const pricesRange: number[] = [];

    for (var i = minValueCompare; i <= maxValueCompare; i += 1) {
      pricesRange.push(i);
    }

    offersStrike.forEach((strike) => {
      if (!pricesRange.includes(strike)) {
        pricesRange.push(strike);
      }
    });

    if (
      callOffers.length === 0 &&
      putOffers.length === 0 &&
      stockOffers.length === 1
    ) {
      if (typeof cost === "number" && !pricesRange.includes(Math.abs(cost))) {
        pricesRange.push(Math.abs(cost));
      }
    }

    return pricesRange.sort((a, b) => a - b);
  }, [callOffers.length, cost, offersStrike, putOffers.length, stockOffers]);

  const data = useMemo(() => {
    const data: GraphData[] = [];

    pricesRange.forEach((price) => {
      const effectiveCost =
        typeof totalCost === "number" ? Math.abs(totalCost) : 0;
      let result = typeof totalCost === "number" ? -1 * totalCost : 0;

      stockOffers.forEach((offer) => {
        const qttyMultiplier = offer.cv === "compra" ? 1 : -1;
        result += qttyMultiplier * offer.qtde * price;
      });

      callOffers.forEach((offer) => {
        const offerResult = getCallOfferResult({
          offer,
          price,
          cost: effectiveCost,
        });

        result += offerResult;
      });

      putOffers.forEach((offer) => {
        const offerResult = getPutOfferResult({
          offer,
          price,
          cost: effectiveCost,
        });

        result += offerResult;
      });

      data.push({ price, result: +Number(result).toFixed(2) });
    });

    if (
      callOffers.length === 0 &&
      putOffers.length === 0 &&
      stockOffers.length === 1
    ) {
      const hasPointZero = data.some((point) => point.result === 0);

      if (typeof cost === "number" && !hasPointZero) {
        data.push({ price: Math.abs(cost), result: 0 });
      }
    }

    return data;
  }, [callOffers, cost, pricesRange, putOffers, stockOffers, totalCost]);

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

    ticks.sort((a, b) => a - b);

    return ticks;
  }, [cost, data]);

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
          minTickGap={0}
          ticks={pricesRange}
          tickFormatter={tickFormatter}
        />

        {typeof cost === "number" && (
          <ReferenceLine y={-cost} strokeDasharray="5 5" stroke="#B1B2B1" />
        )}

        {!!lastPoint && (
          <ReferenceLine
            y={lastPoint.result}
            strokeDasharray="5 5"
            stroke="#B1B2B1"
          />
        )}

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
            return `${label}`;
          }}
          formatter={tooltipFormatter}
        />
        <Legend iconSize={9} iconType="rect" wrapperStyle={labelStyle} />

        <Line
          type="linear"
          dataKey="result"
          stroke="#be9117"
          strokeWidth={3}
          dot={false} //{ fill: "#be9117" }
          name="Lucro"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultilegGraph;

const tickStyle = { fill: "#D2D5D2" };

const tooltipContentStyle = {
  backgroundColor: "#333",
  borderColor: "#333",
  borderRadius: 4,
};

const labelStyle = {
  color: "#D2D5D2",
};

interface GetOfferResultProps {
  offer: MultilegOffer;
  cost: number;
  price: number;
}

const getCallOfferResult = ({ offer, cost, price }: GetOfferResultProps) => {
  const qttyMultiplier = offer.cv === "compra" ? 1 : -1;

  if (price <= offer.strikeSelecionado) {
    return 0;
  }

  let offerResult =
    qttyMultiplier * offer.qtde * (price - offer.strikeSelecionado);

  return offerResult;
};

const getPutOfferResult = ({ offer, cost, price }: GetOfferResultProps) => {
  const qttyMultiplier = offer.cv === "compra" ? -1 : 1;

  if (price >= offer.strikeSelecionado) {
    return 0;
  }

  let offerResult =
    qttyMultiplier * offer.qtde * (price - offer.strikeSelecionado);

  return offerResult;
};

// se for comprar => book de venda
// se for vender => book de compra
