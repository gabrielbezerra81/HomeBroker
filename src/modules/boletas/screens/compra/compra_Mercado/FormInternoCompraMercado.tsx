import React, { useCallback, useMemo } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { limparAction } from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { COMPRA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoCompraMercado: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[COMPRA_MERCADO_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { qtde, dadosPesquisa } = boletaState;

  const handleClearData = useCallback(() => {
    dispatch(limparAction(COMPRA_MERCADO_NAMESPACE));
  }, [dispatch]);

  const totalValue = useMemo(() => {
    return CalculoValorAproximadoMercado(qtde, dadosPesquisa);
  }, [dadosPesquisa, qtde]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={COMPRA_MERCADO_NAMESPACE} />
        </Form>

        <Row>
          <Col className="colValorTotal">
            <h6 className="valorTotalText">{totalValue}</h6>
          </Col>
        </Row>

        <InputGroupBoleta
          namespace={COMPRA_MERCADO_NAMESPACE}
          cv="compra"
          popupToOpenGain="compra_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={COMPRA_MERCADO_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={COMPRA_MERCADO_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={COMPRA_MERCADO_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoCompraMercado;
