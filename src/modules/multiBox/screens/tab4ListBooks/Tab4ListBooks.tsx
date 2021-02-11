import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";

import { IoMdRepeat } from "react-icons/io";

import {
  FormattedSingleBook,
  MultiBoxData,
  SingleBook,
  TopSymbol,
} from "modules/multiBox/types/MultiBoxState";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import SymbolCard from "../SymbolCard";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { getSymbolsDataAPI } from "api/symbolAPI";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
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

interface Tab4Data extends TopSymbol {
  book: SingleBook | null;
  last: number | null;
}

interface RefStockData {
  symbol: string;
  last: number;
  oscilation: number;
  min: number;
  max: number;
}

const Tab4ListBooks: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const [tab4Data, setTab4Data] = useState<Tab4Data[]>([]);

  const { strikeViewMode, id, stockSymbolData, symbolInput } = multiBox;

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

  // Obtém dados da tabela (tab4Data)
  useEffect(() => {
    async function loadData() {
      const symbols = multiBox.topSymbols
        .map((topSymbol) => topSymbol.code)
        .join(",");

      const symbolsData = await getSymbolsDataAPI(symbols);

      const data: Tab4Data[] = multiBox.topSymbols.map((topSymbol) => {
        const symbolData = symbolsData.find(
          (data) => data.symbol === topSymbol.code,
        );

        let book = null;
        let last = null;

        if (symbolData) {
          book = {
            buy: {
              qtty: symbolData.compraQtde,
              price: symbolData.compra,
            },
            sell: {
              qtty: symbolData.vendaQtde,
              price: symbolData.venda,
            },
          };
          last = symbolData.ultimo;
        }

        return { ...topSymbol, book, last };
      });

      setTab4Data(data);
    }

    loadData();
  }, [multiBox.topSymbols]);

  const formattedTab4Data = useMemo(() => {
    return tab4Data.map((item) => {
      let formattedQtty = item.offerType === "C" ? "+" : "";
      formattedQtty += `${item.qtty}`;

      const formattedLast = item.last ? formatarNumDecimal(item.last) : "";

      const formattedBook = item.book as FormattedSingleBook;

      if (formattedBook && item.book) {
        formattedBook.buy.formattedQtty = formatarQuantidadeKMG(
          item.book.buy.qtty,
        );
        formattedBook.buy.formattedPrice = formatarNumDecimal(
          item.book.buy.price,
        );

        formattedBook.sell.formattedQtty = formatarQuantidadeKMG(
          item.book.sell.qtty,
        );
        formattedBook.sell.formattedPrice = formatarNumDecimal(
          item.book.sell.price,
        );
      }

      return {
        ...item,
        formattedQtty,
        formattedLast,
        formattedBook,
        viewMode: strikeViewMode,
      };
    }, []);
  }, [strikeViewMode, tab4Data]);

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

  if (!stockSymbolData || !formattedRefStockData) {
    return <div></div>;
  }

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

          <span className="quote">{formattedRefStockData.formattedLast}</span>
          <span className="oscilation">
            {formattedRefStockData.formattedOscilation}
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
          {formattedTab4Data.map((item, index) => (
            <tr key={index}>
              {/* <td className={item.offerType === "C" ? "buyColor" : "sellColor"}>
                {item.formattedQtty}
              </td> */}
              <td className="strikeColumn">
                <SymbolCard data={item} />
              </td>
              <td>{item.formattedLast}</td>
              <td>{item.formattedBook?.buy.formattedQtty}</td>
              <td>{item.formattedBook?.buy.formattedPrice}</td>
              <td>{item.formattedBook?.sell.formattedPrice}</td>
              <td>{item.formattedBook?.sell.formattedQtty}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Tab4ListBooks;
