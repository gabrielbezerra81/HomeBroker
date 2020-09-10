import React, { useMemo, useState } from "react";
import Draggable from "react-draggable";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { BoxProps, Code, FormattedBox } from "./types";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface QuoteBoxProps {
  quoteBox: BoxProps;
}

const QuoteBox: React.FC<QuoteBoxProps> = ({ quoteBox }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

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
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={() => {
        console.log("start");
        setIsDragging(true);
      }}
      onStop={() => {
        console.log("stop");
        setIsDragging(false);
      }}
      onDrag={(e, data) => setPosition(data)}
    >
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

          <main>
            <div className="buyBook">
              <div>
                <span>Qtde</span>
                <span>Preço</span>
              </div>
              {formattedBox.book.buy.map((book, index) => (
                <div key={`buyBook${index}`}>
                  <span className="buyText">{book.qtty}</span>
                  <span className="buyText">{book.price}</span>
                </div>
              ))}
            </div>
            <div className="quoteContainer">
              <strong>{formattedBox.quote}</strong>
              <span>
                <DayOscilation
                  dayOscilation={quoteBox.dayOscilation}
                  formattedDayOscilation={formattedBox.dayOscilation}
                />
              </span>
            </div>
            <div className="sellBook">
              <div>
                <span>Qtde</span>
                <span>Preço</span>
              </div>
              {formattedBox.book.buy.map((book, index) => (
                <div key={`buyBook${index}`}>
                  <span className="sellText">{book.qtty}</span>
                  <span className="sellText">{book.price}</span>
                </div>
              ))}
            </div>
          </main>

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
    </Draggable>
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

const DayOscilation = ({ dayOscilation, formattedDayOscilation }: any) => {
  if (dayOscilation >= 0)
    return (
      <>
        <ImArrowUp color="#138342" />
        <span style={{ color: "#138342" }}>+{formattedDayOscilation}%</span>
      </>
    );
  return (
    <>
      <ImArrowDown color="#EC0C00" />
      <span style={{ color: "#EC0C00" }}>{formattedDayOscilation}%</span>
    </>
  );
};
