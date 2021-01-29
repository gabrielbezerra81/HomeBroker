import React, { useMemo } from "react";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { TopSymbols } from "types/multiBox/MultiBoxState";

interface Props {
  data: TopSymbols;
  showQtty?: boolean;
  showQttyPlus?: boolean;
}

const SymbolCard: React.FC<Props> = ({
  data: { offerType, strike, expiration, viewMode, code, model, qtty, type },
  showQtty = false,
  showQttyPlus = false,
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

  const formattedQtty = useMemo(() => {
    let formattedQtty = offerType === "C" ? `${qtty}` : `-${qtty}`;

    if (showQttyPlus && qtty > 0) {
      formattedQtty = formattedQtty.padStart(2, "+");
    }

    return formattedQtty;
  }, [offerType, qtty, showQttyPlus]);

  const typeLetter = useMemo(() => type.substr(0, 1), [type]);

  return (
    <div className="symbolCardContainer">
      {showQtty && (
        <span className={`cardQtty ${textColorClass}`}>{formattedQtty}</span>
      )}
      {model === "AMERICAN" ? (
        <div style={modelStyle} className={`model ${modelClass}`}>
          {typeLetter}
        </div>
      ) : (
        <div className={`model ${modelClass}`}>{typeLetter}</div>
      )}
      <h6 className={textColorClass}>
        {viewMode === "strike" && strike !== -1 ? formattedStrike : code}
      </h6>
      <h6 className={textColorClass}>{expiration}</h6>
    </div>
  );
};

export default SymbolCard;
