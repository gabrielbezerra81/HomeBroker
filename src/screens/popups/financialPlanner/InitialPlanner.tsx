import React, { useState, useMemo, useCallback, useEffect } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  CartesianAxis,
  ReferenceLine,
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
  investment: number;
  rentability: number;
  income: number;
  result: number;
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

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(
      abrirItemBarraLateralAction(
        { isOpenInitialPlanner },
        "isOpenInitialPlanner",
      ),
    );
  }, [dispatch, isOpenInitialPlanner]);

  const handleInputChange = (value: any, event: any) => {
    const { name } = event.target;

    dispatch(
      updateManyFinancialPlannerAction({
        [name]: value,
      }),
    );
  };

  const formattedMonthsProjection = useMemo(() => {
    return monthsProjection.map((monthItem, index) => ({
      ...monthItem,
      period: `Mês ${index + 1}`,
      formattedInvestment: formatarNumDecimal(monthItem.investment, 2),
      formattedRentability: formatarNumDecimal(monthItem.rentability, 2),
      formattedIncome: formatarNumDecimal(monthItem.income, 2),
      formattedResult: formatarNumDecimal(monthItem.result, 2),
    }));
  }, [monthsProjection]);

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
                <h6>Valor mensal:</h6>
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
                  suffix=" %"
                />
                <h6>Rentabilidade mensal?</h6>
              </div>

              <div>
                <h6>Período em:</h6>
                <FormControl as="select" className="darkInputSelect">
                  <option value={10}>10 anos</option>
                </FormControl>{" "}
                <span></span>
              </div>

              <div>
                <h6>Total investido:</h6>
                <h6>R$ 61.000,00</h6>
                <span></span>
              </div>

              <div>
                <h6>Total ganho em juros:</h6>
                <h6>R$ 31.635,44</h6>
                <span></span>
              </div>

              <div>
                <h6>Total</h6>
                <h6>R$ 92.635,44</h6>
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
                    label={{ value: "Mês", fill: "#D2D5D2" }}
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
                  />
                  <Legend
                    iconSize={9}
                    iconType="rect"
                    wrapperStyle={labelStyle}
                  />

                  <Line
                    type="monotone"
                    dataKey="investment"
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
                    dataKey="investment"
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
                    <th>Período</th>
                    <th>Investimento</th>
                    <th>Rentabilidade</th>
                    <th>Rendimento</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedMonthsProjection.map((monthItem) => (
                    <tr key={monthItem.period}>
                      <td>{monthItem.period}</td>
                      <td>{monthItem.formattedInvestment}</td>
                      <td>{monthItem.formattedRentability}% ano</td>
                      <td>{monthItem.formattedIncome}</td>
                      <td>{monthItem.formattedResult}%</td>
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
