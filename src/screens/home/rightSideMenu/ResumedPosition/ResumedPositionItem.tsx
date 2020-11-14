import React, { useEffect, useMemo, useState } from "react";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { PositionItem } from "types/position/position";

interface ResumedPositionItemProps {
  position: PositionItem;
}

const ResumedPositionItem: React.FC<ResumedPositionItemProps> = ({
  position,
}) => {
  const notInCustodyCodes = useMemo(() => {
    return position.ativos.filter(
      (symbolCode, index) =>
        !position.custodiaCompra.find(
          (custodyItem) => custodyItem.ativo === symbolCode.symbol,
        ) &&
        !position.custodiaVenda.find(
          (custodyItem) => custodyItem.ativo === symbolCode.symbol,
        ),
    );
  }, [position.ativos, position.custodiaCompra, position.custodiaVenda]);

  const [hasOverflow, setHasOverflow] = useState(() => {
    const symbolsArray: string[] = [];

    notInCustodyCodes.forEach((notInCustodyItem) => {
      symbolsArray.push(notInCustodyItem.symbol);
    });

    position.custodiaCompra.forEach((custodyItem) => {
      symbolsArray.push(custodyItem.ativo);
    });

    position.custodiaVenda.forEach((custodyItem) => {
      symbolsArray.push(custodyItem.ativo);
    });

    const symbols = symbolsArray.join("");

    return symbols.length > 13;
  });

  const formattedData = useMemo(() => {
    return {
      quote: formatarNumDecimal(position.cotacaoAtual, 3),
      oscilation: formatarNumDecimal(position.oscilacao),
    };
  }, [position]);

  useEffect(() => {
    const positionItem = document.getElementById(`positionItem${position.id}`);

    if (positionItem) {
      setHasOverflow(positionItem.getBoundingClientRect().width > 198);
    }
  }, [position.id]);

  return hasOverflow ? (
    <>
      {position.custodiaCompra.map((custodyItem, index) => (
        <div className="resumedPositionItem">
          <div>
            <span className="buyText">{custodyItem.ativo}</span>
            <span>
              {custodyItem.qtdeExecutada >= 0 ? "+" : "-"}
              {custodyItem.qtdeExecutada}
            </span>
          </div>
          <div>
            <span className={position.oscilacao >= 0 ? "buyText" : "sellText"}>
              {formattedData.oscilation}%
            </span>
            <span>{formattedData.quote}</span>
          </div>
        </div>
      ))}
      {position.custodiaVenda.map((custodyItem, index) => (
        <div className="resumedPositionItem">
          <div key={`${custodyItem.ativo}${index}`}>
            <span className="sellText">{custodyItem.ativo}</span>
            <span>
              {custodyItem.qtdeExecutada >= 0 ? "+" : "-"}
              {custodyItem.qtdeExecutada}
            </span>
          </div>
          <div>
            <span className={position.oscilacao >= 0 ? "buyText" : "sellText"}>
              {formattedData.oscilation}%
            </span>
            <span>{formattedData.quote}</span>
          </div>
          s
        </div>
      ))}

      {notInCustodyCodes.map((symbolCode, index) => (
        <div className="resumedPositionItem">
          <div key={`${symbolCode.symbol}${index}`}>
            <span style={{ color: "#ddd" }}>{symbolCode.symbol}</span>
            <span>0</span>
          </div>
          <div>
            <span className={position.oscilacao >= 0 ? "buyText" : "sellText"}>
              {formattedData.oscilation}%
            </span>
            <span>{formattedData.quote}</span>
          </div>
        </div>
      ))}
    </>
  ) : (
    <div className="resumedPositionItem" id={`positionItem${position.id}`}>
      {position.custodiaCompra.map((custodyItem, index) => (
        <div key={`${custodyItem.ativo}${index}`}>
          <span className="buyText">{custodyItem.ativo}</span>
          <span>
            {custodyItem.qtdeExecutada >= 0 ? "+" : "-"}
            {custodyItem.qtdeExecutada}
          </span>
        </div>
      ))}
      {position.custodiaVenda.map((custodyItem, index) => (
        <div key={`${custodyItem.ativo}${index}`}>
          <span className="sellText">{custodyItem.ativo}</span>
          <span>
            {custodyItem.qtdeExecutada >= 0 ? "+" : "-"}
            {custodyItem.qtdeExecutada}
          </span>
        </div>
      ))}
      {notInCustodyCodes.map((symbolCode, index) => (
        <div key={`${symbolCode.symbol}${index}`}>
          <span style={{ color: "#ddd" }}>{symbolCode.symbol}</span>
          <span>0</span>
        </div>
      ))}
      <div>
        <span className={position.oscilacao >= 0 ? "buyText" : "sellText"}>
          {formattedData.oscilation}%
        </span>
        <span>{formattedData.quote}</span>
      </div>
    </div>
  );
};

export default ResumedPositionItem;
