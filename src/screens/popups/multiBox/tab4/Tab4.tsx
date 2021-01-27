import React, { useCallback, useMemo } from "react";
import { Form, Table } from "react-bootstrap";

import { IoMdRepeat } from "react-icons/io";

import { MultiBoxData } from "types/multiBox/MultiBoxState";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import SymbolCard from "./SymbolCard";

interface Props {
  multiBox: MultiBoxData;
}

const Tab4: React.FC<Props> = ({ multiBox }) => {
  const handleSearch = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {}, []);

  const handleConfig = useCallback(() => {}, []);

  const osc = 2;

  const oscilationClass = useMemo(() => {
    if (osc > 0) {
      return "positiveText";
    } else if (osc < 0) {
      return "negativeText";
    }

    return "";
  }, [osc]);

  return (
    <div className="multiBoxTab4">
      <header>
        <div>
          <h4>PETR4</h4>
          <span className="quote">12,21</span>
          <span className={`oscilation ${oscilationClass}`}>+2,5%</span>
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
              <button className="brokerCustomButton">
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
          <tr>
            <td className="buyColor">+1</td>
            <td>
              <SymbolCard
                data={{
                  code: "L260",
                  offerType: "C",
                  model: "AMERICAN",
                  strike: "",
                  viewMode: "code",
                  dueDate: "25d",
                }}
              />
            </td>
            <td>12,21</td>
            <td>100k</td>
            <td>12,21</td>
            <td>12,21</td>
            <td>100k</td>
          </tr>
          <tr>
            <td className="sellColor">-1</td>
            <td>
              <SymbolCard
                data={{
                  code: "L260",
                  offerType: "V",
                  model: "EUROPEAN",
                  strike: "26,00",
                  viewMode: "code",
                  dueDate: "25d",
                }}
              />
            </td>
            <td>12,21</td>
            <td>100k</td>
            <td>12,21</td>
            <td>12,21</td>
            <td>100k</td>
          </tr>
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
          min={0.0}
          max={1.8}
          onChange={(event) => {}}
        />
        <div>
          <span>12,21</span>
          <span>12,21</span>
          <span>12,21</span>
        </div>
      </div>
    </div>
  );
};

export default Tab4;
