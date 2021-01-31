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

interface Props {
  multiBox: MultiBoxData;
}

const Tab1: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const handleMinimize = useCallback(() => {}, []);

  const handleClose = useCallback(() => {}, []);

  const data = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const formattedData: FormattedTab1Data | undefined = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const box = {} as FormattedTab1Data;

    Object.keys(data).forEach((key) => {
      const parsedKey = key as keyof Tab1Data;

      if (typeof data[parsedKey] === "number") {
        box[parsedKey] = formatarNumDecimal(data[parsedKey], 2, 2);
      } //
      else if (parsedKey === "book" && data.book) {
        box.book = { buy: [], sell: [] };

        box.book.buy = data.book.buy
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
        box.book.sell = data.book.sell
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
        box[parsedKey] = data[parsedKey] as any;
      }
    });
    return box;
  }, [data]);

  const sliderBackgroundColor = useMemo(() => {
    return data && data.dayOscilation >= 0
      ? "sliderBuyColor"
      : "sliderSellColor";
  }, [data]);

  return (
    <div className="multiBoxTab1">
      <header>
        <span style={{ left: 12, position: "absolute" }}>
          id: {data?.structureID}
        </span>
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
          <span className="highlightedText">{formattedData?.buy || "0,00"}</span>
          <span className="highlightedText">
            {formattedData?.sell || "0,00"}
          </span>
        </div>
      </section>

      <main>
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
            {data && (
              <DayOscilation
                dayOscilation={data.dayOscilation}
                formattedDayOscilation={data.dayOscilation}
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
      </main>

      <footer>
        <div className="flexSpaceBetweenCenter">
          <span className="highlightedText">Min</span>
          <span className="highlightedText">Max</span>
        </div>
        <input
          type="range"
          className={`custom-range ${sliderBackgroundColor} inputRange`}
          min={data?.min}
          max={data?.max}
          value={data ? (data.min + data.max) / 2 : ""}
          step={0.01}
          onChange={() => false}
          //value={item.valorAcao}
        />
        <div className="flexSpaceBetweenCenter">
          <span className="highlightedText">{formattedData?.min}</span>
          <span className="highlightedText">{formattedData?.max}</span>
        </div>
      </footer>
    </div>
  );
};

export default Tab1;

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
