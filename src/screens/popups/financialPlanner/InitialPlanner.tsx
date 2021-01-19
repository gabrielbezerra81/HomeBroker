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

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/componentes/DraggablePopup/DraggablePopup";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import CustomInput from "shared/componentes/CustomInput";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
import { FormControl, Table } from "react-bootstrap";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface MonthProjection {
  rentability: number;
  monthIncome: number;
  totalIncome: number;
  result: number;
  total: number;
  calcBase: number;
  investment: number;
  monthPercent: number;
  totalPercent: number;
  [key: string]: any;
}

const InitialPlanner: React.FC = () => {
  const {
    systemReducer: { isOpenInitialPlanner },
    financialPlannerReducer: {
      initialValue,
      mensalValue,
      interestRate,
      period,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const result = useMemo(() => {
    if (!initialValue || !interestRate || !period) {
      return null;
    }

    const monthlyValue = mensalValue || 0;

    const months = period * 12;

    const rate = interestRate / 100;

    const gained = initialValue * (1 + rate) ** months;
    const addedValue = (monthlyValue * ((1 + rate) ** months - 1)) / rate;

    const total = gained + addedValue;
    const totalInvested = initialValue + monthlyValue * months;
    const totalIncome = total - totalInvested;

    console.log(gained);
    console.log(addedValue);

    const res = {
      totalInvested,
      total,
      totalIncome,
      formattedTotal: `R$ ${formatarNumDecimal(gained + addedValue)}`,
      formattedTotalInvested: `R$ ${formatarNumDecimal(totalInvested)}`,
      formattedTotalIncome: `R$ ${formatarNumDecimal(totalIncome, 2)}`,
    };

    return res;
  }, [initialValue, mensalValue, period, interestRate]);

  const projections = useMemo(() => {
    const projections: MonthProjection[] = [];

    if (!initialValue || !interestRate || !period) {
      return [];
    }

    const monthlyValue = mensalValue || 0;

    let investment = initialValue;

    const monthRate = interestRate / 100;

    const months = period * 12;

    let total = initialValue;

    for (let index = 1; index <= months; index++) {
      investment += monthlyValue;

      const calcBase = total + monthlyValue;

      const monthIncome = total * monthRate ** 1;

      const monthPercent = (monthIncome / calcBase) * 100;

      total += total * monthRate ** 1;

      total += monthlyValue;

      const totalIncome = +Number(total - investment).toFixed(2);

      const totalPercent = totalIncome / (investment - initialValue);

      projections.push({
        rentability: interestRate,
        monthIncome,
        totalIncome: totalIncome,
        result: 0,
        total: investment + totalIncome,
        calcBase,
        investment,
        monthPercent,
        totalPercent,
      });
    }

    return projections;
  }, [period, mensalValue, initialValue, interestRate]);

  const onClose = useCallback(() => {
    dispatch(
      abrirItemBarraLateralAction(
        { isOpenInitialPlanner },
        "isOpenInitialPlanner",
      ),
    );
  }, [dispatch, isOpenInitialPlanner]);

  const handleInputChange = useCallback(
    (value: any, event: any) => {
      const { name } = event.target;

      dispatch(
        updateManyFinancialPlannerAction({
          [name]: value,
        }),
      );
    },
    [dispatch],
  );

  const formattedMonthsProjection = useMemo(() => {
    return projections.map((monthItem, index) => ({
      ...monthItem,
      period: `Mês ${index + 1}`,
      formattedInvestment: formatarNumDecimal(monthItem.investment, 2),
      formattedRentability: formatarNumDecimal(monthItem.rentability, 2),
      formattedMonthIncome: formatarNumDecimal(monthItem.monthIncome, 2),
      formattedTotalIncome: formatarNumDecimal(monthItem.totalIncome, 2),
      formattedResult: formatarNumDecimal(monthItem.result, 2),
      formattedTotal: formatarNumDecimal(monthItem.total, 2),
      formattedCalcBase: formatarNumDecimal(monthItem.calcBase, 2),
      formattedMonthPercent: formatarNumDecimal(monthItem.monthPercent, 2),
      formattedTotalPercent: formatarNumDecimal(monthItem.totalPercent, 2),
    }));
  }, [projections]);

  const tickCount = useMemo(() => {
    let interval = 2;

    if (formattedMonthsProjection.length > 12) {
      interval = 3;
    }

    if (formattedMonthsProjection.length > 24) {
      interval = 4;
    }

    if (formattedMonthsProjection.length >= 48) {
      interval = 8;
    }

    return Math.ceil(formattedMonthsProjection.length / interval);
  }, [formattedMonthsProjection.length]);

  return (
    <DraggablePopup
      popupDivKey="initialPlanner"
      popupVisibility={isOpenInitialPlanner}
    >
      <div id="initialPlanner">
        <div className="mcontent">
          <ModalHeaderClean
            titulo="Carregando simulador"
            headerClass="border-green"
            onClose={onClose}
          />

          <div>
            <div className="inputsAndGraphContainer">
              <div>
                <h6>Valor inicial:</h6>
                <CustomInput
                  value={initialValue}
                  type="preco"
                  name="initialValue"
                  step={1}
                  onChange={(v, e) => handleInputChange(v, e)}
                  renderArrows={false}
                  theme="dark"
                />
                <span></span>
              </div>

              <div>
                <h6>Aporte mensal:</h6>
                <CustomInput
                  value={mensalValue}
                  type="preco"
                  name="mensalValue"
                  step={1}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                />
                <h6>Quanto pode investir por mês?</h6>
              </div>

              <div>
                <h6>Taxa de juros:</h6>
                <CustomInput
                  value={interestRate}
                  type="preco"
                  name="interestRate"
                  step={0.01}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                  suffix="%"
                />
                <h6>Rentabilidade mensal?</h6>
              </div>

              <div>
                <h6>Período em:</h6>
                <FormControl
                  as="select"
                  className="darkInputSelect"
                  name="period"
                  onChange={(e) => handleInputChange(Number(e.target.value), e)}
                  value={period}
                >
                  <option value={1}>1 anos</option>
                  <option value={2}>2 anos</option>
                  <option value={5}>5 anos</option>
                  <option value={10}>10 anos</option>
                </FormControl>
                <span></span>
              </div>

              <div>
                <h6>Total investido:</h6>
                <h6>{result?.formattedTotalInvested}</h6>
                <span></span>
              </div>

              <div>
                <h6>Total ganho em juros:</h6>
                <h6>{result?.formattedTotalIncome}</h6>
                <span></span>
              </div>

              <div>
                <h6>Total</h6>
                <h6>{result?.formattedTotal}</h6>
                <span></span>
              </div>

              <ResponsiveContainer
                className="graphContainer"
                width="100%"
                height={250}
              >
                <LineChart data={formattedMonthsProjection}>
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
                    dataKey={(item) => {
                      return Number(item.period.replace("Mês ", ""));
                    }}
                    type="number"
                    tickCount={tickCount}
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
                    iconSize={9}
                    iconType="rect"
                    wrapperStyle={labelStyle}
                  />

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
            </div>

            <div className="projectionContainer">
              <Table borderless striped={false}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={2}>Rendimento no período</th>
                    <th colSpan={2}>Rendimento Total</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Período</th>
                    <th>Aporte</th>
                    <th>Aporte Base de Cálc</th>
                    <th>Rentabilidade</th>
                    <th>Valor</th>
                    <th>%</th>
                    <th>Valor</th>
                    <th>%</th>
                    <th>Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedMonthsProjection.map((monthItem) => (
                    <tr key={monthItem.period}>
                      <td>{monthItem.period}</td>
                      <td>{formatarNumDecimal(mensalValue, 2)}</td>
                      <td>{monthItem.formattedCalcBase}</td>
                      <td>{monthItem.formattedRentability} %</td>
                      <td>{monthItem.formattedMonthIncome}</td>
                      <td>{monthItem.formattedMonthPercent}</td>
                      <td>{monthItem.formattedTotalIncome}</td>
                      <td>{monthItem.formattedTotalPercent}</td>
                      <td>{monthItem.formattedTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default InitialPlanner;

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

/*

  const [monthsProjection, setMonthsProjections] = useState<MonthProjection[]>([
    {
      investment: 75000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 65000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 55000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 45000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 35000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 15000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 5000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 15000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 75000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 85000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 95000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
    {
      investment: 105000,
      rentability: 5.9,
      income: 4425,
      result: 65.31,
    },
  ]);


*/
