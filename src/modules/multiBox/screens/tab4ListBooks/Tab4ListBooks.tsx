import React, { useCallback, useMemo } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";

import { IoMdRepeat } from "react-icons/io";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import SymbolCard from "../SymbolCard";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import {
  handleDeleteBoxAction,
  updateBoxAttrAction,
  handleExportBoxToMultilegAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/closeIcon.png";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface Props {
  multiBox: MultiBoxData;
}

const Tab4ListBooks: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data, symbolsData },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const {
    strikeViewMode,
    id,
    stockSymbolData,
    symbolInput,
    topSymbols,
  } = multiBox;

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
        boxId: id,
      }),
    );
  }, [dispatch, id]);

  const handleConfig = useCallback(() => {}, []);

  const handleClose = useCallback(async () => {
    dispatch(handleDeleteBoxAction(multiBox.id));
  }, [dispatch, multiBox.id]);

  const handleStrikeViewChange = useCallback(() => {
    const viewMode = strikeViewMode === "code" ? "strike" : "code";

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        strikeViewMode: viewMode,
      }),
    );
  }, [dispatch, multiBox.id, strikeViewMode]);

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

  const tab4Data = useMemo(() => {
    return topSymbols.map((topSymbol) => {
      const symbolData = symbolsData.find(
        (item) => item.symbol === topSymbol.code,
      );

      if (!symbolData) {
        return null;
      }

      return { ...symbolData, ...topSymbol };
    });
  }, [symbolsData, topSymbols]);

  return (
    <div className="multiBoxTab4">
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
          <span className="whiteText">Mín</span>
          <span className="whiteText">Médio</span>
          <span className="whiteText">Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range boxInputRange`}
          min={structureData?.min || undefined}
          max={structureData?.max || undefined}
          step={0.01}
        />
        <div>
          <button className="brokerCustomButton whiteText">
            {formattedMin}
          </button>
          <button className="brokerCustomButton whiteText">
            {formattedMedium}
          </button>
          <button className="brokerCustomButton whiteText">
            {formattedMax}
          </button>
        </div>
      </div>

      <Table borderless striped={false}>
        <thead>
          <tr>
            <th colSpan={3}></th>
            <th colSpan={4} className="yellowColumns">
              Book
            </th>
          </tr>
          <tr>
            {/* <th className="yellowColumns">Qtde</th> */}
            <th className="yellowColumns">
              Strike
              <button
                onClick={handleStrikeViewChange}
                className="brokerCustomButton"
              >
                <IoMdRepeat size={17} color="#C4C4C4" />
              </button>
            </th>
            <th>Ult</th>
            <th>Qtde</th>
            <th>Compra</th>
            <th>Venda</th>
            <th>Qtde</th>
          </tr>
        </thead>
        <tbody>
          {tab4Data.map((symbolData, index) => {
            if (!symbolData) {
              return null;
            }

            return (
              <tr key={index}>
                {/* <td className={item.offerType === "C" ? "buyColor" : "sellColor"}>
                  {item.formattedQtty}
                </td> */}
                <td className="strikeColumn">
                  <SymbolCard data={symbolData} />
                </td>
                <td>{symbolData?.formattedLast}</td>
                <td>{symbolData?.formattedBuyQtty}</td>
                <td>{symbolData?.formattedBuy}</td>
                <td>{symbolData?.formattedSell}</td>
                <td>{symbolData?.formattedSellQtty}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Tab4ListBooks;
