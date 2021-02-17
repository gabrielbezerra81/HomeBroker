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
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/closeIcon.png";
import { Form, InputGroup } from "react-bootstrap";
interface Props {
  multiBox: MultiBoxData;
}

const Tab1StructureBook: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { stockSymbolData, id, symbolInput } = multiBox;

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const handleSymbolChange = useCallback(
    (e) => {
      let value = e.currentTarget.value;

      value = value.toLocaleUpperCase();

      dispatch(updateBoxAttrAction(id, { symbolInput: value }));
    },
    [dispatch, id],
  );

  const handleSearchStock = useCallback(() => {
    dispatch(updateBoxAttrAction(id, { activeTab: "5" }));
  }, [dispatch, id]);

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

  const { formattedMin, formattedMedium, formattedMax } = useMemo(() => {
    const formatted = {
      formattedMin: "0,00",
      formattedMax: "0,00",
      formattedMedium: "",
      medium: 0,
    };

    if (!structureData) {
      return formatted;
    }

    const { min, max } = structureData;

    formatted.formattedMin = formatarNumDecimal(min || 0);
    formatted.formattedMax = formatarNumDecimal(max || 0);

    if (typeof min === "number" && typeof max === "number") {
      formatted.medium = (max + min) / 2;
      formatted.formattedMedium = formatarNumDecimal(formatted.medium || 0);
    }

    return formatted;
  }, [structureData]);

  if (!structureData) {
    return <div></div>;
  }

  return (
    <div className="multiBoxTab1">
      <header className="boxContentHeader">
        <div className="searchRow">
          <InputGroup>
            <Form.Control
              className="inputWithSearchIcon"
              name="symbolInput"
              value={symbolInput}
              // autoComplete="off"
              onKeyPress={(e: any) => {
                if (e.key === "Enter") {
                  handleSearchStock();
                }
              }}
              onChange={handleSymbolChange}
            />
          </InputGroup>

          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className="oscilation">
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
          <span>Mín</span>
          <span>Médio</span>
          <span>Máx</span>
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
          <button className="brokerCustomButton">{formattedMin}</button>
          <button className="brokerCustomButton">{formattedMedium}</button>
          <button className="brokerCustomButton">{formattedMax}</button>
        </div>
      </div>

      <section className="middle">
        <div className="buyBook">
          {!!formattedData?.book.buy.length && (
            <>
              <div>
                <span className="bookHead">Qtde</span>
                <span className="bookHead">Preço</span>
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
                <span className="bookHead">Qtde</span>
                <span className="bookHead">Preço</span>
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
    </div>
  );
};

export default Tab1StructureBook;

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
        <ImArrowDown className="arrowDown" color="#EC0C00" />
        <span style={{ color: "#EC0C00" }}>{formattedDayOscilation}%</span>
      </>
    );
  }

  return <span style={{ color: "#ddd" }}>+{formattedDayOscilation}%</span>;
};

/*

  
      


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
      

*/
