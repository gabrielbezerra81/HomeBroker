import React, { useCallback, useMemo } from "react";
import { Form, Table, Spinner } from "react-bootstrap";
import { Select } from "antd";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

import { FaCaretDown } from "react-icons/fa";

import { IoMdRepeat } from "react-icons/io";

import cBuyIcon from "assets/multiBox/cBuyIcon.png";
import pSellIcon from "assets/multiBox/pSellIcon.png";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";

import zoomIcon from "assets/multiBox/zoomIcon.png";
import MultiBoxOffer from "./MultiBoxOffer";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  updateBoxAttrAction,
  handleExportBoxToMultilegAction,
} from "modules/multiBox/duck/actions/multiBoxActions";
import { formatExpiration } from "shared/utils/Formatacoes";
import {
  getUpdatedOptionsWhenExpirationChanges,
  handleAddOptionOfferAction,
  handleAddStockOfferAction,
  handleSearchBoxSymbolOptionsAction,
  handleConcludeTab5Action,
} from "modules/multiBox/duck/actions/tab5Actions";

import closeIcon from "assets/multiBox/closeIcon.png";

interface Props {
  multiBox: MultiBoxData;
}

const Tab5IncludeStructure: React.FC<Props> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    symbolInput,
    selectedStrike,
    selectedExpiration,
    expirations,
    stockOptions,
    id,
    strikeViewMode,
    stockSymbol,
    loadingAPI,
  } = multiBox;

  const handleInputChange = useCallback(
    async (e) => {
      const { name } = e.currentTarget;

      let value = e.currentTarget.value;

      const payload = {};

      if (name === "selectedStrike") {
        value = Number(value);
      } else if (name === "symbolInput") {
        value = value.toLocaleUpperCase();
      } //
      else if (name === "selectedExpiration") {
        const data = await getUpdatedOptionsWhenExpirationChanges({
          stockSymbol,
          selectedStrike,
          selectedExpiration: value,
        });
        Object.assign(payload, data);
      }

      Object.assign(payload, {
        [name]: value,
      });

      dispatch(updateBoxAttrAction(id, payload));
    },
    [dispatch, id, selectedStrike, stockSymbol],
  );

  const handleSearchStock = useCallback(() => {
    dispatch(handleAddStockOfferAction(id, symbolInput));
  }, [dispatch, id, symbolInput]);

  const handleSearchOptions = useCallback(() => {
    dispatch(handleSearchBoxSymbolOptionsAction(id, symbolInput));
  }, [dispatch, id, symbolInput]);

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

  const handleCall = useCallback(() => {
    dispatch(handleAddOptionOfferAction(id, "CALL"));
  }, [dispatch, id]);

  const handlePut = useCallback(() => {
    dispatch(handleAddOptionOfferAction(id, "PUT"));
  }, [dispatch, id]);

  const handleStrikeViewChange = useCallback(() => {
    const viewMode = strikeViewMode === "code" ? "strike" : "code";

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        strikeViewMode: viewMode,
      }),
    );
  }, [dispatch, multiBox.id, strikeViewMode]);

  const handleConclude = useCallback(() => {
    dispatch(handleConcludeTab5Action(id));
  }, [dispatch, id]);

  const strikeOptions = useMemo(() => {
    const dropdownOptions = stockOptions.map((option, index) => {
      if (index % 2 !== 0) {
        return null;
      }

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
      return (
        <option key={expiration} value={expiration}>
          {formattedExpiration}
        </option>
      );
    });
  }, [expirations]);

  return (
    <div className="multiBoxTab5">
      <header className="boxContentHeader">
        <Form.Control
          className="darkSimpleInput"
          name="symbolInput"
          value={symbolInput}
          onChange={handleInputChange}
          onKeyPress={(event: any) => {
            //event.preventDefault();
            if (event.key === "Enter") {
              handleSearchOptions();
            }
          }}
        />

        <button className="brokerCustomButton" onClick={handleSearchStock}>
          <img src={zoomIcon} alt="" />
        </button>
        <div className="searchOptionsButton">
          <button className="brokerCustomButton" onClick={handleSearchOptions}>
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
      </header>

      <div className="strikeDateRow">
        <Form.Group>
          <Form.Label>Strike</Form.Label>
          <Select
            className="strikeSelect optionStrikeSelect"
            value={selectedStrike || ""}
            onChange={(value: any) => {
              handleInputChange({
                currentTarget: {
                  name: "selectedStrike",
                  value,
                },
              });
            }}
            dropdownClassName="strikeSelectDropdown"
            size="small"
            showSearch
            optionFilterProp="children"
            notFoundContent={
              strikeOptions.length > 0
                ? "Código não encontrado"
                : "Pesquise um ativo"
            }
            suffixIcon={<FaCaretDown color="#ddd" />}
          >
            {strikeOptions}
          </Select>
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
              <th></th>
              <th>C/V</th>
              <th>Qtde</th>
              <th>
                Strike
                <button
                  className="brokerCustomButton"
                  onClick={handleStrikeViewChange}
                >
                  <IoMdRepeat size={17} color="#C4C4C4" />
                </button>
              </th>
              <th>Vencimento</th>
              <th>Tipo</th>
              <th>Modelo</th>
            </tr>
          </thead>
          <tbody>
            {multiBox.boxOffers.map((offer, index) => (
              <MultiBoxOffer
                data={offer}
                strikeViewMode={strikeViewMode}
                key={index}
                boxId={id}
                offerIndex={index}
              />
            ))}
          </tbody>
        </Table>
      </div>
      <button
        onClick={handleConclude}
        className="brokerCustomButton finishButton"
      >
        {loadingAPI ? (
          <Spinner as="span" animation="border" size="sm" variant="light" />
        ) : (
          "Concluir"
        )}
      </button>
    </div>
  );
};

export default Tab5IncludeStructure;
