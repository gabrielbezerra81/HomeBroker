import React, { useCallback } from "react";
import { Form, Table } from "react-bootstrap";
import { MultiBoxData } from "types/multiBox/MultiBoxState";

import cBuyIcon from "assets/multiBox/cBuyIcon.png";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import pSellIcon from "assets/multiBox/pSellIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import MultiBoxOffer from "./MultiBoxOffer";

interface Props {
  multiBox: MultiBoxData;
}

const Tab5: React.FC<Props> = ({ multiBox }) => {
  const handleSearch = useCallback(() => {}, []);

  const handleBuy = useCallback(() => {}, []);

  const handleSell = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {}, []);

  const handleConfig = useCallback(() => {}, []);

  const handleCall = useCallback(() => {}, []);

  const handlePut = useCallback(() => {}, []);

  return (
    <div className="multiBoxTab5">
      <header>
        <Form.Control className="darkSimpleInput" />
        <button className="brokerCustomButton" onClick={handleSearch}>
          <img src={zoomIcon} alt="" />
        </button>
        <div className="buySellButton" onClick={handleBuy}>
          <button className="brokerCustomButton">
            <img src={cBuyIcon} alt="" />
          </button>
          <button className="brokerCustomButton" onClick={handleSell}>
            <img src={pSellIcon} alt="" />
          </button>
        </div>
        <button className="brokerCustomButton" onClick={handleOpenInMultileg}>
          <img className="openInNewIcon" src={openInNewIcon} alt="" />
        </button>

        <button className="brokerCustomButton" onClick={handleConfig}>
          <img src={cogIcon} alt="" />
        </button>
      </header>

      <div className="strikeDateRow">
        <Form.Group>
          <Form.Label>Strike</Form.Label>
          <Form.Control className="darkSimpleInput" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Vencimento</Form.Label>
          <Form.Control className="darkSimpleInput" />
        </Form.Group>
        <div className="callPutContainer">
          <button className="brokerCustomButton" onClick={handleCall}>
            + Call
          </button>
          <button className="brokerCustomButton" onClick={handlePut}>
            + Put
          </button>
        </div>
      </div>

      <div className="offersContainer">
        <Table borderless striped={false}>
          <thead>
            <tr>
              <th>C/V</th>
              <th>Qtde</th>
              <th>Strike</th>
              <th>Vencimento</th>
              <th>Tipo</th>
              <th>Modelo</th>
            </tr>
          </thead>
          <tbody>
            <MultiBoxOffer />
            <MultiBoxOffer />
            <MultiBoxOffer />
            <MultiBoxOffer />
          </tbody>
        </Table>
      </div>
      <button className="brokerCustomButton finishButton">Concluir</button>
    </div>
  );
};

export default Tab5;
