import React, { useCallback, useMemo, useState } from "react";

import Draggable from "react-draggable";

import CustomInput from "shared/components/CustomInput";
import { PopupHeader } from "shared/components/PopupHeader";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateInitialPlannerStateAction } from "modules/financialPlanner/duck/actions/initialPlannerActions";
import { InitialPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { convertInterestRate } from "../utils";

interface Props {
  visibility: boolean;
  setVisibility: (...data: any) => any;
}

const RateConverter: React.FC<Props> = ({ visibility, setVisibility }) => {
  const dispatch = useDispatchStorePrincipal();

  const [yearRate, setYearRate] = useState(0);
  const [monthRate, setMonthRate] = useState(0);
  const [weekRate, setWeekRate] = useState(0);

  const onClose = useCallback(() => {
    setVisibility(false);
  }, [setVisibility]);

  const handleInputChange = useCallback((value, event) => {
    const { name } = event.target;

    const currentRate = value / 100;

    if (name === "yearRate") {
      setYearRate(value);
      setMonthRate(100 * convertInterestRate(currentRate, "year", "month"));
      setWeekRate(100 * convertInterestRate(currentRate, "year", "week"));
    } //
    else if (name === "monthRate") {
      setYearRate(100 * convertInterestRate(currentRate, "month", "year"));
      setMonthRate(value);
      setWeekRate(100 * convertInterestRate(currentRate, "month", "week"));
    } //
    else if (name === "weekRate") {
      setYearRate(100 * convertInterestRate(currentRate, "week", "year"));
      setMonthRate(100 * convertInterestRate(currentRate, "week", "month"));
      setWeekRate(value);
    }
  }, []);

  const handleUseRate = useCallback(
    (event) => {
      const { name } = event.currentTarget;

      const payload: Partial<InitialPlannerData> = {
        contributionPeriodicity: "por ano",
        ratePeriodicity: "por ano",
        interestRate: 0,
      };

      switch (name) {
        case "year":
          payload.contributionPeriodicity = "por ano";
          payload.ratePeriodicity = "por ano";
          payload.interestRate = yearRate;
          break;
        case "month":
          payload.contributionPeriodicity = "por mês";
          payload.ratePeriodicity = "por mês";
          payload.interestRate = monthRate;
          break;
        case "week":
          payload.contributionPeriodicity = "por semana";
          payload.ratePeriodicity = "por semana";
          payload.interestRate = weekRate;
          break;
      }

      dispatch(updateInitialPlannerStateAction(payload));
    },
    [dispatch, monthRate, weekRate, yearRate],
  );

  const visibilityClass = useMemo(() => {
    if (!visibility) {
      return "hidden";
    }

    return "";
  }, [visibility]);

  return (
    <Draggable
      enableUserSelectHack={false}
      handle=".rateConverterPopup"
      onDrag={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className={`rateConverterPopup ${visibilityClass}`}>
        <PopupHeader headerTitle="Conversor de Taxas" onClose={onClose} />

        <div className="content">
          <div className="converterRow">
            <span>Taxa de juros anual</span>
            <CustomInput
              value={yearRate}
              type="preco"
              name="yearRate"
              step={1}
              onChange={(v, e) => handleInputChange(v, e)}
              renderArrows={false}
              theme="dark"
              suffix="%"
              suffixStyle={suffixStyle}
            />
            <button
              className="brokerCustomButton"
              name="year"
              onClick={handleUseRate}
            >
              Usar este
            </button>
          </div>

          <div className="converterRow">
            <span>Taxa de juros mensal</span>
            <CustomInput
              value={monthRate}
              type="preco"
              name="monthRate"
              step={1}
              onChange={(v, e) => handleInputChange(v, e)}
              renderArrows={false}
              theme="dark"
              suffix="%"
              suffixStyle={suffixStyle}
            />
            <button
              className="brokerCustomButton"
              name="month"
              onClick={handleUseRate}
            >
              Usar este
            </button>
          </div>

          <div className="converterRow">
            <span>Taxa de juros semanal</span>
            <CustomInput
              value={weekRate}
              type="preco"
              name="weekRate"
              step={1}
              onChange={(v, e) => handleInputChange(v, e)}
              renderArrows={false}
              theme="dark"
              suffix="%"
              suffixStyle={suffixStyle}
            />
            <button
              className="brokerCustomButton"
              name="week"
              onClick={handleUseRate}
            >
              Usar este
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default RateConverter;

const suffixStyle = {};
