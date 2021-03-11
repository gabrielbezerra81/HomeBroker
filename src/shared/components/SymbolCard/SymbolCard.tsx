import { getSymbolInfoAPI } from "api/symbolAPI";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import CustomTooltip from "shared/components/CustomTooltip";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import {
  SymbolToolTipInfo,
  TopSymbol,
} from "modules/multiBox/types/MultiBoxState";

interface Props {
  data: TopSymbol & { formattedCode?: string };
  showQtty?: boolean;
  showQttyPlus?: boolean;
  showExpirationWithCode?: boolean;
}

const SymbolCard: React.FC<Props> = ({
  data: {
    offerType,
    strike,
    expiration,
    viewMode,
    code,
    model,
    qtty,
    type,
    formattedCode,
  },
  showQtty = false,
  showQttyPlus = false,
  showExpirationWithCode = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<"top" | "bottom">(
    "bottom",
  );
  const [symbolInfo, setSymbolInfo] = useState<SymbolToolTipInfo | null>(null);

  const tooltipId = useMemo(() => Math.random(), []);

  const handleCloseTooltip = useCallback((e) => {
    e.stopPropagation();

    setShowTooltip(false);

    setTimeout(() => {
      setSymbolInfo(null);
    }, 500);
  }, []);

  const handleSearchSymbolInfo = useCallback(async () => {
    if (showTooltip) {
      setShowTooltip(false);

      return;
    }

    const element = document.getElementById("symbolCard" + tooltipId);

    if (element) {
      const { top } = element.getBoundingClientRect();

      if (top >= 154) {
        setTooltipPlacement("top");
      } //
      else {
        setTooltipPlacement("bottom");
      }
    }

    const data = await getSymbolInfoAPI(code);

    setShowTooltip(true);
    setSymbolInfo(data);
  }, [code, showTooltip, tooltipId]);

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
    } //
    else if (model === "EUROPEAN") {
      return "european";
    }

    return "";
  }, [model]);

  const formattedQtty = useMemo(() => {
    let formattedQtty = offerType === "C" ? `${qtty}` : `${qtty}`;

    if (showQttyPlus && qtty > 0) {
      formattedQtty = "+" + formattedQtty;
    }

    return formattedQtty;
  }, [offerType, qtty, showQttyPlus]);

  const typeLetter = useMemo(() => type.substr(0, 1), [type]);

  const TooltipContent = useMemo(() => {
    return (
      <div>
        <header>
          <button onClick={handleCloseTooltip} className="brokerCustomButton">
            <FiX color="#ce202a" size={10} strokeWidth={3} />
          </button>
        </header>
        <main>
          {symbolInfo?.corporationName && (
            <div>
              <span>Empresa:</span>
              <span>{symbolInfo.corporationName}</span>
            </div>
          )}

          <div>
            <span>Mercado:</span>
            <span>{symbolInfo?.market}</span>
          </div>
          <div>
            <span>Ativo:</span>
            <span>
              {symbolInfo?.symbol} {symbolInfo?.specificationCode}
            </span>
          </div>
          {symbolInfo?.type && (
            <div>
              <span>Tipo:</span>
              <span>{symbolInfo?.type}</span>
            </div>
          )}
          {symbolInfo?.model && (
            <div>
              <span>Modelo:</span>
              <span>{symbolInfo?.model}</span>
            </div>
          )}
          <div>
            <span>Strike:</span>
            <span>{symbolInfo?.strike}</span>
          </div>
          <div>
            <span>Vencimento:</span>
            <span>{symbolInfo?.endBusiness}</span>
          </div>
        </main>
      </div>
    );
  }, [handleCloseTooltip, symbolInfo]);

  useEffect(() => {
    function getTooltipPlacement() {
      const element = document.getElementById("symbolCard" + tooltipId);

      if (element) {
        const { top } = element.getBoundingClientRect();

        if (top >= 154) {
          setTooltipPlacement("top");
        }
      }
    }

    getTooltipPlacement();
  }, [tooltipId]);

  const viwedInfo = useMemo(() => {
    if (viewMode === "strike" && strike !== 0) {
      return formattedStrike;
    }

    if (formattedCode) {
      return formattedCode;
    }

    return code;
  }, [code, formattedCode, formattedStrike, strike, viewMode]);

  return (
    <CustomTooltip
      id={tooltipId}
      show={showTooltip}
      placement={tooltipPlacement}
      content={TooltipContent}
      tooltipClassName="boxTopSymbolTooltip"
    >
      <button
        id={`symbolCard${tooltipId}`}
        onClick={handleSearchSymbolInfo}
        className={`brokerCustomButton symbolCardContainer ${modelClass}`}
      >
        {showQtty && (
          <span className={`cardQtty ${textColorClass}`}>{formattedQtty}</span>
        )}
        {model === "AMERICAN" ? (
          <div className={`model ${modelClass}`}>{typeLetter}</div>
        ) : (
          <div className={`model ${modelClass}`}>{typeLetter}</div>
        )}

        <div className="symbolContainer">
          <h6 className={textColorClass}>{viwedInfo}</h6>

          {!!expiration &&
            (showExpirationWithCode || viewMode === "strike") && (
              <h6 className={textColorClass}>{expiration}</h6>
            )}
        </div>
      </button>
    </CustomTooltip>
  );
};

export default SymbolCard;
