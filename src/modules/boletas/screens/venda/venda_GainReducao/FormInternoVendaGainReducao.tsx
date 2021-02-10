import React, { useCallback } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { limparAction } from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupGainReducao from "modules/boletas/components/InternalForm/InputGroupGainReducao";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoVendaGainReducao: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[VENDA_GAINREDUCAO_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { resultadoAtivo, tabelaGainReducao } = boletaState;

  const handleClearData = useCallback(() => {
    dispatch(limparAction(VENDA_GAINREDUCAO_NAMESPACE));
  }, [dispatch]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer formInternoCompraStartMovel">
        <Row className="rowTextoAtivoGainReducao">
          <Col>
            <h6 className="resultadoTextoAtivo">{resultadoAtivo}</h6>
          </Col>
        </Row>
        <Form className="item">
          <InputGroupGainReducao namespace={VENDA_GAINREDUCAO_NAMESPACE} />
        </Form>

        <BoletaDateSelector namespace={VENDA_GAINREDUCAO_NAMESPACE} />

        <Row className="rowTabelaGainReducao">
          <Col className="colTabelaOrdens">
            <TabelaGainReducao tableDataOrdens={tabelaGainReducao} />
          </Col>
        </Row>

        <div className="customFooter footerSemBorda">
          <BoletaSignature namespace={VENDA_GAINREDUCAO_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={VENDA_GAINREDUCAO_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoVendaGainReducao;
