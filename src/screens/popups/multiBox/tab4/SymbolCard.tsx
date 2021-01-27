import React, { useMemo } from "react";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface Props {
  data: {
    offerType: "C" | "P";
    viewMode: "strike" | "code";
    dueDate: string;
    model: "EUROPEAN" | "AMERICAN";
    strike: number | string;
    code: string;
  };
}

const SymbolCard: React.FC<Props> = ({
  data: { offerType, strike, dueDate, viewMode, code, model },
}) => {
  const textColorClass = useMemo(() => {
    if (offerType === "C") {
      return "buyColor";
    }

    return "sellColor";
  }, [offerType]);

  const formattedStrike = useMemo(() => {
    if (typeof strike === "string") {
      return strike;
    }

    return formatarNumDecimal(strike, 2);
  }, [strike]);

  const modelClass = useMemo(() => {
    if (model === "AMERICAN") {
      return "american";
    }

    return "european";
  }, [model]);

  const modelStyle = useMemo(() => {
    if (offerType === "C") {
      return { fontSize: 16 };
    }
    return {};
  }, [offerType]);

  return (
    <div className="symbolCardContainer">
      {model === "AMERICAN" ? (
        <div style={modelStyle} className={`model ${modelClass}`}>
          {offerType}
        </div>
      ) : (
        <div className={`model ${modelClass}`}>{offerType}</div>
      )}
      <h6 className={textColorClass}>
        {viewMode === "strike" ? formattedStrike : code}
      </h6>
      <h6 className={textColorClass}>{dueDate}</h6>
    </div>
  );
};

export default SymbolCard;
