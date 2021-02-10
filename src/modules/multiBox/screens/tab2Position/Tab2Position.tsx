import React, { useCallback, useMemo } from "react";

import { Table } from "react-bootstrap";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import CustomInput from "shared/componentes/CustomInput";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  handleExportBoxToMultilegAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/multiBox/closeIcon.png";

import SymbolCard from "../SymbolCard";

interface Props {
  multiBox: MultiBoxData;
}

const Tab2Position: React.FC<Props> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const { id, strikeViewMode } = multiBox;

  const handleSearch = useCallback(() => {}, []);

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

  const oscilation = 2;

  const oscilationClass = useMemo(() => {
    // if (!refStockData) {
    //   return "";
    // }

    if (oscilation > 0) {
      return "positiveText";
    } else if (oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, []);

  return (
    <div className="multiBoxTab2">
      <header>
        <div>
          <h4>{"PETR4"}</h4>
          <span className="quote">{"26,32"}</span>
          <span className={`oscilation ${oscilationClass}`}>{"+2,5%"}</span>
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
            <th>Código</th>
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
