import React, { useCallback } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { limparAction } from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useDispatchBoletas from "hooks/useDispatchBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoVendaStartStop: React.FC<Props> = ({ ordem }) => {
  const dispatch = useDispatchBoletas();

  const handleClearData = useCallback(() => {
    dispatch(limparAction(VENDA_STARTSTOP_NAMESPACE));
  }, [dispatch]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={VENDA_STARTSTOP_NAMESPACE} />
        </Form>
        <InputGroupBoleta
          namespace={VENDA_STARTSTOP_NAMESPACE}
          cv="venda"
          popupToOpenGain="venda_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={VENDA_STARTSTOP_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={VENDA_STARTSTOP_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={VENDA_STARTSTOP_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoVendaStartStop;
