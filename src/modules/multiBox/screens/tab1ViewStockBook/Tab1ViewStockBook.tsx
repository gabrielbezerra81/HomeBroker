import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useMemo, useCallback } from "react";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import {
  MultiBoxData,
  Tab1Data,
  FormattedTab1Data,
} from "modules/multiBox/types/MultiBoxState";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  handleExportBoxToMultilegAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/closeIcon.png";
import { handleAddStockOfferAction } from "modules/multiBox/duck/actions/tab5Actions";
interface Props {
  multiBox: MultiBoxData;
}

const Tab1ViewStockBook: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { stockSymbolData, id, symbolInput } = multiBox;

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const handleSearchStock = useCallback(() => {
    dispatch(handleAddStockOfferAction(id, symbolInput));
  }, [dispatch, id, symbolInput]);

  const handleOpenInMultileg = useCallback(() => {
    dispatch(
      handleExportBoxToMultilegAction({
        boxId: multiBox.id,
      }),
    );
  }, [dispatch, multiBox.id]);

  const handleConfig = useCallback(() => {}, []);

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

  const oscilationClass = useMemo(() => {
    if (!stockSymbolData) {
      return "";
    }

    if (stockSymbolData.oscilation > 0) {
      return "positiveText";
    } else if (stockSymbolData.oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, [stockSymbolData]);

  const formattedRefStockData = useMemo(() => {
    if (!stockSymbolData) {
      return null;
    }

    const { oscilation, min, max, last } = stockSymbolData;

    let formattedOscilation = "";

    if (oscilation > 0) {
      formattedOscilation += "+";
    }

    formattedOscilation += formatarNumDecimal(oscilation || 0) + "%";

    const medium = (max + min) / 2;

    const formattedMedium = formatarNumDecimal(medium, 3);

    return {
      ...stockSymbolData,
      formattedLast: formatarNumDecimal(last),
      formattedOscilation,
      formattedMin: formatarNumDecimal(min),
      formattedMax: formatarNumDecimal(max),
      medium,
      formattedMedium,
    };
  }, [stockSymbolData]);

  if (!structureData) {
    return <div></div>;
  }

  return (
    <div className="multiBoxTab1">
      <header className="boxContentHeader">
        <div>
          <h4>{stockSymbolData?.symbol}</h4>
          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className={`oscilation ${oscilationClass}`}>
            {formattedRefStockData?.formattedOscilation}
          </span>
        </div>
        <div className="buttonsContainer">
          <button className="brokerCustomButton" onClick={handleSearchStock}>
            <img src={zoomIcon} alt="" />
          </button>

          <button className="brokerCustomButton" onClick={handleOpenInMultileg}>
            <img className="openInNewIcon" src={openInNewIcon} alt="" />
          </button>

          <button className="brokerCustomButton" onClick={handleConfig}>
            <img src={cogIcon} alt="" />
          </button>

          <button className="brokerCustomButton" onClick={handleClose}>
            <img src={closeIcon} alt="" />
          </button>
        </div>
      </header>

      <div className="boxInputRangeContainer">
        <div>
          <span className="whiteText">Mín</span>
          <span className="whiteText">Médio</span>
          <span className="whiteText">Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range boxInputRange`}
          min={structureData?.min || undefined}
          max={structureData?.max || undefined}
          // value={
          //   structureData ? (structureData.min + structureData.max) / 2 : ""
          // }
          step={0.01}
        />
        <div>
          <button className="brokerCustomButton whiteText">
            {formattedRefStockData?.formattedMin}
          </button>
          <button className="brokerCustomButton whiteText">
            {formattedRefStockData?.formattedMedium}
          </button>
          <button className="brokerCustomButton whiteText">
            {formattedRefStockData?.formattedMax}
          </button>
        </div>
      </div>

      <div className="content">
        <section className="middle">
          <div className="buyBook">
            {!!formattedData?.book.buy.length && (
              <>
                <div>
                  <span className="whiteText">Qtde</span>
                  <span className="whiteText">Preço</span>
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
            <strong className="whiteText">
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
                  <span className="whiteText">Qtde</span>
                  <span className="whiteText">Preço</span>
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
            <span className="whiteText">{formattedData?.buy || "0,00"}</span>
            <span className="whiteText">{formattedData?.sell || "0,00"}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tab1ViewStockBook;

const DayOscilation = ({ dayOscilation, formattedDayOscilation }: any) => {
  if (dayOscilation > 0) {
    return (
      <>
        <ImArrowUp color="#138342" />
        <span style={{ color: "#138342" }}>+{formattedDayOscilation}%</span>
      </>
    );
  } //
  else if (dayOscilation < 0) {
    return (
      <>
        <ImArrowDown color="#EC0C00" />
        <span style={{ color: "#EC0C00" }}>{formattedDayOscilation}%</span>
      </>
    );
  }

  return <span style={{ color: "#ddd" }}>+{formattedDayOscilation}%</span>;
};
