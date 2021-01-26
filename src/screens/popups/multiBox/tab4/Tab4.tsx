import React, { useCallback } from "react";
import { Form, Table } from "react-bootstrap";
import { MultiBoxData } from "types/multiBox/MultiBoxState";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

interface Props {
  multiBox: MultiBoxData;
}

const Tab4: React.FC<Props> = ({ multiBox }) => {
  const handleSearch = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {}, []);

  const handleConfig = useCallback(() => {}, []);

  return (
    <div className="multiBoxTab4">
      <header>
        <div>
          <h4>PETR4</h4>
          <span className="quote">12,21</span>
          <span className="oscilation">+2,5%</span>
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
    </div>
  );
};

export default Tab4;
