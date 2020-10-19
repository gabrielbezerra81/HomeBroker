import React, { useCallback, useEffect, useMemo, useState } from "react";
import produce from "immer";
import Draggable, { DraggableData } from "react-draggable";
import { RiCloseCircleFill } from "react-icons/ri";
import { AiFillMinusCircle } from "react-icons/ai";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { BoxProps, Code, FormattedBox } from "./types";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  updateManySystemState,
  updateOneSystemStateAction,
} from "redux/actions/system/SystemActions";
import { deleteQuoteBoxAPI } from "api/API";

interface QuoteBoxProps {
  quoteBox: BoxProps;
}

const QuoteBox: React.FC<QuoteBoxProps> = ({ quoteBox }) => {
  const {
    systemReducer: { boxesVisibility, selectedTab, openedMenus, quoteBoxes },
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
    const shouldShowBox = openedMenus.some(
      (menuItem) =>
        menuItem.menuKey === `box${quoteBox.id}` &&
        menuItem.tabKey === selectedTab,
    );

    return shouldShowBox ? {} : { display: "none" };
  }, [openedMenus, quoteBox.id, selectedTab]);

  const minimizedClass = useMemo(() => {
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

  const handleClose = useCallback(async () => {
    try {
      const shouldDelete = await deleteQuoteBoxAPI(quoteBox.id);

      if (shouldDelete) {
        const updatedOpenedMenus = produce(openedMenus, (draft) => {
          return draft.filter(
            (menuItem) => menuItem.menuKey !== `box${quoteBox.id}`,
          );
        });

        const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
          draft.splice(boxIndex, 1);
        });

        const updatedQuoteBoxes = produce(quoteBoxes, (draft) => {
          const index = draft.findIndex(
            (boxItem) => boxItem.id === quoteBox.id,
          );

          if (index >= 0) draft.splice(index, 1);
        });
        dispatch(
          updateManySystemState({
            openedMenus: updatedOpenedMenus,
            boxesVisibility: updatedBoxesVisibility,
            quoteBoxes: updatedQuoteBoxes,
          }),
        );
      }
    } catch (error) {}
  }, [
    boxIndex,
    boxesVisibility,
    openedMenus,
    quoteBox.id,
    quoteBoxes,
    dispatch,
  ]);

  const onStartDragging = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onStopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback((e, data: DraggableData) => {
    setPosition(data);
  }, []);

  // useEffect(() => {
  //   const box = document.getElementById(`${quoteBox.id}`);

  //   if (box) {
  //     const { x, y } = box.getBoundingClientRect();
  //     setPosition({ x: x - 80, y });
  //     // box.style.position = "absolute";
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
    >
      <div
        className="quoteBox"
        style={{
          ...visibilityClass,
        }}
        id={quoteBox.id + ""}
      >
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
        <div className={`mcontent boxContent ${minimizedClass}`}>
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
              <span className="highlightedText">
                {formattedBox.buy || "0,00"}
              </span>
              <span className="highlightedText">
                {formattedBox.sell || "0,00"}
              </span>
            </div>
          </section>

          <main>
            <div className="buyBook">
              {!!formattedBox.book.buy.length && (
                <>
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
                </>
              )}
            </div>
            <div className="quoteContainer">
              <strong className="highlightedText">
                {formattedBox.quote || "0,00"}
              </strong>
              <span>
                <DayOscilation
                  dayOscilation={quoteBox.dayOscilation}
                  formattedDayOscilation={formattedBox.dayOscilation}
                />
              </span>
            </div>
            <div className="sellBook">
              {!!formattedBox.book.sell.length && (
                <>
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
                </>
              )}
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
