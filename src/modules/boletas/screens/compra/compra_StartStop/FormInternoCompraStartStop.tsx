import React, { useCallback } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { limparAction } from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoCompraStartStop: React.FC<Props> = ({ ordem }) => {
  const dispatch = useDispatchBoletas();

  const handleClearData = useCallback(() => {
    dispatch(limparAction(COMPRA_STARTSTOP_NAMESPACE));
  }, [dispatch]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={COMPRA_STARTSTOP_NAMESPACE} />
        </Form>
        <InputGroupBoleta
          namespace={COMPRA_STARTSTOP_NAMESPACE}
          cv="compra"
          popupToOpenGain="compra_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={COMPRA_STARTSTOP_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={COMPRA_STARTSTOP_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={COMPRA_STARTSTOP_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoCompraStartStop;
