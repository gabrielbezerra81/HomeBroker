import React, { useMemo } from "react";
import { BoxProps, Code, FormattedBox } from "./types";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface QuoteBoxProps {
  quoteBox: BoxProps;
}

const QuoteBox: React.FC<QuoteBoxProps> = ({ quoteBox }) => {
  const formattedBox: FormattedBox = useMemo(() => {
    const box = {} as FormattedBox;

    Object.keys(quoteBox).forEach((key) => {
      const parsedKey = key as keyof BoxProps;

      if (typeof quoteBox[parsedKey] === "number") {
        box[parsedKey] = formatarNumDecimal(quoteBox[parsedKey], 2, 2);
      } //
      else {
        box[parsedKey] = quoteBox[parsedKey] as any;
      }
    });
    return box;
  }, [quoteBox]);

  const sliderBackgroundColor = useMemo(() => {
    return quoteBox.dayOscilation >= 0 ? "sliderBuyColor" : "sliderSellColor";
  }, [quoteBox]);

  return (
    <div className="quoteBox">
      <div className="boxHeader">
        <div>
          {quoteBox.codes.map(
            (code, index) =>
              code.type === "buy" && (
                <CodeColumn key={`${code.symbol}${index}`} code={code} />
              ),
          )}
        </div>
        <div>
          {quoteBox.codes.map(
            (code, index) =>
              code.type === "sell" && (
                <CodeColumn key={`${code.symbol}${index}`} code={code} />
              ),
          )}
        </div>
      </div>
      <div className="mcontent boxContent">
        <header>
          <div className="flexSpaceBetweenCenter">
            <strong className="buyText">COMPRA</strong>
            <strong>Médio</strong>
            <strong className="sellText">VENDA</strong>
          </div>
          <div className="containerSliderTopo">
            <div className="sliderTopo"></div>
            <div className="meioSliderTopo"></div>
            <div className="sliderTopo"></div>
          </div>
          <div className="flexSpaceBetweenCenter">
            <span>{formattedBox.buy}</span>
            <span>{formattedBox.sell}</span>
          </div>
        </header>

        <main></main>

        <footer>
          <div className="flexSpaceBetweenCenter">
            <span>Min</span>
            <span>Max</span>
          </div>
          <input
            type="range"
            className={`custom-range ${sliderBackgroundColor} inputRange`}
            min={quoteBox.min}
            max={quoteBox.max}
            value={(quoteBox.min + quoteBox.max) / 2}
            step={0.01}
            onChange={() => false}
            //value={item.valorAcao}
          />
          <div className="flexSpaceBetweenCenter">
            <span>{formattedBox.min}</span>
            <span>{formattedBox.max}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default QuoteBox;

interface CodeColumnProps {
  code: Code;
}

const CodeColumn: React.FC<CodeColumnProps> = ({ code }) => {
  const qtty = useMemo(() => {
    const formattedQtty = code.qtty > 0 ? `+${code.qtty}` : code.qtty;
    return formattedQtty;
  }, [code.qtty]);

  const symbolColor = useMemo(() => {
    return code.type === "buy" ? "buyText" : "sellText";
  }, [code.type]);

  return (
    <div className="codeColumn">
      <strong className={symbolColor}>{code.symbol}</strong>
      <span>{qtty}</span>
    </div>
  );
};
