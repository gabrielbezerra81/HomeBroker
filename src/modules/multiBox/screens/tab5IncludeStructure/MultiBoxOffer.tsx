import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import React, { useCallback, useMemo } from "react";

import { FaCaretDown } from "react-icons/fa";

import moment from "moment";

import { Select } from "antd";

import CustomInput from "shared/components/CustomInput";

import modelEUImage from "assets/modeloEU.png";
// import ModelUSAImage from "assets/modeloUSA2.svg";
import { ReactComponent as ModelUSAImage } from "assets/modeloUSA2.svg";
import { FormControl } from "react-bootstrap";
import { BoxOffer } from "modules/multiBox/types/MultiBoxState";
import {
  handleChangeBoxOfferAction,
  handleRemoveOfferAction,
} from "modules/multiBox/duck/actions/tab5Actions";
import { FiX } from "react-icons/fi";

interface Props {
  data: BoxOffer;
  strikeViewMode: "code" | "strike";
  offerIndex: number;
  boxId: string;
}

const MultiBoxOffer: React.FC<Props> = ({
  data: {
    offerType,
    qtty,
    selectedStrike,
    selectedCode,
    selectedExpiration,
    type,
    model,
    expirations,
    stockOptions,
  },
  strikeViewMode,
  offerIndex,
  boxId,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const handleRemoveOffer = useCallback(() => {
    dispatch(handleRemoveOfferAction(boxId, offerIndex));
  }, [boxId, dispatch, offerIndex]);

  const handleQttyChange = useCallback(
    (value: any) => {
      dispatch(
        handleChangeBoxOfferAction({
          boxId,
          offerIndex,
          attr: "qtty",
          value,
        }),
      );
    },
    [boxId, dispatch, offerIndex],
  );

  const handleTypeChange = useCallback(() => {
    const value = type === "CALL" ? "PUT" : "CALL";

    dispatch(
      handleChangeBoxOfferAction({
        boxId,
        offerIndex,
        attr: "type",
        value,
      }),
    );
  }, [boxId, dispatch, offerIndex, type]);

  const handleStrikeChange = useCallback(
    (value: any) => {
      dispatch(
        handleChangeBoxOfferAction({
          boxId,
          offerIndex,
          attr: "selectedStrike",
          value,
        }),
      );
    },
    [boxId, dispatch, offerIndex],
  );

  const handleExpirationChange = useCallback(
    (e) => {
      const { value } = e.currentTarget;

      dispatch(
        handleChangeBoxOfferAction({
          boxId,
          offerIndex,
          attr: "selectedExpiration",
          value,
        }),
      );
    },
    [boxId, dispatch, offerIndex],
  );

  const codeOptions = useMemo(() => {
    const dropdownOptions = stockOptions.map((option, index) => {
      if (index % 2 !== 0) {
        return null;
      }

      let symbol = "";

      if (option.type === type) {
        symbol = option.symbol;
      } //
      else {
        symbol = stockOptions[index + 1].symbol;
      }

      const symbolPrefix = symbol.substr(0, 4);

      const label = `${symbol.substr(4)} (${option.strike})`;

      // const label =
      //   option.type === "CALL"
      //     ? option.symbol +
      //       " " +
      //       option.strike +
      //       " " +
      //       stockOptions[index + 1].symbol
      //     : stockOptions[index + 1].symbol +
      //       " " +
      //       option.strike +
      //       " " +
      //       option.symbol;

      return (
        <Select.Option
          className="tab5StrikeOption"
          key={Math.random()}
          value={option.strike}
        >
          <span style={{ fontSize: 10 }}>{symbolPrefix}</span>
          <span style={{ fontSize: 14 }}>{label}</span>
        </Select.Option>
      );
    });

    return dropdownOptions;
  }, [stockOptions, type]);

  const strikeOptions = useMemo(() => {
    return stockOptions.map((option, index) => {
      if (index % 2 !== 0) {
        return null;
      }

      let label = option.strike.toString();
      let value = option.strike;

      return (
        <Select.Option className="tab5StrikeOption" key={value} value={value}>
          {label}
        </Select.Option>
      );
    });
  }, [stockOptions]);

  const expirationOptions = useMemo(() => {
    return expirations.map((expiration) => {
      const formattedExpiration = moment(expiration).format("DD/MM/YY");
      return (
        <option key={expiration} value={expiration}>
          {formattedExpiration}
        </option>
      );
    });
  }, [expirations]);

  const strikeColumnValue = useMemo(() => {
    if (selectedStrike === 0) {
      return selectedCode;
    }

    if (strikeViewMode === "strike") {
      return selectedStrike;
    }

    return selectedCode;
  }, [selectedCode, selectedStrike, strikeViewMode]);

  return (
    <tr>
      <td className="closeColumn">
        <button onClick={handleRemoveOffer} className="brokerCustomButton">
          <FiX color="#ce202a" size={10} strokeWidth={3} />
        </button>
      </td>
      <td>
        <BuySellSelector
          offerCV={offerType}
          boxId={boxId}
          offerIndex={offerIndex}
        />
      </td>
      <td>
        <CustomInput
          type={"quantidade"}
          step={1}
          autoSelect
          value={qtty}
          onChange={handleQttyChange}
        />
      </td>
      <td className="strikeColumn">
        <Select
          size="small"
          dropdownClassName="strikeSelectDropdown"
          showSearch
          optionFilterProp="children"
          notFoundContent="Strike não encontrado"
          className="strikeSelect offerStrikeSelect"
          suffixIcon={<FaCaretDown color="#ddd" />}
          value={strikeColumnValue}
          onChange={handleStrikeChange}
        >
          {strikeViewMode === "strike" && strikeOptions}

          {strikeViewMode === "code" && codeOptions}
        </Select>
      </td>
      <td>
        <FormControl
          as="select"
          className="darkInputSelect dueDateSelect"
          name="period"
          value={selectedExpiration}
          onChange={handleExpirationChange}
        >
          {expirationOptions}
        </FormControl>
      </td>
      <td className="typeColumn">
        <button
          className="brokerCustomButton typeButton"
          onClick={handleTypeChange}
        >
          {type}
        </button>
      </td>
      <td>
        <Model model={model} />
      </td>
    </tr>
  );
};

export default MultiBoxOffer;

interface BuySellProps {
  offerCV: any;
  boxId: string;
  offerIndex: number;
}

const BuySellSelector: React.FC<BuySellProps> = ({
  offerCV,
  boxId,
  offerIndex,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const offerType = useMemo(() => {
    const type = { buy: "", sell: "" };

    if (offerCV === "C") {
      type.buy = "buySelector";
    } else {
      type.sell = "sellSelector";
    }

    return type;
  }, [offerCV]);

  const handleTypeChange = useCallback(
    (e) => {
      const value = e.currentTarget.name;

      dispatch(
        handleChangeBoxOfferAction({
          boxId,
          offerIndex,
          attr: "offerType",
          value,
        }),
      );
    },
    [boxId, dispatch, offerIndex],
  );

  return (
    <div className="buySellSelector">
      <button
        className={`brokerCustomButton ${offerType.buy}`}
        name="C"
        onClick={handleTypeChange}
      >
        C
      </button>
      <button
        className={`brokerCustomButton ${offerType.sell}`}
        name="V"
        onClick={handleTypeChange}
      >
        V
      </button>
    </div>
  );
};

interface ModelProps {
  model: "EUROPEAN" | "AMERICAN";
}

const Model: React.FC<ModelProps> = ({ model }) => {
  if (model === "EUROPEAN")
    return <img className="modelImg" src={modelEUImage} alt="EUROPEAN" />;
  else if (model === "AMERICAN")
    return (
      <ModelUSAImage className="modelImg" viewBox="6 -1 17 17" />
      // <img
      //   className="modelImg"
      //   // viewBox="6 -1 17 17"
      //   src={ModelUSAImage + "#svgView(viewBox(6,-1,17,17))"}
      //   alt="AMERICAN"
      // />
    );
  else return null;
};

/**
 

  const codeOptionsDropdownClosed = useMemo(() => {
    return stockOptions.map((option, index) => {
      return (
        <Select.Option
          key={Math.random()}
          value={option.strike}
          className="tab5StrikeOption"
        >
          {option.symbol}
        </Select.Option>
      );
    });
  }, [stockOptions]);

 */

/*

  const qttyInputConfig = useMemo(() => {
    const config = {
      step: 100,
      type: "quantidade",
    };

    // if (multileg[tabIndex].market === "Forex") {
    //   config.step = 0.01;
    //   config.type = "preco";
    // }

    return config;
  }, []);

*/
