import React, { useCallback, useMemo } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { limparAction } from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { VENDA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoVendaMercado: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[VENDA_MERCADO_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { qtde, dadosPesquisa } = boletaState;

  const handleClearData = useCallback(() => {
    dispatch(limparAction(VENDA_MERCADO_NAMESPACE));
  }, [dispatch]);

  const totalValue = useMemo(() => {
    return CalculoValorAproximadoMercado(qtde, dadosPesquisa);
  }, [dadosPesquisa, qtde]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={VENDA_MERCADO_NAMESPACE} />
        </Form>

        <Row>
          <Col className="colValorTotal">
            <h6 className="valorTotalText">{totalValue}</h6>
          </Col>
        </Row>

        <InputGroupBoleta
          namespace={VENDA_MERCADO_NAMESPACE}
          cv="venda"
          popupToOpenGain="venda_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={VENDA_MERCADO_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={VENDA_MERCADO_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={VENDA_MERCADO_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoVendaMercado;
