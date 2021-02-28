import React, { useCallback, useEffect, useMemo, useState } from "react";

import moment from "moment";

import { Form, InputGroup, Spinner } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import DraggablePopup from "shared/components/DraggablePopup/DraggablePopup";
import { PopupHeader } from "shared/components/PopupHeader";

import "../styles/OptionsTable.scss";
import { OptionTableItem } from "../types/OptionsTableState";
import api from "api/apiConfig";
import { url_optionsTable_symbol_type } from "api/url";
import { Table } from "react-bootstrap";
import { GrFormSearch } from "react-icons/gr";
import { getOneSymbolDataAPI } from "api/symbolAPI";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface GetOptionsAPI {
  lines: Array<OptionTableItem>;
}

interface TableLine {
  strike: number;
  [key: string]: any;
}

interface SymbolData {
  last: number;
  oscilation: number;
}

// const data: OptionTableItem[] = [
//   {
//     strikeLine: 8,
//     stocks: [
//       {
//         symbol: "PETRB8",
//         market: "EquityCall",
//         strike: 8,
//         type: "CALL",
//         model: "AMERICAN",
//         referenceStock: 200000452882,
//         endBusiness: "18/02/2022 23:59:00",
//         strikeGroup: 8,
//       },
//     ],
//     structuresIds: [3143],
//   },
//   {
//     strikeLine: 9,
//     stocks: [
//       {
//         symbol: "PETRB9",
//         market: "EquityCall",
//         strike: 9,
//         type: "CALL",
//         model: "AMERICAN",
//         referenceStock: 200000452882,
//         endBusiness: "18/02/2022 23:59:00",
//         strikeGroup: 9,
//       },
//     ],
//     structuresIds: [3144],
//   },
//   {
//     strikeLine: 10,
//     stocks: [
//       {
//         symbol: "PETRB10",
//         market: "EquityCall",
//         strike: 10,
//         type: "CALL",
//         model: "AMERICAN",
//         referenceStock: 200000452882,
//         endBusiness: "18/02/2022 23:59:00",
//         strikeGroup: 10,
//       },
//     ],
//     structuresIds: [3145],
//   },
//   {
//     strikeLine: 10.25,
//     stocks: [
//       {
//         symbol: "PETRB102",
//         market: "EquityCall",
//         strike: 10.25,
//         type: "CALL",
//         model: "EUROPEAN",
//         referenceStock: 200000452882,
//         endBusiness: "22/02/2021 23:59:00",
//         strikeGroup: 10.25,
//       },
//     ],
//     structuresIds: [3146],
//   },
//   {
//     strikeLine: 10.5,
//     stocks: [
//       {
//         symbol: "PETRB105",
//         market: "EquityCall",
//         strike: 10.5,
//         type: "CALL",
//         model: "AMERICAN",
//         referenceStock: 200000452882,
//         endBusiness: "22/02/2021 23:59:00",
//         strikeGroup: 10.5,
//       },
//       {
//         symbol: "PETRC105",
//         market: "EquityCall",
//         strike: 10.5,
//         type: "CALL",
//         model: "AMERICAN",
//         referenceStock: 200000452882,
//         endBusiness: "15/03/2021 23:59:00",
//         strikeGroup: 10.5,
//       },
//     ],
//     structuresIds: [3147, 3147],
//   },
// ];

const OptionsTable: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isOpenOptionsTable },
  } = useStateStorePrincipal();

  const [optionsData, setOptionsData] = useState<OptionTableItem[]>(() => {
    const tableJSON = localStorage.getItem("optionsTable");

    if (tableJSON) {
      // return JSON.parse(tableJSON);
      return [];
    }

    return [];
  });
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<"CALL" | "PUT">("CALL");
  const [symbolData, setSymbolData] = useState<SymbolData | null>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectBloqueado, setSelectBloqueado] = useState(false);

  const [fetchingAPI, setFetchingAPI] = useState(false);

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenOptionsTable"));
  }, [dispatch]);

  const onMouseDown = useCallback((e) => {
    const container = document.getElementById("scrollOptionsTable");

    if (container) {
      setMouseDown(true);
      setStartX(e.pageX);
      setStartY(e.pageY);
      setScrollLeft(container.scrollLeft);
      setScrollTop(container.scrollTop);
      container.classList.add("dragScrollPointer");
    }
  }, []);

  const onMouseUp = useCallback((e) => {
    const optionsTable = document.getElementById("optionsTable");
    const container = document.getElementById("scrollOptionsTable");

    if (container && optionsTable) {
      setMouseDown(false);
      setSelectBloqueado(false);
      optionsTable.classList.remove("blockSelection");
      container.classList.remove("dragScrollPointer");

      if (container.hasPointerCapture(1)) {
        container.releasePointerCapture(1);
      }
    }
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!mouseDown) return;
      e.preventDefault();

      if (!selectBloqueado) {
        const container = document.getElementById("scrollOptionsTable");
        const optionsTable = document.getElementById("optionsTable");

        if (container && optionsTable) {
          container.setPointerCapture(1);

          optionsTable.classList.add("blockSelection");
          setSelectBloqueado(true);
        }
      }

      let diferencaXInicial = startX - e.pageX;
      let thresholdX = 4;
      if (diferencaXInicial < 1) {
        diferencaXInicial *= -1;
        thresholdX *= -1;
      }

      let diferencaYInicial = startY - e.pageY;
      let thresholdY = 4;
      if (diferencaYInicial < 1) {
        diferencaYInicial *= -1;
        thresholdY *= -1;
      }

      const container = document.getElementById("scrollOptionsTable");

      if (!container) {
        return;
      }

      if (diferencaXInicial > Math.abs(thresholdX)) {
        const x = e.pageX;
        const movimentoX = (x - startX + thresholdX) * 3;
        container.scrollLeft = scrollLeft - movimentoX;
      }

      if (diferencaYInicial > Math.abs(thresholdY)) {
        const y = e.pageY;
        const movimentoY = (y - startY + thresholdY) * 1;
        container.scrollTop = scrollTop - movimentoY;
      }
    },
    [mouseDown, scrollLeft, scrollTop, selectBloqueado, startX, startY],
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.currentTarget;

    if (name === "symbol") {
      setSymbol(value.toUpperCase());
    }
  }, []);

  const handleSearchOptions = useCallback(async () => {
    try {
      if (fetchingAPI) {
        return;
      }

      if (!symbol) {
        return;
      }

      setFetchingAPI(true);

      const response = await api.get<GetOptionsAPI>(
        `${url_optionsTable_symbol_type}${symbol}/${type}`,
      );

      const data = await getOneSymbolDataAPI(symbol);

      if (data) {
        setSymbolData({
          last: data.ultimo || 0,
          oscilation: data.oscilacao || 0,
        });
      }

      setOptionsData(response.data.lines);
    } catch (error) {
    } finally {
      setFetchingAPI(false);
    }
  }, [fetchingAPI, symbol, type]);

  const columns = useMemo(() => {
    let expirationDates: moment.Moment[] = [];

    optionsData.forEach((optionLine) => {
      optionLine.stocks.forEach((stockItem) => {
        const [date] = stockItem.endBusiness.split(" ");

        const [day, month, year] = date
          .split("/")
          .map((number) => Number(number));
        expirationDates.push(moment(new Date(year, month - 1, day)));
      });
    });

    expirationDates.sort((a, b) => a.diff(b));

    let expirations: string[] = expirationDates.map((momentDate) => {
      const dateObj = momentDate.toObject();

      const days = dateObj.date.toString().padStart(2, "0");
      const month = (dateObj.months + 1).toString().padStart(2, "0");

      const date = `${days}/${month}/${dateObj.years}`;

      return date;
    });

    expirations = [...new Set(expirations)];

    const columns = expirations.map((expiration) => ({
      key: expiration,
      title: expiration,
      width: 80,
    }));

    return [{ key: "strike", title: "", width: 60 }, ...columns];
  }, [optionsData]);

  const tableData = useMemo(() => {
    const tableData: TableLine[] = optionsData.map((optionItem) => {
      const tableLine = {
        strike: optionItem.strikeLine,
      };

      optionItem.stocks.forEach((stockItem) => {
        const [expiration] = stockItem.endBusiness.split(" ");
        Object.assign(tableLine, { [expiration]: stockItem.symbol });
      });

      return tableLine;
    });

    return tableData;
  }, [optionsData]);

  useEffect(() => {
    if (symbol) {
      api
        .get<GetOptionsAPI>(`${url_optionsTable_symbol_type}${symbol}/${type}`)
        .then((response) => {
          setOptionsData(response.data.lines);
        })
        .catch((error) => {
          console.log("get options table error", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { formattedQuote, formattedOscilation } = useMemo(() => {
    const formatted = {
      formattedQuote: "0,00",
      formattedOscilation: "0,00%",
    };

    if (symbolData) {
      formatted.formattedQuote = formatarNumDecimal(symbolData.last);
      formatted.formattedOscilation =
        formatarNumDecimal(symbolData.oscilation) + "%";
    }

    return formatted;
  }, [symbolData]);

  return (
    <DraggablePopup
      popupDivKey="optionsTable"
      popupVisibility={isOpenOptionsTable}
    >
      <div id="optionsTable">
        <div className="mcontent">
          <PopupHeader headerTitle="Matriz de Opções" onClose={onClose} />

          <div className="searchRow">
            <InputGroup>
              <Form.Control
                className="inputWithSearchIcon"
                type="text"
                name="symbol"
                value={symbol}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    handleSearchOptions();
                  }
                }}
                onChange={handleInputChange}
              />
              <InputGroup.Append>
                <span
                  className="input-group-text appendedSearchIcon divClicavel"
                  onClick={handleSearchOptions}
                >
                  {fetchingAPI ? (
                    <Spinner animation="border" variant="light" size="sm" />
                  ) : (
                    <GrFormSearch size={28} />
                  )}
                </span>
              </InputGroup.Append>
            </InputGroup>

            <span className="quote">{formattedQuote}</span>
            <span className="oscilation">{formattedOscilation}</span>

            <Form.Check
              custom
              type="radio"
              name="typeRadio"
              onChange={() => setType("CALL")}
              label="CALL"
              checked={type === "CALL"}
            />

            <Form.Check
              custom
              name="typeRadio"
              type="radio"
              label="PUT"
              checked={type === "PUT"}
              onChange={() => setType("PUT")}
            />
          </div>

          <div className="scrollContainer">
            <PerfectScrollbar
              options={{
                maxScrollbarLength: 40,
                minScrollbarLength: 40,
                wheelPropagation: false,
              }}
              id="scrollOptionsTable"
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onMouseMove={onMouseMove}
            >
              <Table striped={false}>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((tableLine, index) => (
                    <tr key={index}>
                      {columns.map((column) => {
                        let value: any = "";

                        if (column.key === "strike") {
                          value = tableLine.strike;
                        } //
                        else if (tableLine[column.key]) {
                          value = tableLine[column.key];
                        }

                        return <td key={column.key}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default OptionsTable;
