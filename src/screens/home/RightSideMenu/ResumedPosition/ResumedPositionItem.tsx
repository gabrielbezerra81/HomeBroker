import React, { useMemo } from "react";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { PositionItem } from "types/position/position";

interface ResumedPositionItemProps {
  position: PositionItem;
}

const ResumedPositionItem: React.FC<ResumedPositionItemProps> = ({
  position,
}) => {
  const formattedData = useMemo(() => {
    return {
      quote: formatarNumDecimal(position.cotacaoAtual, 3),
      oscilation: formatarNumDecimal(position.oscilacao),
    };
  }, [position]);

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

  return (
    <div className="resumedPositionItem">
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
