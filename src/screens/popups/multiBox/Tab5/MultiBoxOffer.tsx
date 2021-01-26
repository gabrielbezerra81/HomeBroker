import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import React, { useCallback, useMemo } from "react";

import { FaCaretDown } from "react-icons/fa";

import { Select } from "antd";

import CustomInput from "shared/componentes/CustomInput";

import modelEUImage from "assets/modeloEU.png";
import modelUSAImage from "assets/modeloUSA2.svg";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { FormControl } from "react-bootstrap";

const MultiBoxOffer: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multiBoxReducer: { strikeViewMode },
  } = useStateStorePrincipal();

  const handleQttyChange = useCallback((value: any) => {
    //   dispatch(
    //     updateMultilegOfferAction({
    //       tabIndex,
    //       attributeName: "qtde",
    //       attributeValue: value,
    //       lineIndex,
    //     }),
    //   );
  }, []);

  const handleTypeChange = useCallback(() => {}, []);

  const handleModelChange = useCallback(() => {}, []);

  const handleStrikechange = useCallback((value: any) => {}, []);

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

  const strikeOptions = useMemo(() => {
    const options: Array<{ label: string; value: any }> = [
      {
        label: "12,32",
        value: 12.32,
      },
      {
        label: "12,33",
        value: 12.33,
      },
    ];

    return options.map((option) => (
      <Select.Option
        key={option.value}
        value={option.value}
        className="optionInputCodigo"
      >
        {option.label}
      </Select.Option>
    ));
  }, []);

  return (
    <tr>
      <td>
        <BuySellSelector offerCV={"compra"} tabIndex={0} lineIndex={0} />
      </td>
      <td>
        <CustomInput
          type={qttyInputConfig.type as any}
          step={qttyInputConfig.step}
          autoSelect
          value={""}
          onChange={handleQttyChange}
        />
      </td>
      <td className="strikeColumn">
        <Select
          size="small"
          dropdownClassName="strikeSelectDropdown"
          value={12.32}
          showSearch
          optionFilterProp="children"
          notFoundContent="Strike não encontrado"
          className="strikeSelect"
          suffixIcon={<FaCaretDown color="#ddd" />}
          onChange={handleStrikechange}
        >
          {strikeOptions}
        </Select>
      </td>
      <td>
        <FormControl as="select" className="darkInputSelect dueDateSelect" name="period">
          <option value={"21/12/2020"}>21/12/2020</option>
          <option value={"21/12/2021"}>21/12/2021</option>
        </FormControl>
      </td>
      <td>
        <button
          className="brokerCustomButton typeButton"
          onClick={handleTypeChange}
        >
          CALL
        </button>
      </td>
      <td>
        <button
          className="brokerCustomButton modelButton"
          onClick={handleModelChange}
        >
          <Model model="AMERICAN" />
        </button>
      </td>
    </tr>
  );
};

export default MultiBoxOffer;

interface BuySellProps {
  offerCV: any;
  tabIndex: number;
  lineIndex: number;
}

const BuySellSelector: React.FC<BuySellProps> = ({
  offerCV,
  tabIndex,
  lineIndex,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const offerType = useMemo(() => {
    const type = { buy: "", sell: "" };

    if (offerCV === "compra") {
      type.buy = "buySelector";
    } else {
      type.sell = "sellSelector";
    }

    return type;
  }, [offerCV]);

  const handleTypeChange = useCallback((e) => {
    // const value = e.currentTarget.name;
  }, []);

  return (
    <div className="buySellSelector">
      <button
        className={`brokerCustomButton ${offerType.buy}`}
        name="compra"
        onClick={handleTypeChange}
      >
        C
      </button>
      <button
        className={`brokerCustomButton ${offerType.sell}`}
        name="venda"
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
  if (model === "EUROPEAN") return <img src={modelEUImage} alt="EUROPEAN" />;
  else if (model === "AMERICAN")
    return <img src={modelUSAImage} alt="AMERICAN" />;
  else return null;
};
