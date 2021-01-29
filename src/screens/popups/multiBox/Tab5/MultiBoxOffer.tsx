import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import React, { useCallback, useMemo } from "react";

import { FaCaretDown } from "react-icons/fa";

import { Select } from "antd";

import CustomInput from "shared/componentes/CustomInput";

import modelEUImage from "assets/modeloEU.png";
import modelUSAImage from "assets/modeloUSA2.svg";
import { FormControl } from "react-bootstrap";
import { BoxOffer } from "types/multiBox/MultiBoxState";
import { formatExpiration } from "shared/utils/Formatacoes";
import { handleChangeBoxOfferAction } from "redux/actions/multiBox/tab5Actions";

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

  const codeOptions = useMemo(() => {
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
            key={Math.random()}
            value={option.strike}
          >
            {label}
          </Select.Option>
        );
      });

    return dropdownOptions;
  }, [stockOptions]);

  const strikeOptions = useMemo(() => {
    return stockOptions
      .filter((_, index) => index % 2 === 0)
      .map((option) => {
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
      const formattedExpiration = formatExpiration(expiration);
      return (
        <option key={expiration} value={expiration}>
          {formattedExpiration}
        </option>
      );
    });
  }, [expirations]);

  return (
    <tr>
      <td>
        <BuySellSelector
          offerCV={offerType}
          boxId={boxId}
          offerIndex={offerIndex}
        />
      </td>
      <td>
        <CustomInput
          type={qttyInputConfig.type as any}
          step={qttyInputConfig.step}
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
          value={strikeViewMode === "strike" ? selectedStrike : selectedCode}
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
    return <img className="modelImg" src={modelUSAImage} alt="AMERICAN" />;
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
