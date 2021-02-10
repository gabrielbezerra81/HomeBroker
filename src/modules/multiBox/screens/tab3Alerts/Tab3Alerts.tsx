import React, { useCallback, useMemo } from "react";

import { Form, Spinner } from "react-bootstrap";

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

import closeIcon from "assets/multiBox/closeIcon.png";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { createAlertFromBoxAction } from "modules/multiBox/duck/actions/tab3Actions";

interface Props {
  multiBox: MultiBoxData;
}

const Tab3Alerts: React.FC<Props> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    price,
    consideredPrice,
    condition,
    observation,
    id,
    loadingAPI,
    stockSymbolData,
  } = multiBox;

  const handleSearch = useCallback(() => {}, []);

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

  const handleInputChange = useCallback(
    async (e) => {
      const { name } = e.currentTarget;

      let value = e.currentTarget.value;

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
      dispatch(
        updateBoxAttrAction(id, {
          price: value,
        }),
      );
    },
    [dispatch, id],
  );

  const handleCreateAlert = useCallback(() => {
    dispatch(
      createAlertFromBoxAction({
        multiBox,
      }),
    );
  }, [dispatch, multiBox]);

  const oscilationClass = useMemo(() => {
    if (!stockSymbolData) {
      return "";
    }

    if (stockSymbolData.oscilation > 0) {
      return "positiveText";
    } else if (stockSymbolData.oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, [stockSymbolData]);

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
      <header>
        <div>
          <h4>{stockSymbolData?.symbol}</h4>
          <span className="quote">{formattedRefStockData?.formattedLast}</span>
          <span className={`oscilation ${oscilationClass}`}>
            {formattedRefStockData?.formattedOscilation}
          </span>
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

          <button className="brokerCustomButton" onClick={handleClose}>
            <img src={closeIcon} alt="" />
          </button>
        </div>
      </header>

      <div className="tab3InputRangeContainer">
        <div>
          <span>Mín</span>
          <span>Médio</span>
          <span>Máx</span>
        </div>
        <input
          type="range"
          className={`custom-range tab3InputRange`}
          step="0.01"
          min={stockSymbolData?.min}
          max={stockSymbolData?.max}
          onChange={(event) => {}}
        />
        <div>
          <span>{formattedRefStockData?.formattedMin}</span>
          <span>{formattedRefStockData?.formattedMedium}</span>
          <span>{formattedRefStockData?.formattedMax}</span>
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
              value={price}
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
          {loadingAPI ? (
            <Spinner as="span" animation="border" size="sm" variant="light" />
          ) : (
            "Cadastrar Alerta"
          )}
        </button>
      </div>
    </div>
  );
};

export default Tab3Alerts;
