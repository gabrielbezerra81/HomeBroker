import React, { useCallback, useMemo, useState } from "react";

import { Form, InputGroup, Spinner } from "react-bootstrap";

import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";

import CustomInput from "shared/componentes/CustomInput";
import BoxDateSelector from "./BoxDateSelector";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleDeleteBoxAction,
  handleExportBoxToMultilegAction,
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import closeIcon from "assets/closeIcon.png";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { createAlertFromBoxAction } from "modules/multiBox/duck/actions/tab3Actions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface Props {
  multiBox: MultiBoxData;
}

const Tab4Alerts: React.FC<Props> = ({ multiBox }) => {
  const {
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const {
    alertPrice,
    consideredPrice,
    condition,
    observation,
    id,
    stockSymbolData,
    symbolInput,
    selectedValidity,
    toggleShowId,
  } = multiBox;

  const [addingAlertAPI, setAddingAlertAPI] = useState(false);

  const {
    formattedMin,
    formattedMedium,
    formattedMax,
    medium,
  } = useMemo(() => {
    const formatted = {
      formattedMin: "0,00",
      formattedMax: "0,00",
      formattedMedium: "",
      medium: 0,
    };

    if (!structureData) {
      return formatted;
    }

    const { min, max } = structureData;

    formatted.formattedMin = formatarNumDecimal(min || 0);
    formatted.formattedMax = formatarNumDecimal(max || 0);

    if (typeof min === "number" && typeof max === "number") {
      formatted.medium = (max + min) / 2;
      formatted.formattedMedium = formatarNumDecimal(formatted.medium || 0);
    }

    return formatted;
  }, [structureData]);

  const handleSearchStock = useCallback(() => {
    dispatch(updateBoxAttrAction(id, { activeTab: "5" }));
  }, [dispatch, id]);

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

  const handleInputChange = useCallback(
    async (e) => {
      const { name } = e.currentTarget;

      let value = e.currentTarget.value;

      if (name === "symbolInput") {
        value = value.toLocaleUpperCase();
      }

      dispatch(
        updateBoxAttrAction(id, {
          [name]: value,
        }),
      );
    },
    [dispatch, id],
  );

  const handlePriceChange = useCallback(
    (value) => {
      let price = value;

      if (Number(value) - 0.01 === 0 && structureData?.min) {
        price = structureData?.min || 0;
      }

      dispatch(
        updateBoxAttrAction(id, {
          alertPrice: price,
        }),
      );
    },
    [dispatch, id, structureData],
  );

  const handleCreateAlert = useCallback(async () => {
    setAddingAlertAPI(true);

    await dispatch(
      createAlertFromBoxAction({
        multiBox,
      }),
    );

    setAddingAlertAPI(false);
  }, [dispatch, multiBox]);

  const handleClickBarPrice = useCallback(
    (event) => {
      const { name } = event.currentTarget;

      let price = alertPrice;
      let validity = selectedValidity;
      let considered = consideredPrice;
      let cond = condition;

      if (name === "max") {
        price = structureData?.max || 0;
        validity = "DAY";
        considered = "Last";
        cond = "Less";
      } //
      else if (name === "min") {
        price = structureData?.min || 0;
        validity = "DAY";
        considered = "Last";
        cond = "Greater";
      } //
      else if (name === "med") {
        price = medium || 0;
        validity = "DAY";
        considered = "Last";
        cond = "Greater";
      }

      dispatch(
        updateBoxAttrAction(id, {
          alertPrice: price,
          selectedValidity: validity,
          consideredPrice: considered,
          condition: cond,
        }),
      );
    },
    [
      alertPrice,
      condition,
      consideredPrice,
      dispatch,
      id,
      medium,
      selectedValidity,
      structureData,
    ],
  );

  const formattedRefStockData = useMemo(() => {
    if (!stockSymbolData) {
      return null;
    }

    const { oscilation, min, max, last } = stockSymbolData;

    let formattedOscilation = "";

    if (oscilation > 0) {
      formattedOscilation += "+";
    }

    formattedOscilation += formatarNumDecimal(oscilation || 0) + "%";

    const medium = (max + min) / 2;

    const formattedMedium = formatarNumDecimal(medium, 3);

    return {
      ...stockSymbolData,
      formattedLast: formatarNumDecimal(last),
      formattedOscilation,
      formattedMin: formatarNumDecimal(min),
      formattedMax: formatarNumDecimal(max),
      medium,
      formattedMedium,
    };
  }, [stockSymbolData]);

  return (
    <div className="multiBoxTab3">
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
          </InputGroup>

          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className="oscilation">
            {formattedRefStockData?.formattedOscilation}
          </span>
        </div>

        <div className="buttonsContainer">
          <button className="brokerCustomButton" onClick={handleSearchStock}>
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
      <div className="boxInputRangeContainer">
        <div>
          <span className="whiteText">Mín</span>
          <span className="whiteText">Médio</span>
          <span className="whiteText">Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range boxInputRange`}
          min={structureData?.min || undefined}
          max={structureData?.max || undefined}
          step={0.01}
        />
        <div>
          <button
            onClick={handleClickBarPrice}
            name="min"
            className="brokerCustomButton whiteText"
          >
            {formattedMin}
          </button>
          <button
            onClick={handleClickBarPrice}
            name="med"
            className="brokerCustomButton whiteText"
          >
            {formattedMedium}
          </button>
          <button
            onClick={handleClickBarPrice}
            name="max"
            className="brokerCustomButton whiteText"
          >
            {formattedMax}
          </button>
        </div>
      </div>

      <div className="titleContainer">
        <h6>Cadastrar Alerta</h6>
      </div>

      <div className="createAlertContainer">
        <div className="formGroupRow">
          <Form.Group>
            <Form.Label>Preço</Form.Label>
            <CustomInput
              name="price"
              theme="dark"
              step={0.01}
              type="preco"
              value={alertPrice}
              onChange={handlePriceChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Validade</Form.Label>
            <BoxDateSelector multiBox={multiBox} />
          </Form.Group>
        </div>

        <div className="formGroupRow">
          <Form.Group>
            <Form.Label>Preço considerado</Form.Label>
            <Form.Control
              className="darkInputSelect"
              as="select"
              name="consideredPrice"
              value={consideredPrice}
              onChange={handleInputChange}
            >
              <option value={"Bid"}>Oferta de compra</option>
              <option value={"Ask"}>Oferta de venda</option>
              <option value={"Last"}>Último negócio</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Condição</Form.Label>
            <Form.Control
              className="darkInputSelect"
              as="select"
              name="condition"
              value={condition}
              onChange={handleInputChange}
            >
              <option value={"Less"}>Menor ou igual {"<="}</option>
              <option value={"Greater"}>Maior ou igual {">="}</option>
            </Form.Control>
          </Form.Group>
        </div>

        <Form.Group>
          <Form.Label>Observação</Form.Label>
          <Form.Control
            className="darkSimpleInput"
            name="observation"
            value={observation}
            onChange={handleInputChange}
          />
        </Form.Group>

        <button
          className="brokerCustomButton createAlert"
          onClick={handleCreateAlert}
        >
          {addingAlertAPI ? (
            <Spinner as="span" animation="border" size="sm" variant="light" />
          ) : (
            "Cadastrar Alerta"
          )}
        </button>
      </div>
    </div>
  );
};

export default Tab4Alerts;
