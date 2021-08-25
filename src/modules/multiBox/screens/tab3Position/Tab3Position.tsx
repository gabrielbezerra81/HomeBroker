import React, { useCallback, useMemo, useState } from "react";

import { Form, InputGroup, Spinner, Table } from "react-bootstrap";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  handleExportBoxToMultilegAction,
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/closeIcon.png";

import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { IoMdRepeat } from "react-icons/io";
import getSymbolExpirationInDays from "shared/utils/getSymbolExpirationInDays";
import PositionTableItem from "./PositionTableItem";
import { handleSaveBoxPositionsAction } from "modules/multiBox/duck/actions/tab3PositionActions";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface Props {
  multiBox: MultiBoxData;
}

const Tab3Position: React.FC<Props> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multiBoxReducer: { stockSymbolsData },
  } = useStateStorePrincipal();

  const {
    id,
    strikeViewMode,
    symbolInput,
    searchedSymbol,
    boxPositions,
    toggleShowId,
  } = multiBox;

  const stockSymbolData = useMemo(() => {
    return stockSymbolsData.find((data) => data.symbol === searchedSymbol);
  }, [searchedSymbol, stockSymbolsData]);

  const [savingPositions, setSavingPositions] = useState(false);

  const handleSymbolChange = useCallback(
    (e) => {
      let value = e.currentTarget.value;

      value = value.toLocaleUpperCase();

      dispatch(updateBoxAttrAction(id, { symbolInput: value }));
    },
    [dispatch, id],
  );

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

  const handleStrikeViewChange = useCallback(() => {
    const viewMode = strikeViewMode === "code" ? "strike" : "code";

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        strikeViewMode: viewMode,
      }),
    );
  }, [dispatch, multiBox.id, strikeViewMode]);

  const handleSearchStock = useCallback(() => {
    dispatch(
      updateBoxAttrAction(multiBox.id, {
        activeTab: "5",
      }),
    );
  }, [dispatch, multiBox.id]);

  const handleSavePositions = useCallback(async () => {
    setSavingPositions(true);

    await dispatch(handleSaveBoxPositionsAction(id));

    setSavingPositions(false);
  }, [dispatch, id]);

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

  const formattedBoxPositions = useMemo(() => {
    return boxPositions?.map((position) => ({
      ...position,
      formattedExpiration: getSymbolExpirationInDays(
        position.stock.endBusiness,
      ),
      formattedSymbol: position.symbol.substr(4),
    }));
  }, [boxPositions]);

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

  return (
    <div className="multiBoxTab2">
      <header className="boxContentHeader">
        <div className="searchRow">
          <InputGroup>
            <Form.Control
              className="inputWithSearchIcon"
              name="symbolInput"
              value={symbolInput}
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
            {/* <th>Ordens exec.</th> */}
          </tr>
        </thead>
        <tbody>
          {formattedBoxPositions?.map((position, index) => (
            <PositionTableItem
              key={index}
              multiBox={multiBox}
              position={position}
              positionIndex={index}
            />
          ))}
        </tbody>
      </Table>

      <button
        className="brokerCustomButton saveButton"
        onClick={handleSavePositions}
      >
        {savingPositions ? (
          <Spinner animation="border" variant="light" size="sm" />
        ) : (
          "Salvar"
        )}
      </button>
    </div>
  );
};

export default Tab3Position;
