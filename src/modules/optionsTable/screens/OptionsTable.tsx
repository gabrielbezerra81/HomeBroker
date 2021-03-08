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
import { TableLine } from "../types/OptionsTableState";
import api from "api/apiConfig";
import { url_optionsTable_symbol_type } from "api/url";
import { Table } from "react-bootstrap";
import { GrFormSearch } from "react-icons/gr";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { usePermissions } from "context/PermissionContext";
import {
  handleColumnHeaderSelectionAction,
  handleLineSelectionAction,
  handleSearchOptionsAction,
  handleSymbolSelectionAction,
  handlSaveSelectionsAction,
  updateOptionsTableStateAction,
} from "../duck/actions/optionsTableActions";
import { Resizable } from "re-resizable";

interface SymbolData {
  last: number;
  oscilation: number;
}

const savedDimensionsPath = "@homebroker:optionsTableDimensions";

const OptionsTable: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isOpenOptionsTable },
    optionsTableReducer: {
      checkedSymbols,
      options,
      checkIntersection,
      checkedLines,
      checkedColumns,
    },
  } = useStateStorePrincipal();

  const { permissions } = usePermissions();

  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<"CALL" | "PUT">("CALL");
  const [symbolData, setSymbolData] = useState<SymbolData | null>(null);
  const [strikeView, setStrikeView] = useState<"code" | "strike">("code");

  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectBloqueado, setSelectBloqueado] = useState(false);

  const [toggleConfig, setToggleConfig] = useState(false);

  const [fetchingAPI, setFetchingAPI] = useState(false);

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenOptionsTable", null, false));
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
      let thresholdX = 20;
      if (diferencaXInicial < 1) {
        diferencaXInicial *= -1;
        thresholdX *= -1;
      }

      let diferencaYInicial = startY - e.pageY;
      let thresholdY = 20;
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

  const handleColumnHeadSelection = useCallback(
    (expiration: string) => {
      dispatch(handleColumnHeaderSelectionAction(expiration));
    },
    [dispatch],
  );

  const handleSearchOptions = useCallback(async () => {
    if (fetchingAPI) {
      return;
    }

    setFetchingAPI(true);

    const data = ((await dispatch(
      handleSearchOptionsAction({ symbol, type }),
    )) as unknown) as SymbolData | null;

    if (data) {
      setSymbolData(data);
    }

    setFetchingAPI(false);
  }, [dispatch, fetchingAPI, symbol, type]);

  const handleLineSelection = useCallback(
    (tableLine: TableLine) => {
      dispatch(handleLineSelectionAction(tableLine));
    },
    [dispatch],
  );

  const handleSymbolSelection = useCallback(
    (symbol: string) => {
      dispatch(handleSymbolSelectionAction([symbol]));
    },
    [dispatch],
  );

  const handleSaveSelections = useCallback(() => {
    dispatch(handlSaveSelectionsAction());
    setToggleConfig(false);
  }, [dispatch]);

  const handleChangeStrikeView = useCallback(() => {
    setStrikeView((currentValue) =>
      currentValue === "code" ? "strike" : "code",
    );
  }, []);

  const saveDimensionsOnResizeStop = useCallback(
    (e, d, element: HTMLElement) => {
      const dimensions = {
        height: element.clientHeight,
        width: element.clientWidth,
      };

      localStorage.setItem(savedDimensionsPath, JSON.stringify(dimensions));
    },
    [],
  );

  const handleChangeIntersectionMode = useCallback(() => {
    dispatch(
      updateOptionsTableStateAction({ checkIntersection: !checkIntersection }),
    );
  }, [checkIntersection, dispatch]);

  const handleToggleConfig = useMemo(() => {
    if (permissions.optionsTable.checkSymbols) {
      return () => {
        setToggleConfig((oldValue) => !oldValue);
      };
    }

    return undefined;
  }, [permissions.optionsTable.checkSymbols]);

  const columns = useMemo(() => {
    let expirationDates: moment.Moment[] = [];

    options.forEach((optionLine) => {
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
  }, [options]);

  const tableData = useMemo(() => {
    const tableData: TableLine[] = options.map((optionItem) => {
      const tableLine = {
        strike: optionItem.strikeLine,
      };

      optionItem.stocks.forEach((stockItem) => {
        const [expiration] = stockItem.endBusiness.split(" ");
        Object.assign(tableLine, {
          [expiration]: {
            symbol: stockItem.symbol,
            strike: stockItem.strike,
          },
        });
      });

      return tableLine;
    });

    return tableData;
  }, [options]);

  const saveConfigClass = useMemo(() => {
    if (toggleConfig) {
      return "";
    }

    return "hidden";
  }, [toggleConfig]);

  const popupDimensions = useMemo(() => {
    const dimensions = localStorage.getItem(savedDimensionsPath);

    if (dimensions) {
      return JSON.parse(dimensions) as { width: number; height: number };
    }

    return {
      width: 1100,
      height: 605,
    };
  }, []);

  // Obter tabela inicial
  useEffect(() => {
    // const table = localStorage.getItem("optionsTable");
    // if (table) {
    //   dispatch(updateOptionsTableStateAction({ options: JSON.parse(table) }));
    // }
    // if (symbol) {
    //   api
    //     .get(`${url_optionsTable_symbol_type}${symbol}/${type}`)
    //     .then((response) => {
    //       dispatch(
    //         updateOptionsTableStateAction({ options: response.data.lines }),
    //       );
    //       localStorage.setItem(
    //         "optionsTable",
    //         JSON.stringify(response.data.lines),
    //       );
    //     })
    //     .catch((error) => {
    //       console.log("get options table error", error);
    //     });
    // }
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
      <Resizable
        defaultSize={popupDimensions}
        minWidth={620}
        minHeight={200}
        maxHeight={1500}
        style={{ position: "absolute" }}
        onResizeStop={saveDimensionsOnResizeStop}
      >
        <div id="optionsTable">
          <div className="mcontent">
            <PopupHeader
              headerTitle="Matriz de Opções"
              onClose={onClose}
              onConfig={handleToggleConfig}
              onStrikeViewChange={handleChangeStrikeView}
            />

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

              {toggleConfig && (
                <Form.Check
                  custom
                  checked={checkIntersection}
                  type="checkbox"
                  label="Marcar intersecção"
                  onChange={handleChangeIntersectionMode}
                />
              )}

              <button
                className={`brokerCustomButton saveConfigButton ${saveConfigClass}`}
                onClick={handleSaveSelections}
              >
                Salvar Configuração
              </button>
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
                        <th key={column.key}>
                          {toggleConfig && column.key !== "strike" && (
                            <Form.Check
                              custom
                              checked={checkedColumns.includes(column.title)}
                              type="checkbox"
                              label=""
                              onChange={() =>
                                handleColumnHeadSelection(column.title)
                              }
                            />
                          )}

                          {column.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((tableLine, lineIndex) => (
                      <tr key={lineIndex}>
                        {columns.map((column, columnIndex) => {
                          const columnData = tableLine[column.key];

                          if (column.key === "strike") {
                            const value = columnData;

                            const isChecked = checkedLines.includes(value);

                            return (
                              <td key={value}>
                                <div>
                                  {value && toggleConfig && (
                                    <Form.Check
                                      custom
                                      checked={isChecked}
                                      type="checkbox"
                                      label=""
                                      onChange={() =>
                                        handleLineSelection(tableLine)
                                      }
                                    />
                                  )}
                                  <span>{value}</span>
                                </div>
                              </td>
                            );
                          } //
                          else if (columnData) {
                            const value =
                              strikeView === "code"
                                ? columnData.symbol
                                : columnData.strike;

                            const isChecked = checkedSymbols.includes(
                              columnData.symbol,
                            );

                            return (
                              <td key={column.key}>
                                <div>
                                  <span>{value}</span>
                                  {value && toggleConfig && (
                                    <Form.Check
                                      custom
                                      checked={isChecked}
                                      type="checkbox"
                                      label=""
                                      onChange={() =>
                                        handleSymbolSelection(columnData.symbol)
                                      }
                                    />
                                  )}
                                </div>
                              </td>
                            );
                          }

                          return <td key={`${lineIndex}${columnIndex}`} />;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </Resizable>
    </DraggablePopup>
  );
};

export default OptionsTable;
