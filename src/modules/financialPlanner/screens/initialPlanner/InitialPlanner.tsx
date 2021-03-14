import React, { useMemo, useCallback, useState } from "react";

import moment from "moment";
import "moment/locale/pt-br";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/components/DraggablePopup/DraggablePopup";
import { PopupHeader } from "shared/components/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import CustomInput from "shared/components/CustomInput";
import {
  handleSaveSimulationAction,
  updateInitialPlannerStateAction,
} from "modules/financialPlanner/duck/actions/financialPlannerActions";
import { FormControl } from "react-bootstrap";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import ProjectionTable from "./ProjectionTable";
import ProjectionGraph from "./ProjectionGraph";
import {
  convertContribution,
  convertInterestRate,
  convertPeriodByRatePeriodicity,
  filterWeeklyProjections,
  IncludeInitialLine,
} from "../utils";

import "../../styles/initialPlanner/initialPlanner.scss";
import CustomButton from "shared/components/CustomButton";
import RateConverter from "./RateConverter";
import { InitialPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { toast } from "react-toastify";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";

export interface Projection {
  rentability: number;
  periodIncome: number;
  totalIncome: number;
  result: number;
  total: number;
  calcBase: number;
  investment: number;
  totalPercent: number;
  period: Date;
  contribution: number;
  [key: string]: any;
}

export interface FormattedProjection {
  formattedInvestment: string;
  formattedRentability: string;
  formattedPeriodIncome: string;
  formattedTotalIncome: string;
  formattedResult: string;
  formattedTotal: string;
  formattedCalcBase: string;
  formattedTotalPercent: string;
  formattedPeriod: string;
  month: number;
  formattedContribution: string;
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

  const [savingSimulations, setSavingSimulations] = useState(false);
  const [converterVisibility, setConverterVisibility] = useState(false);

  const [simulationTitle, setSimulationTitle] = useState("");

  const result = useMemo(() => {
    if (!initialValue || !interestRate || !periodValue) {
      return null;
    }

    const monthlyValue = convertContribution({
      contribution,
      contributionPeriodicity,
      ratePeriodicity,
      convertMode: "calculate",
    });

    let periods = convertPeriodByRatePeriodicity({
      periodValue,
      periodicity,
      ratePeriodicity,
    });

    let excludedPeriodsFromContrib = 1;

    let rate = interestRate / 100;

    // conversão de anual para mensal
    if (ratePeriodicity === "por ano") {
      rate = convertInterestRate(rate, "year", "month");
    }

    if (ratePeriodicity === "por semana") {
      excludedPeriodsFromContrib = 1;
    }

    const gained = initialValue * (1 + rate) ** periods;
    const addedValue =
      (monthlyValue *
        ((1 + rate) ** (periods - excludedPeriodsFromContrib) - 1)) /
      rate;

    const total = gained + addedValue;
    const totalInvested =
      initialValue + monthlyValue * (periods - excludedPeriodsFromContrib);
    const totalIncome = total - totalInvested;

    const res = {
      totalInvested,
      total,
      totalIncome,
      formattedTotal: `R$ ${formatarNumDecimal(gained + addedValue, 2)}`,
      formattedTotalInvested: `R$ ${formatarNumDecimal(totalInvested)}`,
      formattedTotalIncome: `R$ ${formatarNumDecimal(totalIncome, 2)}`,
    };

    return res;
  }, [
    initialValue,
    interestRate,
    periodValue,
    contribution,
    contributionPeriodicity,
    ratePeriodicity,
    periodicity,
  ]);

  const projections = useMemo(() => {
    const projections: Projection[] = [];

    if (!initialValue || !interestRate || !periodValue) {
      return [];
    }

    const monthlyValue = convertContribution({
      contribution,
      contributionPeriodicity,
      ratePeriodicity,
      convertMode: "calculate",
    });

    let investment = initialValue;

    let monthRate = interestRate / 100;

    if (ratePeriodicity === "por ano") {
      monthRate = convertInterestRate(monthRate, "year", "month");
    }

    let periods = convertPeriodByRatePeriodicity({
      periodValue,
      periodicity,
      ratePeriodicity,
    });

    console.log(periods);

    let excludedPeriodsFromContrib = 1;

    if (ratePeriodicity === "por semana") {
      excludedPeriodsFromContrib = 1;
    }

    let total = initialValue;

    let date = moment(new Date()).startOf("month").startOf("day").toDate();

    if (ratePeriodicity !== "por semana") {
      date = moment(date).endOf("month").toDate();
    }

    for (let index = 1; index <= periods; index++) {
      let calcBase = total;

      const periodIncome = total * monthRate ** 1;

      // const monthPercent = (monthIncome / calcBase) * 100;

      total += periodIncome;

      if (index > excludedPeriodsFromContrib) {
        calcBase += monthlyValue;
        total += monthlyValue;
        investment += monthlyValue;
      }

      const totalIncome = +Number(total - investment).toFixed(2);

      const totalPercent = (totalIncome / investment) * 100;

      let period = new Date(date);

      if (ratePeriodicity === "por semana") {
        period.setDate(period.getDate() + 6); // A data é o final da semana
        date.setDate(date.getDate() + 7);
      }

      if (["por mês", "por ano"].includes(ratePeriodicity)) {
        date.setMonth(date.getMonth() + 1);
      }

      const projection = {
        rentability: interestRate,
        periodIncome,
        totalIncome: totalIncome,
        result: 0,
        total: investment + totalIncome,
        calcBase,
        investment,
        totalPercent,
        period,
        contribution: monthlyValue,
      };

      projections.push(projection);
    }

    return projections;
  }, [
    initialValue,
    interestRate,
    periodValue,
    contribution,
    contributionPeriodicity,
    ratePeriodicity,
    periodicity,
  ]);

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenInitialPlanner"));
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value: any, event: any) => {
      const { name } = event.target;

      const payload: Partial<InitialPlannerData> = { [name]: value };

      if (name === "ratePeriodicity" && ratePeriodicity === "por semana") {
        payload.listing = "mensal";
        payload.periodicity = "meses";
      }

      if (name === "contributionPeriodicity") {
        payload.ratePeriodicity = value;

        toast.info(
          "Ao mudar a frequência do aporte também será modificada a frequência dos juros. Ambas devem ser iguais.",
          {
            autoClose: 9000,
          },
        );
      }

      if (name === "ratePeriodicity") {
        payload.contributionPeriodicity = value;

        toast.info(
          "Ao mudar a frequência dos juros também será modificada a frequência do aporte. Ambas devem ser iguais.",
          { autoClose: 9000 },
        );
      }

      dispatch(updateInitialPlannerStateAction(payload));
    },
    [dispatch, ratePeriodicity],
  );

  const handleOpenRateConverter = useCallback(() => {
    setConverterVisibility((oldValue) => !oldValue);
  }, []);

  const handleSaveSimulation = useCallback(async () => {
    setSavingSimulations(true);

    await dispatch(handleSaveSimulationAction(simulationTitle));

    setSimulationTitle("");
 

    setSavingSimulations(false);
  }, [dispatch, simulationTitle]);

  const initialLine = IncludeInitialLine();

  const formattedProjections = useMemo(() => {
    let filtered = projections;

    if (
      listing === "anual" &&
      ["por mês", "por ano"].includes(ratePeriodicity)
    ) {
      filtered = filtered.filter((_, index) => {
        const hasFullYear = (index + 1) % 12 === 0;

        if (!hasFullYear && index + 1 === filtered.length) {
          return true;
        }

        return hasFullYear;
      });
    } //
    else if (ratePeriodicity === "por semana" && listing !== "semanal") {
      filtered = filterWeeklyProjections(filtered, listing);
    }

    const formatted = filtered.map((projectionItem, index) => {
      let formattedPeriod = moment(projectionItem.period).format("DD/MM/YYYY");

      formattedPeriod =
        formattedPeriod.substr(0, 1).toUpperCase() + formattedPeriod.substr(1);

      if (listing === "semanal") {
        formattedPeriod = `Semana ${index + 1}`;
      }

      return {
        ...projectionItem,
        formattedInvestment: formatarNumDecimal(projectionItem.investment, 2),
        formattedRentability: formatarNumDecimal(projectionItem.rentability, 2),
        formattedPeriodIncome: formatarNumDecimal(
          projectionItem.periodIncome,
          2,
        ),
        formattedTotalIncome: formatarNumDecimal(projectionItem.totalIncome, 2),
        formattedResult: formatarNumDecimal(projectionItem.result, 2),
        formattedTotal: formatarNumDecimal(projectionItem.total, 2),
        formattedCalcBase: formatarNumDecimal(projectionItem.calcBase, 2),
        formattedTotalPercent: formatarNumDecimal(
          projectionItem.totalPercent,
          2,
        ),
        formattedPeriod,
        formattedContribution: formatarNumDecimal(projectionItem.contribution),
        month: index + 1,
      };
    });

    const shouldAddLine0OnWeekly =
      ratePeriodicity === "por semana" &&
      (listing === "mensal" || listing === "anual");

    const shouldAddLine0OnMonthly =
      ratePeriodicity === "por mês" && listing === "anual";

    const shouldAddLine0OnYearly =
      ratePeriodicity === "por ano" && listing === "anual";

    if (
      shouldAddLine0OnWeekly ||
      shouldAddLine0OnMonthly ||
      shouldAddLine0OnYearly
    ) {
      formatted.unshift(initialLine);
    }

    return formatted;
  }, [initialLine, listing, projections, ratePeriodicity]);

  const periodOptions = useMemo(() => {
    const options = [];

    if (ratePeriodicity === "por semana") {
      options.push(
        <option key="semanas" value={"semanas"}>
          semana(s)
        </option>,
      );
    }

    options.push(
      <option key="meses" value={"meses"}>
        mês(es)
      </option>,
      <option key="anos" value={"anos"}>
        ano(s)
      </option>,
    );

    return options;
  }, [ratePeriodicity]);

  return (
    <DraggablePopup
      popupDivKey="initialPlanner"
      popupVisibility={isOpenInitialPlanner}
      handleDragClass=".initialPlannerHeader"
    >
      <div id="initialPlanner">
        <div className="mcontent">
          <PopupHeader
            headerTitle="Carregando simulador"
            onClose={onClose}
            headerClass="initialPlannerHeader"
          />

          <div>
            <div className="inputsAndGraphContainer">
              <RateConverter
                visibility={converterVisibility}
                setVisibility={setConverterVisibility}
              />
              <div className="simulatorRow">
                <h6>Aporte inicial:</h6>
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
                <h6>Aporte:</h6>
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
                <h6>Prazo:</h6>
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
                  {periodOptions}
                </FormControl>
                {/* <span></span> */}
                <button
                  className="brokerCustomButton openConverterButton"
                  onClick={handleOpenRateConverter}
                >
                  Converter taxas de juros
                </button>
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
                <PopConfirm
                  className="saveSimulationPopConfirm"
                  title="Salvar simulação"
                  onConfirm={handleSaveSimulation}
                  message="Título"
                  cancelText="Cancelar"
                  confirmText="Confirmar"
                  cancelButtonStyle={{ variant: "secondary" }}
                  content={
                    <FormControl
                      onChange={(e) => setSimulationTitle(e.target.value)}
                      value={simulationTitle}
                    />
                  }
                >
                  <CustomButton
                    loading={savingSimulations}
                    className="brokerCustomButton saveSimulationButton"
                  >
                    Salvar Simulação
                  </CustomButton>
                </PopConfirm>
              </div>

              <ProjectionGraph data={formattedProjections} />
            </div>

            <ProjectionTable data={formattedProjections} />
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default InitialPlanner;

/*


  {
                    rentability: 0,
                    periodIncome: 0,
                    totalIncome: 0,
                    result: 0,
                    total: 1000,
                    calcBase: 1000,
                    investment: 1000,
                    totalPercent: 0,
                    period: new Date(),
                    contribution: 100,
                    formattedContribution: "100",
                    viewedContribution: "1000",
                    formattedCalcBase: "1000",
                    formattedInvestment: "1000",
                    formattedPeriod: new Date(2020, 1, 1).toLocaleDateString(),
                    formattedPeriodIncome: "0",
                    formattedRentability: "0",
                    formattedResult: "0",
                    formattedTotal: "1000",
                    formattedTotalIncome: "",
                    formattedTotalPercent: "",
                    month: 0,
                    order: 0,
                    viewedPeriodIncome: "",
                    viewedRate: "",
                  },

*/
