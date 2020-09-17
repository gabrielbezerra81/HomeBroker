import React, { useCallback, useMemo, useState } from "react";
import produce from "immer";
import Draggable from "react-draggable";
import { RiCloseCircleFill } from "react-icons/ri";
import { AiFillMinusCircle } from "react-icons/ai";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { BoxProps, Code, FormattedBox } from "./types";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateOneSystemStateAction } from "redux/actions/system/SystemActions";

interface QuoteBoxProps {
  quoteBox: BoxProps;
}

const QuoteBox: React.FC<QuoteBoxProps> = ({ quoteBox }) => {
  const {
    systemReducer: { boxesVisibility },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const boxIndex = useMemo(() => {
    return boxesVisibility.findIndex(
      (boxItem) => boxItem.boxKey === `box${quoteBox.id}`,
    );
  }, [boxesVisibility, quoteBox.id]);

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

  const visibilityClass = useMemo(() => {
    return boxesVisibility[boxIndex]?.visibility ? "" : "hiddenBoxContent";
  }, [boxIndex, boxesVisibility]);

  const handleMinimize = useCallback(() => {
    const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
      draft[boxIndex].visibility = !draft[boxIndex].visibility;
    });

    dispatch(
      updateOneSystemStateAction("boxesVisibility", updatedBoxesVisibility),
    );
  }, [boxesVisibility, dispatch, boxIndex]);

  const handleClose = useCallback(() => {
    console.log("close");
  }, []);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={() => {
        setIsDragging(true);
      }}
      onStop={() => {
        setIsDragging(false);
      }}
      onDrag={(e, data) => setPosition(data)}
    >
      <div className="quoteBox">
        <div className="symbolsContainer">
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
        <div className={`mcontent boxContent ${visibilityClass}`}>
          <header>
            <AiFillMinusCircle size={20} fill="#444" onClick={handleMinimize} />
            <RiCloseCircleFill size={20} fill="#444" onClick={handleClose} />
          </header>

          <section>
            <div className="flexSpaceBetweenCenter">
              <strong>COMPRA</strong>
              <strong>Médio</strong>
              <strong>VENDA</strong>
            </div>
            <div className="containerSliderTopo">
              <div className="sliderTopo"></div>
              <div className="meioSliderTopo"></div>
              <div className="sliderTopo"></div>
            </div>
            <div className="flexSpaceBetweenCenter">
              <span className="highlightedText">{formattedBox.buy}</span>
              <span className="highlightedText">{formattedBox.sell}</span>
            </div>
          </section>

          <main>
            <div className="buyBook">
              <div>
                <span className="highlightedText">Qtde</span>
                <span className="highlightedText">Preço</span>
              </div>
              {formattedBox.book.buy.map((book, index) => (
                <div key={`buyBook${index}`}>
                  <span>{book.qtty}</span>
                  <span>{book.price}</span>
                </div>
              ))}
            </div>
            <div className="quoteContainer">
              <strong className="highlightedText">{formattedBox.quote}</strong>
              <span>
                <DayOscilation
                  dayOscilation={quoteBox.dayOscilation}
                  formattedDayOscilation={formattedBox.dayOscilation}
                />
              </span>
            </div>
            <div className="sellBook">
              <div>
                <span className="highlightedText">Qtde</span>
                <span className="highlightedText">Preço</span>
              </div>
              {formattedBox.book.buy.map((book, index) => (
                <div key={`buyBook${index}`}>
                  <span>{book.qtty}</span>
                  <span>{book.price}</span>
                </div>
              ))}
            </div>
          </main>

          <footer>
            <div className="flexSpaceBetweenCenter">
              <span className="highlightedText">Min</span>
              <span className="highlightedText">Max</span>
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
              <span className="highlightedText">{formattedBox.min}</span>
              <span className="highlightedText">{formattedBox.max}</span>
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
