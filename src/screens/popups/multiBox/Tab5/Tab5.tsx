import React, { useCallback, useMemo } from "react";
import { Form, Table } from "react-bootstrap";
import { Select } from "antd";

import { MultiBoxData } from "types/multiBox/MultiBoxState";

import { IoMdRepeat } from "react-icons/io";

import cBuyIcon from "assets/multiBox/cBuyIcon.png";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import pSellIcon from "assets/multiBox/pSellIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import MultiBoxOffer from "./MultiBoxOffer";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateBoxAttrAction } from "redux/actions/multiBox/multiBoxActions";
import { formatExpiration } from "shared/utils/Formatacoes";
import { handleSearchBoxSymbolAction } from "redux/actions/multiBox/tab5Actions";

interface Props {
  multiBox: MultiBoxData;
}

const Tab5: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { strikeViewMode },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const {
    symbolInput,
    selectedStrike,
    selectedExpiration,
    expirations,
    stockOptions,
    id,
  } = multiBox;

  const handleInputChange = useCallback(
    (e) => {
      const { name } = e.currentTarget;

      let value = e.currentTarget.value;

      if (name === "selectedStrike") {
        value = Number(value);
      } else if (name === "symbolInput") {
        value = value.toLocaleUpperCase();
      }

      dispatch(
        updateBoxAttrAction(multiBox.id, {
          [name]: value,
        }),
      );
    },
    [dispatch, multiBox.id],
  );

  const handleSearch = useCallback(() => {
    dispatch(handleSearchBoxSymbolAction(id, symbolInput));
  }, [dispatch, id, symbolInput]);

  const handleBuy = useCallback(() => {}, []);

  const handleSell = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {}, []);

  const handleConfig = useCallback(() => {}, []);

  const handleCall = useCallback(() => {}, []);

  const handlePut = useCallback(() => {}, []);

  const handleStrikeViewChange = useCallback(() => {}, []);

  const strikeOptions = useMemo(() => {
    const dropdownOptions = stockOptions
      .filter((_, index) => index % 2 === 0)
      .map((option, index) => {
        const label =
          option.type === "CALL"
            ? option.symbol +
              " " +
              option.strike +
              " " +
              stockOptions[index + 1].symbol
            : stockOptions[index + 1].symbol +
              " " +
              option.strike +
              " " +
              option.symbol;

        return (
          <Select.Option
            className="tab5StrikeOption"
            key={option.strike}
            value={option.strike}
          >
            {label}
          </Select.Option>
        );
      });

    return dropdownOptions;
  }, [stockOptions]);

  const expirationOptions = useMemo(() => {
    return expirations.map((expiration) => {
      const formattedExpiration = formatExpiration(expiration);
      return <option value={expiration}>{formattedExpiration}</option>;
    });
  }, [expirations]);

  return (
    <div className="multiBoxTab5">
      <header>
        <Form.Control
          className="darkSimpleInput"
          name="symbolInput"
          value={symbolInput}
          onChange={handleInputChange}
          onKeyPress={(event: any) => {
            //event.preventDefault();
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
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
          <Form.Control
            as="select"
            className="darkInputSelect"
            name="selectedExpiration"
            value={selectedExpiration}
            onChange={handleInputChange}
          ></Form.Control>
          {/* <Select
            className="darkInputSelect"
            // name="selectedStrike"
            value={selectedStrike || ""}
            onChange={handleInputChange}
          >
            {strikeOptions}
          </Select> */}
        </Form.Group>
        <Form.Group>
          <Form.Label>Vencimento</Form.Label>
          <Form.Control
            as="select"
            className="darkInputSelect"
            name="selectedExpiration"
            value={selectedExpiration}
            onChange={handleInputChange}
          >
            {expirationOptions}
          </Form.Control>
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
              <th>
                Strike
                <button
                  className="brokerCustomButton"
                  onClick={handleStrikeViewChange}
                >
                  <IoMdRepeat color="#C4C4C4" />
                </button>
              </th>
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
