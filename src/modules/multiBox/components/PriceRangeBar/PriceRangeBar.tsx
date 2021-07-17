import React, { useMemo } from "react";
import { useCallback } from "react";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

type Values = {
  min?: number;
  medium?: number;
  max?: number;
};

interface Props {
  min: number | undefined;
  max: number | undefined;
  showMedium?: boolean;
  textClassName?: string;
  onBarClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    values: Values,
  ) => any;
  showCreditDebitText?: boolean;
}

const PriceRangeBar: React.FC<Props> = ({
  min,
  max,
  showMedium = true,
  textClassName,
  onBarClick,
  showCreditDebitText = false,
}) => {
  const isMinMaxNegative = useMemo(() => {
    if (min === undefined || max === undefined) {
      return false;
    }

    if (min < 0 && max < 0) {
      return true;
    }

    return false;
  }, [max, min]);

  const { formattedMin, formattedMax, formattedMedium, medium } =
    useMemo(() => {
      const formatted = {
        formattedMin: "0,00",
        formattedMax: "0,00",
        formattedMedium: "",
        medium: 0,
      };

      const minValue = Math.abs(min || 0);
      const maxValue = Math.abs(max || 0);

      formatted.formattedMin = formatarNumDecimal(minValue);
      formatted.formattedMax = formatarNumDecimal(maxValue);

      if (typeof min === "number" && typeof max === "number") {
        formatted.medium = Math.abs((max + min) / 2);
        formatted.formattedMedium = formatarNumDecimal(formatted.medium || 0);
      }

      return formatted;
    }, [max, min]);

  const rangeBarValues = useMemo(() => {
    if (min === undefined || max === undefined) {
      return { min: undefined, max: undefined };
    }

    const values = {
      min: Math.abs(isMinMaxNegative ? max : min),
      max: Math.abs(isMinMaxNegative ? min : max),
      // min,
      // max,
    };

    return values;
  }, [isMinMaxNegative, max, min]);

  const minCreditLabel = useMemo(() => {
    if (rangeBarValues.min === undefined || rangeBarValues.max === undefined) {
      return "";
    }

    if (rangeBarValues.min < 0 && rangeBarValues.max > 0) {
      return "Crédito";
    }

    if (rangeBarValues.min > 0 && rangeBarValues.max < 0) {
      return "Débito";
    }

    return "";
  }, [rangeBarValues]);

  const maxCreditLabel = useMemo(() => {
    if (rangeBarValues.min === undefined || rangeBarValues.max === undefined) {
      return "";
    }

    if (rangeBarValues.max < 0 && rangeBarValues.min > 0) {
      return "Crédito";
    }

    if (rangeBarValues.max > 0 && rangeBarValues.min < 0) {
      return "Débito";
    }

    return "";
  }, [rangeBarValues]);

  const handleBarClick = useCallback(
    (e) => {
      if (onBarClick) {
        onBarClick(e, {
          min: rangeBarValues.min,
          medium,
          max: rangeBarValues.max,
        });
      }
    },
    [medium, onBarClick, rangeBarValues.max, rangeBarValues.min],
  );

  return (
    <div className="boxInputRangeContainer">
      <div>
        <span className={textClassName}>Mín</span>
        {showMedium && <span className={textClassName}>Médio</span>}
        <span className={textClassName}>Máx</span>
      </div>
      <input
        type="range"
        className={`custom-range boxInputRange`}
        min={rangeBarValues.min || undefined}
        max={rangeBarValues.max || undefined}
        step={0.01}
      />
      <div>
        <button
          onClick={handleBarClick}
          name="min"
          className={`brokerCustomButton ${textClassName}`}
        >
          {isMinMaxNegative ? formattedMax : formattedMin}
        </button>
        {showMedium && (
          <button
            onClick={handleBarClick}
            name="med"
            className={`brokerCustomButton ${textClassName}`}
          >
            {formattedMedium}
          </button>
        )}
        <button
          onClick={handleBarClick}
          name="max"
          className={`brokerCustomButton ${textClassName}`}
        >
          {isMinMaxNegative ? formattedMin : formattedMax}
        </button>
      </div>
      {showCreditDebitText && isMinMaxNegative === false && (
        <div className="creditDebitContainer">
          <span className={textClassName}>{minCreditLabel}</span>
          <span className={textClassName}>{maxCreditLabel}</span>
        </div>
      )}
    </div>
  );
};

export default PriceRangeBar;
