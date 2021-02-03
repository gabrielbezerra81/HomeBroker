import React, { useCallback, useMemo } from "react";

import { Form } from "react-bootstrap";

import { MultiBoxData } from "types/multiBox/MultiBoxState";
import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";
import zoomIcon from "assets/multiBox/zoomIcon.png";
import CustomInput from "shared/componentes/CustomInput";

interface Props {
  multiBox: MultiBoxData;
}

const Tab3Alerts: React.FC<Props> = ({ multiBox }) => {
  const handleSearch = useCallback(() => {}, []);

  const handleOpenInMultileg = useCallback(() => {
    // dispatch(
    //   handleExportBoxToMultilegAction({
    //     boxId: multiBox.id,
    //     globalProps: {
    //       dispatchGlobal,
    //       zIndex,
    //     },
    //   }),
    // );
  }, []);

  const handleConfig = useCallback(() => {}, []);

  const oscilation = 2;

  const oscilationClass = useMemo(() => {
    // if (!refStockData) {
    //   return "";
    // }

    if (oscilation > 0) {
      return "positiveText";
    } else if (oscilation < 0) {
      return "negativeText";
    }

    return "";
  }, []);

  return (
    <div className="multiBoxTab3">
      <header>
        <div>
          <h4>{"PETR4"}</h4>
          <span className="quote">{"26,32"}</span>
          <span className={`oscilation ${oscilationClass}`}>{"+2,5%"}</span>
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
          // min={refStockData?.min}
          // max={refStockData?.max}
          onChange={(event) => {}}
        />
        <div>
          <span>{"12,00"}</span>
          <span>{"12,50"}</span>
          <span>{"13,00"}</span>
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
              value={""}
              onChange={(value, event) => {}}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Validade</Form.Label>
            <Form.Control className="darkSimpleInput" />
          </Form.Group>
        </div>

        <div className="formGroupRow">
          <Form.Group>
            <Form.Label>Preço considerado</Form.Label>
            <Form.Control className="darkInputSelect" as="select">
              <option value={"Bid"}>Oferta de compra</option>
              <option value={"Ask"}>Oferta de venda</option>
              <option value={"Last"}>Último negócio</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Condição</Form.Label>
            <Form.Control className="darkInputSelect" as="select">
              <option value={"Less"}>Menor ou igual {"<="}</option>
              <option value={"Greater"}>Maior ou igual {">="}</option>
            </Form.Control>
          </Form.Group>
        </div>

        <Form.Group>
          <Form.Label>Observação</Form.Label>
          <Form.Control className="darkSimpleInput" />
        </Form.Group>

        <button className="brokerCustomButton">Cadastrar Alerta</button>
      </div>
    </div>
  );
};

export default Tab3Alerts;
