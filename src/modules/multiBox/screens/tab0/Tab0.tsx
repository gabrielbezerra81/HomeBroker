import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useMemo, useCallback } from "react";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import { formatarNumDecimal } from "shared/utils/Formatacoes";
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
import PopConfirm from "shared/components/PopConfirm/PopConfirm";

interface Props {
  multiBox: MultiBoxData;
}

const Tab0: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data, stockSymbolsData },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { id, symbolInput, toggleShowId, searchedSymbol } = multiBox;

  const stockSymbolData = useMemo(() => {
    return stockSymbolsData.find((data) => data.symbol === searchedSymbol);
  }, [searchedSymbol, stockSymbolsData]);

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

  const handleConfig = useCallback(() => {
    dispatch(
      updateBoxAttrAction(id, {
        toggleShowId: !toggleShowId,
      }),
    );
  }, [dispatch, id, toggleShowId]);

  const handleClose = useCallback(async () => {
    await dispatch(handleDeleteBoxAction(multiBox.id));
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
      else {
        box[parsedKey] = structureData[parsedKey] as any;
      }
    });

    box.quote = box?.quote.replace("-", "");

    return box;
  }, [structureData]);

  const formattedRefStockData = useMemo(() => {
    if (!stockSymbolData) {
      return null;
    }

    const { oscilation, last } = stockSymbolData;

    let formattedOscilation = "";

    if (oscilation > 0) {
      formattedOscilation += "+";
    }

    formattedOscilation += formatarNumDecimal(oscilation || 0) + "%";

    return {
      formattedLast: formatarNumDecimal(last),
      formattedOscilation,
    };
  }, [stockSymbolData]);

  const { formattedMin, formattedMax } = useMemo(() => {
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

  const isMinMaxNegative = useMemo(() => {
    if (!structureData) {
      return false;
    }

    if (structureData.min < 0 && structureData.max < 0) {
      return true;
    }

    return false;
  }, [structureData]);

  const rangeBarValues = useMemo(() => {
    if (!structureData) {
      return { min: undefined, max: undefined };
    }

    const values = {
      min: isMinMaxNegative ? structureData.max : structureData.min,
      max: isMinMaxNegative ? structureData.min : structureData.max,
    };

    return values;
  }, [isMinMaxNegative, structureData]);

  if (!structureData) {
    return <div></div>;
  }

  return (
    <div className="multiBoxTab0">
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

          <PopConfirm
            title="Excluir box"
            message="Tem certeza que deseja excluir este box?"
            onConfirm={handleClose}
          >
            <button className="brokerCustomButton">
              <img src={closeIcon} alt="" />
            </button>
          </PopConfirm>
        </div>
      </header>

      <div className="boxInputRangeContainer">
        <div>
          <span>Mín</span>
          <span>Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range boxInputRange`}
          min={rangeBarValues.min}
          max={rangeBarValues.max}
          // value={
          //   structureData ? (structureData.min + structureData.max) / 2 : ""
          // }
          step={0.01}
        />
        <div>
          <button className="brokerCustomButton">
            {isMinMaxNegative ? formattedMax : formattedMin}
          </button>
          <button className="brokerCustomButton">
            {isMinMaxNegative ? formattedMin : formattedMax}
          </button>
        </div>
      </div>

      <div className="quoteContainer">
        {structureData.quote < 0 && <span className="quoteInfo">crédito</span>}

        <strong className="whiteText">{formattedData?.quote || "0,00"}</strong>
        <span>
          {structureData && (
            <DayOscilation
              dayOscilation={structureData.dayOscilation}
              formattedDayOscilation={formattedData?.dayOscilation}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default Tab0;

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
