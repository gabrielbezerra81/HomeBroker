import React, { useCallback, useMemo } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import {
  limparAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { VENDA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import CustomInput from "shared/components/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoVendaLimitada: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[VENDA_LIMITADA_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { dadosPesquisa, preco, qtde } = boletaState;

  const handlePriceChange = useCallback(
    (value) => {
      dispatch(
        mudarAtributoBoletaAction(value, VENDA_LIMITADA_NAMESPACE, "preco"),
      );
    },
    [dispatch],
  );

  const handleClearData = useCallback(() => {
    dispatch(limparAction(VENDA_LIMITADA_NAMESPACE));
  }, [dispatch]);

  const priceInputConfig = useMemo(() => {
    const { stepQtde } = dadosPesquisa;
    const config = {
      step: 0.01,
      precision: 2,
    };

    if (stepQtde === 0.01) {
      config.step = 0.00001;
      config.precision = 5;
    }

    return config;
  }, [dadosPesquisa]);

  const totalValue = useMemo(() => {
    return CalculoValorTotalLimitada(preco, qtde);
  }, [preco, qtde]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={VENDA_LIMITADA_NAMESPACE} />

          <Row>
            <Col md={2} className="colLabelInput">
              <h6 className="labelInput-verticalAlign">Preço</h6>
            </Col>
            <Col className="colTextInput">
              <Form.Group>
                <Form.Label />
                <CustomInput
                  type="preco"
                  step={priceInputConfig.step}
                  precision={priceInputConfig.precision}
                  value={preco}
                  onChange={handlePriceChange}
                />
              </Form.Group>
            </Col>
            <Col md={5} className="colValorTotal_CL">
              <h6 className="valorTotalText_CL">{totalValue}</h6>
            </Col>
          </Row>
        </Form>

        <InputGroupBoleta
          namespace={VENDA_LIMITADA_NAMESPACE}
          cv="venda"
          popupToOpenGain="venda_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={VENDA_LIMITADA_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={VENDA_LIMITADA_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={VENDA_LIMITADA_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoVendaLimitada;
