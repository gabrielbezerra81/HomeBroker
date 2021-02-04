import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useMemo, useCallback } from "react";

import { AiFillMinusCircle } from "react-icons/ai";
import { RiCloseCircleFill } from "react-icons/ri";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import {
  MultiBoxData,
  Tab1Data,
  FormattedTab1Data,
} from "types/multiBox/MultiBoxState";
import { deleteQuoteBoxAPI } from "api/API";
import produce from "immer";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  updateManyMultiBoxAction,
} from "redux/actions/multiBox/multiBoxActions";

import closeIcon from "assets/multiBox/closeIcon.png";

interface Props {
  multiBox: MultiBoxData;
}

const Tab1ViewStockBook: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data, boxes },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const handleMinimize = useCallback(() => {}, []);

  const handleClose = useCallback(async () => {
    dispatch(handleDeleteBoxAction(multiBox.id));
  }, [dispatch, multiBox.id]);

  const formattedData: FormattedTab1Data | undefined = useMemo(() => {
    if (!structureData) {
      return undefined;
    }

    const box = {} as FormattedTab1Data;

    Object.keys(structureData).forEach((key) => {
      const parsedKey = key as keyof Tab1Data;

      if (typeof structureData[parsedKey] === "number") {
        box[parsedKey] = formatarNumDecimal(structureData[parsedKey], 2, 2);
      } //
      else if (parsedKey === "book" && structureData.book) {
        box.book = { buy: [], sell: [] };

        box.book.buy = structureData.book.buy
          .filter(
            (bookLine) =>
              bookLine.price.toString() !== "0.0031415" &&
              bookLine.qtty.toString() !== "0.0031415",
          )
          .map((bookLine) => ({
            ...bookLine,
            formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
            formattedPrice: formatarNumDecimal(bookLine.price),
          }));
        box.book.sell = structureData.book.sell
          .filter(
            (bookLine) =>
              bookLine.price.toString() !== "0.0031415" &&
              bookLine.qtty.toString() !== "0.0031415",
          )
          .map((bookLine) => ({
            ...bookLine,
            formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
            formattedPrice: formatarNumDecimal(bookLine.price),
          }));
      } else {
        box[parsedKey] = structureData[parsedKey] as any;
      }
    });
    return box;
  }, [structureData]);

  const sliderBackgroundColor = useMemo(() => {
    return structureData && structureData.dayOscilation >= 0
      ? "sliderBuyColor"
      : "sliderSellColor";
  }, [structureData]);

  if (!structureData) {
    return <div></div>;
  }

  return (
    <div className="multiBoxTab1">
      <header>
        <span style={{ left: 12, position: "absolute" }}>
          id: {structureData?.structureID}
        </span>
        {/* <AiFillMinusCircle size={20} fill="#444" onClick={handleMinimize} /> */}
        {/* <RiCloseCircleFill size={20} fill="#444" onClick={handleClose} /> */}
        <button className="brokerCustomButton" onClick={handleClose}>
          <img src={closeIcon} alt="" />
        </button>
      </header>

      <div className="content">
        <section className="top">
          <div className="flexSpaceBetweenCenter">
            <strong>COMPRA</strong>
            <strong>Médio</strong>
            <strong>VENDA</strong>
          </div>
          <div className="boxSliderContainer">
            <div className="sliderEdge"></div>
            <div className="sliderMiddle"></div>
            <div className="sliderEdge"></div>
          </div>
          <div className="flexSpaceBetweenCenter">
            <span className="highlightedText">
              {formattedData?.buy || "0,00"}
            </span>
            <span className="highlightedText">
              {formattedData?.sell || "0,00"}
            </span>
          </div>
        </section>

        <section className="middle">
          <div className="buyBook">
            {!!formattedData?.book.buy.length && (
              <>
                <div>
                  <span className="highlightedText">Qtde</span>
                  <span className="highlightedText">Preço</span>
                </div>
                {formattedData.book.buy.map((book, index) => (
                  <div key={`buyBook${index}`}>
                    <span>{book.formattedQtty}</span>
                    <span>{book.formattedPrice}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="quoteContainer">
            <strong className="highlightedText">
              {formattedData?.quote || "0,00"}
            </strong>
            <span>
              {structureData && (
                <DayOscilation
                  dayOscilation={structureData.dayOscilation}
                  formattedDayOscilation={structureData.dayOscilation}
                />
              )}
            </span>
          </div>
          <div className="sellBook">
            {!!formattedData?.book.sell.length && (
              <>
                <div>
                  <span className="highlightedText">Qtde</span>
                  <span className="highlightedText">Preço</span>
                </div>
                {formattedData.book.sell.map((book, index) => (
                  <div key={`buyBook${index}`}>
                    <span>{book.formattedQtty}</span>
                    <span>{book.formattedPrice}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <section className="footer">
          <div className="flexSpaceBetweenCenter">
            <span className="highlightedText">Min</span>
            <span className="highlightedText">Max</span>
          </div>
          <input
            type="range"
            className={`custom-range ${sliderBackgroundColor} inputRange`}
            min={structureData?.min}
            max={structureData?.max}
            value={
              structureData ? (structureData.min + structureData.max) / 2 : ""
            }
            step={0.01}
            onChange={() => false}
            //value={item.valorAcao}
          />
          <div className="flexSpaceBetweenCenter">
            <span className="highlightedText">{formattedData?.min}</span>
            <span className="highlightedText">{formattedData?.max}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tab1ViewStockBook;

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
