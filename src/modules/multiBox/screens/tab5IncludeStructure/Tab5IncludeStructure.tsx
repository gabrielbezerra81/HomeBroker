import React, { useCallback, useMemo, useState } from "react";
import { Form, Table, Spinner, InputGroup } from "react-bootstrap";
import { Select } from "antd";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

import { FaCaretDown } from "react-icons/fa";

import { IoMdRepeat } from "react-icons/io";
import searchOptionsIcon from "assets/multiBox/searchOptionsIcon.png";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";

import MultiBoxOffer from "./MultiBoxOffer";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  updateBoxAttrAction,
  handleExportBoxToMultilegAction,
} from "modules/multiBox/duck/actions/multiBoxActions";
import { formatarNumDecimal, formatExpiration } from "shared/utils/Formatacoes";
import {
  getUpdatedOptionsWhenExpirationChanges,
  handleAddOptionOfferAction,
  handleAddStockOfferAction,
  handleSearchBoxSymbolOptionsAction,
  handleConcludeTab5Action,
} from "modules/multiBox/duck/actions/tab5Actions";

import closeIcon from "assets/closeIcon.png";
import { GrFormSearch } from "react-icons/gr";

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
    stockSymbolData,
    toggleShowId,
  } = multiBox;

  const [searchingSymbolAPI, setSearchingSymbolAPI] = useState(false);
  const [addingStructureAPI, setAddingStructureAPI] = useState(false);

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

  const handleSearchStock = useCallback(async () => {
    setSearchingSymbolAPI(true);

    await dispatch(handleAddStockOfferAction(id, symbolInput));

    setSearchingSymbolAPI(false);
  }, [dispatch, id, symbolInput]);

  const handleSearchOptions = useCallback(async () => {
    setSearchingSymbolAPI(true);

    await dispatch(handleSearchBoxSymbolOptionsAction(id, symbolInput));

    setSearchingSymbolAPI(false);
  }, [dispatch, id, symbolInput]);

  const handleOpenInMultileg = useCallback(() => {
    dispatch(
      handleExportBoxToMultilegAction({
        boxId: id,
      }),
    );
  }, [dispatch, id]);

  const handleConfig = useCallback(() => {
    dispatch(
      updateBoxAttrAction(id, {
        toggleShowId: !toggleShowId,
      }),
    );
  }, [dispatch, id, toggleShowId]);

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

  const handleConclude = useCallback(async () => {
    setAddingStructureAPI(true);

    await dispatch(handleConcludeTab5Action(id));

    setAddingStructureAPI(false);
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

  const formattedQuote = useMemo(() => {
    if (!stockSymbolData) {
      return "0,00";
    }

    return formatarNumDecimal(stockSymbolData.last || 0, 2);
  }, [stockSymbolData]);

  const formattedOscilation = useMemo(() => {
    if (!stockSymbolData) {
      return "0,00%";
    }

    return `${formatarNumDecimal(stockSymbolData.oscilation || 0, 2)}%`;
  }, [stockSymbolData]);

  return (
    <div className="multiBoxTab5">
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
              onChange={handleInputChange}
            />
            <InputGroup.Append>
              <span
                className="input-group-text appendedSearchIcon divClicavel"
                onClick={handleSearchStock}
              >
                {searchingSymbolAPI ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  <GrFormSearch size={24} />
                )}
              </span>
            </InputGroup.Append>
          </InputGroup>

          <button
            className="brokerCustomButton searchOptionsButton"
            onClick={handleSearchOptions}
          >
            <img src={searchOptionsIcon} alt="" />
          </button>
          <span className="quote">{formattedQuote}</span>
          <span className="oscilation">{formattedOscilation}</span>
        </div>

        <div className="buttonsContainer">
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

      <div className="strikeDateRow">
        <Form.Group>
          <div className="callPutContainer">
            <button className="brokerCustomButton" onClick={handleCall}>
              + Call
            </button>

            <Form.Label>Strike</Form.Label>

            <button className="brokerCustomButton" onClick={handlePut}>
              + Put
            </button>
          </div>

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

        <button
          onClick={handleConclude}
          className="brokerCustomButton finishButton"
        >
          {addingStructureAPI ? (
            <Spinner as="span" animation="border" size="sm" variant="light" />
          ) : (
            "Concluir"
          )}
        </button>
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
              <th className="expirationColumn">Vcto.</th>
              <th>Tipo</th>
              <th></th>
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
    </div>
  );
};

export default Tab5IncludeStructure;
