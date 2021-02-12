import React, { useCallback, useMemo } from "react";

import { Form, InputGroup, Table } from "react-bootstrap";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

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

import closeIcon from "assets/closeIcon.png";

import SymbolCard from "../SymbolCard";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { IoMdRepeat } from "react-icons/io";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface Props {
  multiBox: MultiBoxData;
}

const Tab2Position: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { id, strikeViewMode, symbolInput, stockSymbolData } = multiBox;

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

  return (
    <div className="multiBoxTab2">
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
