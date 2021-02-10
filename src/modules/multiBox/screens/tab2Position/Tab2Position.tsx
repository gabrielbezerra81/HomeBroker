import React, { useCallback, useMemo } from "react";

import { Table } from "react-bootstrap";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

import cBuyIcon from "assets/multiBox/cBuyIcon.png";
import pSellIcon from "assets/multiBox/pSellIcon.png";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import CustomInput from "shared/componentes/CustomInput";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  handleExportBoxToMultilegAction,
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/multiBox/closeIcon.png";

import SymbolCard from "../SymbolCard";
import {
  handleAddStockOfferAction,
  handleSearchBoxSymbolOptionsAction,
} from "modules/multiBox/duck/actions/tab5Actions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { IoMdRepeat } from "react-icons/io";

interface Props {
  multiBox: MultiBoxData;
}

const Tab2Position: React.FC<Props> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const { id, strikeViewMode, symbolInput, stockSymbolData } = multiBox;

  const handleSearchStock = useCallback(() => {
    dispatch(handleAddStockOfferAction(id, symbolInput));
  }, [dispatch, id, symbolInput]);

  const handleSearchOptions = useCallback(() => {
    dispatch(handleSearchBoxSymbolOptionsAction(id, symbolInput));
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

  // const handleQttyChange = useCallback(
  //   (value) => {
  //     dispatch(
  //       updateBoxAttrAction(id, {
  //         price: value,
  //       }),
  //     );
  //   },
  //   [dispatch, id],
  // );

  const oscilationClass = useMemo(() => {
    if (!stockSymbolData) {
      return "";
    }

    if (stockSymbolData?.oscilation > 0) {
      return "positiveText";
    } else if (stockSymbolData?.oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, [stockSymbolData]);

  return (
    <div className="multiBoxTab2">
      <header className="boxContentHeader">
        <div>
          <h4>{stockSymbolData?.symbol}</h4>
          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className={`oscilation ${oscilationClass}`}>
            {formattedRefStockData?.formattedOscilation}
          </span>
        </div>
        <div>
          <button className="brokerCustomButton" onClick={handleSearchStock}>
            <img src={zoomIcon} alt="" />
          </button>

          <div className="searchOptionsButton">
            <button
              className="brokerCustomButton"
              onClick={handleSearchOptions}
            >
              <img src={cBuyIcon} alt="" />
              <img src={pSellIcon} alt="" />
            </button>
          </div>

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
          step="0.01"
          min={stockSymbolData?.min}
          max={stockSymbolData?.max}
          onChange={(event) => {}}
        />
        <div>
          <span>{formattedRefStockData?.formattedMin}</span>
          <span>{formattedRefStockData?.formattedMedium}</span>
          <span>{formattedRefStockData?.formattedMax}</span>
        </div>
      </div>

      <div className="titleContainer">
        <h6>Posição</h6>
      </div>

      <Table borderless striped={false}>
        <thead>
          <tr>
            <th>
              Código
              <button
                onClick={handleStrikeViewChange}
                className="brokerCustomButton"
              >
                <IoMdRepeat size={17} color="#C4C4C4" />
              </button>
            </th>
            <th>Qtde</th>
            <th>Preço méd.</th>
            <th>Ordens exec.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <SymbolCard
                data={{
                  code: "L260",
                  strike: 26,
                  expiration: "25d",
                  model: "EUROPEAN",
                  offerType: "C",
                  qtty: 1,
                  type: "PUT",
                  viewMode: strikeViewMode,
                }}
              />
            </td>
            <td className="qttyColumn">
              <CustomInput
                type={"quantidade"}
                step={1}
                autoSelect
                value={""}
                onChange={() => {}}
              />
            </td>
            <td className="avgPriceColumn">
              <div>
                <CustomInput
                  name="price"
                  step={0.01}
                  type="preco"
                  value={""}
                  onChange={() => {}}
                />
              </div>
            </td>
            <td>C 1.8K/25</td>
          </tr>
          <tr>
            <td>
              <SymbolCard
                data={{
                  code: "L260",
                  strike: 26,
                  expiration: "25d",
                  model: "AMERICAN",
                  offerType: "C",
                  qtty: 1,
                  type: "CALL",
                  viewMode: strikeViewMode,
                }}
              />
            </td>
            <td className="qttyColumn">
              <CustomInput
                type={"quantidade"}
                step={1}
                autoSelect
                value={""}
                onChange={() => {}}
              />
            </td>
            <td className="avgPriceColumn">
              <div>
                <CustomInput
                  name="price"
                  step={0.01}
                  type="preco"
                  value={""}
                  onChange={() => {}}
                />
              </div>
            </td>
            <td>C 1.8K/25</td>
          </tr>
        </tbody>
      </Table>

      <button className="brokerCustomButton saveButton">Salvar</button>
    </div>
  );
};

export default Tab2Position;
