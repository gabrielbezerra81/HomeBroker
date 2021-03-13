import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import CustomInput from "shared/components/CustomInput";
import { cond_updateMultilegTabAction } from "../duck/actions/ConditionalMultilegActions";
import DateSelector from "./Book/DateSelector";

interface Props {
  tabIndex: number;
}

const AlertCondition: React.FC<Props> = ({ tabIndex }) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const tab = useMemo(() => {
    return multileg[tabIndex];
  }, [multileg, tabIndex]);

  const handleInputChange = useCallback(
    (e) => {
      dispatch(
        cond_updateMultilegTabAction({
          tabIndex,
          attributeName: e.target.name,
          attributeValue: e.target.value,
        }),
      );
    },
    [dispatch, tabIndex],
  );

  const handleClean = useCallback(() => {
    dispatch(
      cond_updateMultilegTabAction({
        tabIndex,
        attributeName: "limpar",
        attributeValue: "",
      }),
    );
  }, [dispatch, tabIndex]);

  const priceInputConfig = useMemo(() => {
    const config = {
      step: 0.01,
      precision: 2,
    };

    if (tab.market === "Forex") {
      config.step = 0.00001;
      config.precision = 5;
    }

    return config;
  }, [tab.market]);

  const renderPlaceholder = useMemo(() => {
    let renderPlaceholder = false;
    const { tabelaMultileg } = tab;

    tabelaMultileg.forEach((oferta: any) => {
      let qtde = oferta.qtde + "";
      qtde = qtde.split(".").join("");
      if (qtde === "" || qtde === "0") {
        renderPlaceholder = true;
      }
    });

    return renderPlaceholder;
  }, [tab]);

  const price = useMemo(() => {
    let preco = multileg[tabIndex].preco;

    if (["0.00"].includes(preco)) return "";

    return preco;
  }, [multileg, tabIndex]);

  return (
    <div className="alertCondition">
      <Form.Group>
        <Form.Label>Preço considerado</Form.Label>
        <Form.Control
          value={tab.param}
          name="param"
          onChange={handleInputChange}
          as="select"
          className="textInput"
        >
          <option value={"Bid"}>Oferta de compra</option>
          <option value={"Ask"}>Oferta de venda</option>
          <option value={"Last"}>Último negócio</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Condição</Form.Label>

        <Form.Control
          value={tab.operator}
          name="operator"
          onChange={handleInputChange}
          as="select"
          className="textInput"
        >
          <option value={"Less"}>Menor ou igual {"<="}</option>
          <option value={"Greater"}>Maior ou igual {">="}</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Preço</Form.Label>

        <CustomInput
          placeholder={renderPlaceholder ? "Informe as qtdes" : ""}
          allowNegative
          autoSelect
          type="precoNegativo"
          step={priceInputConfig.step}
          precision={priceInputConfig.precision}
          value={renderPlaceholder ? "" : price}
          onChange={(valor) =>
            dispatch(
              cond_updateMultilegTabAction({
                tabIndex,
                attributeName: "preco",
                attributeValue: valor,
              }),
            )
          }
        />
      </Form.Group>

      <Form.Group className="observationInputGroup">
        <Form.Label>Observação</Form.Label>

        <Form.Control
          value={tab.comment}
          name="comment"
          onChange={handleInputChange}
          className="textInput"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Validade</Form.Label>
        <DateSelector tabIndex={tabIndex} />
      </Form.Group>

      <Button variant="secondary" size="sm" onClick={handleClean}>
        LIMPAR
      </Button>
    </div>
  );
};

export default AlertCondition;
