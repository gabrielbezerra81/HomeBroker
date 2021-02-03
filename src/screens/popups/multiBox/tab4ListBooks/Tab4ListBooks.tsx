import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";

import { IoMdRepeat } from "react-icons/io";

import {
  FormattedSingleBook,
  MultiBoxData,
  SingleBook,
  TopSymbol,
} from "types/multiBox/MultiBoxState";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import SymbolCard from "../SymbolCard";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import {
  getOneSymbolDataAPI,
  getStockInfoAPI,
  getSymbolInfoAPI,
  getSymbolsDataAPI,
} from "api/symbolAPI";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { updateBoxAttrAction } from "redux/actions/multiBox/multiBoxActions";

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
  const dispatch = useDispatchStorePrincipal();

  const [refStockData, setRefStockData] = useState<RefStockData | null>(null);
  const [tab4Data, setTab4Data] = useState<Tab4Data[]>([]);

  const dispatchGlobal = useDispatchGlobalStore();

  const { zIndex } = useStateGlobalStore();

  const { strikeViewMode } = multiBox;

  const handleSearch = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {
    // dispatch(
    //   handleExportBoxToMultilegAction({
    //     boxId: multiBox.id,
    //     globalProps: {
    //       dispatchGlobal,
    //       zIndex,
    //     },
    //   }),
    // );
  }, []);

  const handleConfig = useCallback(() => {}, []);

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

  // Obtem reference stock
  useEffect(() => {
    async function getReferenceStock() {
      const symbol = multiBox.topSymbols.length
        ? multiBox.topSymbols[0].code
        : "";

      if (!symbol) {
        return;
      }

      const data = await getSymbolInfoAPI(symbol);

      if (data) {
        const { isOption } = data;

        let stockSymbol = "";

        if (isOption && data.referenceStock) {
          const { symbol: searchSymbol } =
            (await getStockInfoAPI(data.referenceStock)) || {};

          stockSymbol = searchSymbol || "";
        } //
        else {
          stockSymbol = symbol;
        }

        if (stockSymbol) {
          const data = await getOneSymbolDataAPI(stockSymbol);

          if (data) {
            const stockData: RefStockData = {
              symbol: stockSymbol,
              last: data.ultimo,
              min: data.minimo,
              max: data.maximo,
              oscilation: data.oscilacao,
            };

            setRefStockData(stockData);
          }
        }
      }
    }

    getReferenceStock();
  }, [multiBox.topSymbols]);

  const oscilationClass = useMemo(() => {
    if (!refStockData) {
      return "";
    }

    if (refStockData.oscilation > 0) {
      return "positiveText";
    } else if (refStockData.oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, [refStockData]);

  const formattedTab4Data = useMemo(() => {
    return tab4Data.map((item) => {
      let formattedQtty = item.offerType === "C" ? "+" : "-";
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
    if (!refStockData) {
      return null;
    }

    const { oscilation, min, max, last } = refStockData;

    let formattedOscilation = "";

    if (oscilation > 0) {
      formattedOscilation += "+";
    } //
    else if (oscilation < 0) {
      formattedOscilation += "-";
    }

    formattedOscilation += formatarNumDecimal(oscilation || 0) + "%";

    const medium = (max + min) / 2;

    const formattedMedium = formatarNumDecimal(medium, 3);

    return {
      ...refStockData,
      formattedLast: formatarNumDecimal(last),
      formattedOscilation,
      formattedMin: formatarNumDecimal(min),
      formattedMax: formatarNumDecimal(max),
      medium,
      formattedMedium,
    };
  }, [refStockData]);

  console.log(refStockData);

  if (!refStockData || !formattedRefStockData) {
    return <div></div>;
  }

  return (
    <div className="multiBoxTab4">
      <header>
        <div>
          <h4>{refStockData?.symbol}</h4>
          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className={`oscilation ${oscilationClass}`}>
            {formattedRefStockData?.formattedOscilation}
          </span>
        </div>
        <div>
          <button className="brokerCustomButton" onClick={handleSearch}>
            <img src={zoomIcon} alt="" />
          </button>

          <button className="brokerCustomButton" onClick={handleOpenInMultileg}>
            <img className="openInNewIcon" src={openInNewIcon} alt="" />
          </button>

          <button className="brokerCustomButton" onClick={handleConfig}>
            <img src={cogIcon} alt="" />
          </button>
        </div>
      </header>

      <Table borderless striped={false}>
        <thead>
          <tr>
            <th colSpan={3}></th>
            <th colSpan={4} className="yellowColumns">
              Book
            </th>
          </tr>
          <tr>
            <th className="yellowColumns">Qtde</th>
            <th className="yellowColumns">
              Strike
              <button
                onClick={handleStrikeViewChange}
                className="brokerCustomButton"
              >
                <IoMdRepeat color="#C4C4C4" />
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
              <td className="buyColor">{item.formattedQtty}</td>
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

      <div className="tab4InputRangeContainer">
        <div>
          <span>Mín</span>
          <span>Médio</span>
          <span>Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range tab4InputRange`}
          step="0.01"
          min={refStockData?.min}
          max={refStockData?.max}
          onChange={(event) => {}}
        />
        <div>
          <span>{formattedRefStockData?.formattedMin}</span>
          <span>{formattedRefStockData?.formattedMedium}</span>
          <span>{formattedRefStockData?.formattedMax}</span>
        </div>
      </div>
    </div>
  );
};

export default Tab4ListBooks;
