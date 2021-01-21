import React, { useMemo, useCallback } from "react";

import moment from "moment";
import "moment/locale/pt-br";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/componentes/DraggablePopup/DraggablePopup";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import CustomInput from "shared/componentes/CustomInput";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
import { FormControl } from "react-bootstrap";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import ProjectionTable from "./ProjectionTable";
import ProjectionGraph from "./ProjectionGraph";

export interface MonthProjection {
  rentability: number;
  monthIncome: number;
  totalIncome: number;
  result: number;
  total: number;
  calcBase: number;
  investment: number;
  totalPercent: number;
  period: Date;
  [key: string]: any;
}

export interface FormattedProjection {
  formattedInvestment: string;
  formattedRentability: string;
  formattedMonthIncome: string;
  formattedTotalIncome: string;
  formattedResult: string;
  formattedTotal: string;
  formattedCalcBase: string;
  formattedTotalPercent: string;
  formattedPeriod: string;
  month: number;
}

const InitialPlanner: React.FC = () => {
  const {
    systemReducer: { isOpenInitialPlanner },
    financialPlannerReducer: { initialPlanner },
  } = useStateStorePrincipal();

  const {
    initialValue,
    contribution,
    contributionPeriodicity,
    interestRate,
    ratePeriodicity,
    periodValue,
    periodicity,
    listing,
  } = initialPlanner;

  const dispatch = useDispatchStorePrincipal();

  const result = useMemo(() => {
    if (!initialValue || !interestRate || !periodValue) {
      return null;
    }

    const monthlyValue = contribution || 0;

    const months = periodValue * 12;

    const rate = interestRate / 100;

    const gained = initialValue * (1 + rate) ** months;
    const addedValue = (monthlyValue * ((1 + rate) ** (months - 1) - 1)) / rate;

    const total = gained + addedValue;
    const totalInvested = initialValue + monthlyValue * (months - 1);
    const totalIncome = total - totalInvested;

    const res = {
      totalInvested,
      total,
      totalIncome,
      formattedTotal: `R$ ${formatarNumDecimal(gained + addedValue)}`,
      formattedTotalInvested: `R$ ${formatarNumDecimal(totalInvested)}`,
      formattedTotalIncome: `R$ ${formatarNumDecimal(totalIncome, 2)}`,
    };

    return res;
  }, [initialValue, contribution, periodValue, interestRate]);

  const projections = useMemo(() => {
    const projections: MonthProjection[] = [];

    if (!initialValue || !interestRate || !periodValue) {
      return [];
    }

    const monthlyValue = contribution || 0;

    let investment = initialValue;

    const monthRate = interestRate / 100;

    let months = periodValue;

    if (periodicity === "anos") {
      months *= 12;
    }

    let total = initialValue;

    for (let index = 1; index <= months; index++) {
      const date = new Date();

      date.setMonth(index - 1);

      let calcBase = total;

      const monthIncome = total * monthRate ** 1;

      // const monthPercent = (monthIncome / calcBase) * 100;

      total += monthIncome;

      if (index > 1) {
        calcBase += monthlyValue;
        total += monthlyValue;
        investment += monthlyValue;
      }

      const totalIncome = +Number(total - investment).toFixed(2);

      const totalPercent = (totalIncome / investment) * 100;

      const projection = {
        rentability: interestRate,
        monthIncome,
        totalIncome: totalIncome,
        result: 0,
        total: investment + totalIncome,
        calcBase,
        investment,
        totalPercent,
        period: date,
      };

      // if (periodicity === "anos") {
      //   if (index % 12 === 0) {
      //     projections.push(projection);
      //   }
      // } //
      projections.push(projection);
    }

    return projections;
  }, [initialValue, interestRate, periodValue, contribution, periodicity]);

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
          initialPlanner: { ...initialPlanner, [name]: value },
        }),
      );
    },
    [dispatch, initialPlanner],
  );

  const formattedMonthsProjection = useMemo(() => {
    let filtered = projections;

    if (listing === "anual") {
      filtered = filtered.filter(
        (_, index) => index + 1 !== 0 && (index + 1) % 12 === 0,
      );
    } //
    else if (listing === "semanal") {
    }

    return filtered.map((monthItem, index) => {
      let formattedPeriod = moment(monthItem.period).format("MMM/YYYY");

      formattedPeriod =
        formattedPeriod.substr(0, 1).toUpperCase() + formattedPeriod.substr(1);

      return {
        ...monthItem,
        formattedInvestment: formatarNumDecimal(monthItem.investment, 2),
        formattedRentability: formatarNumDecimal(monthItem.rentability, 2),
        formattedMonthIncome: formatarNumDecimal(monthItem.monthIncome, 2),
        formattedTotalIncome: formatarNumDecimal(monthItem.totalIncome, 2),
        formattedResult: formatarNumDecimal(monthItem.result, 2),
        formattedTotal: formatarNumDecimal(monthItem.total, 2),
        formattedCalcBase: formatarNumDecimal(monthItem.calcBase, 2),
        formattedTotalPercent: formatarNumDecimal(monthItem.totalPercent, 2),
        formattedPeriod,
        month: index + 1,
      };
    });
  }, [listing, projections]);

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
              <div className="simulatorRow">
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

              <div className="simulatorRow">
                <h6>Aporte mensal:</h6>
                <CustomInput
                  value={contribution}
                  type="preco"
                  name="contribution"
                  step={1}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                />
                <FormControl
                  as="select"
                  className="darkInputSelect"
                  name="contributionPeriodicity"
                  onChange={(e) => handleInputChange(e.target.value, e)}
                  value={contributionPeriodicity}
                >
                  <option value={"por semana"}>por semana</option>
                  <option value={"por mês"}>por mês</option>
                  <option value={"por ano"}>por ano</option>
                </FormControl>
                {/* <h6>Quanto pode investir por mês?</h6> */}
              </div>

              <div className="simulatorRow">
                <h6>Taxa de juros:</h6>
                <CustomInput
                  containerClassName="interestRateInput"
                  value={interestRate}
                  type="preco"
                  name="interestRate"
                  step={0.01}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                  suffix="%"
                  suffixStyle={{ color: "#FF9A2C", right: 8 }}
                />
                <FormControl
                  as="select"
                  className="darkInputSelect"
                  name="ratePeriodicity"
                  onChange={(e) => handleInputChange(e.target.value, e)}
                  value={ratePeriodicity}
                >
                  <option value={"por semana"}>por semana</option>
                  <option value={"por mês"}>por mês</option>
                  <option value={"por ano"}>por ano</option>
                </FormControl>
                {/* <h6>Rentabilidade mensal?</h6> */}
              </div>

              <div className="simulatorRow">
                <h6>Período em:</h6>
                <FormControl
                  className="darkSimpleInput"
                  name="periodValue"
                  onChange={(e) => handleInputChange(Number(e.target.value), e)}
                  value={periodValue}
                />
                <FormControl
                  as="select"
                  className="darkInputSelect"
                  name="periodicity"
                  onChange={(e) => handleInputChange(e.target.value, e)}
                  value={periodicity}
                >
                  <option value={"semanas"}>semana(s)</option>
                  <option value={"meses"}>mês(es)</option>
                  <option value={"anos"}>ano(s)</option>
                </FormControl>
                {/* <span></span> */}
              </div>

              <div className="simulatorRow">
                <h6>Total investido:</h6>
                <h6>{result?.formattedTotalInvested}</h6>
                <span></span>
              </div>

              <div className="simulatorRow">
                <h6>Total ganho em juros:</h6>
                <h6>{result?.formattedTotalIncome}</h6>
                <span></span>
              </div>

              <div className="simulatorRow">
                <h6 className="totalValueText">Total:</h6>
                <h6>{result?.formattedTotal}</h6>
                <span></span>
              </div>

              <ProjectionGraph data={formattedMonthsProjection} />
            </div>

            <ProjectionTable data={formattedMonthsProjection} />
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default InitialPlanner;
