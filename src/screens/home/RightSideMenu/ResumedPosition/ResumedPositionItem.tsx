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
      <div>
        <span className="buyText">BRZU</span>
        <span>+100</span>
      </div>
      <div>
        <span className="sellText">GDX</span>
        <span>-100</span>
      </div>
      <div>
        <span className="sellText">GDX</span>
        <span>-100</span>
      </div>
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
