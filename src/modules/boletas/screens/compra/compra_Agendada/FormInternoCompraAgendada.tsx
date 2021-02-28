import React, { useCallback } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import {
  mudarAtributoBoletaAction,
  limparAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import CustomInput from "shared/components/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import useStateBoletas from "hooks/useStateBoletas";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useDispatchBoletas from "hooks/useDispatchBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoCompraAgendada: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[COMPRA_AGENDADA_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { entradaDisparo, entradaExec, qtde } = boletaState;

  const handleEntranceTriggerChange = useCallback(
    (valor) => {
      dispatch(
        mudarAtributoBoletaAction(
          valor,
          COMPRA_AGENDADA_NAMESPACE,
          "entradaDisparo",
        ),
      );
    },
    [dispatch],
  );

  const handleEntranceExecChange = useCallback(
    (value) => {
      dispatch(
        mudarAtributoBoletaAction(
          value,
          COMPRA_AGENDADA_NAMESPACE,
          "entradaExec",
        ),
      );
    },
    [dispatch],
  );

  const handleClearData = useCallback(() => {
    dispatch(limparAction(COMPRA_AGENDADA_NAMESPACE));
  }, [dispatch]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={COMPRA_AGENDADA_NAMESPACE} />

          <Row>
            <Col md={2} className="colLabelInput">
              <h6 className="labelInput-verticalAlign">Entr.</h6>
            </Col>
            <Col className="colTextInput">
              <Form.Group>
                <Form.Label>Disparo</Form.Label>
                <CustomInput
                  type="preco"
                  step={0.01}
                  value={entradaDisparo}
                  onChange={handleEntranceTriggerChange}
                />
              </Form.Group>
            </Col>
            <Col className="colTextInput">
              <Form.Group>
                <Form.Label>Execução</Form.Label>
                <CustomInput
                  type="preco"
                  step={0.01}
                  value={entradaExec}
                  onChange={handleEntranceExecChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col className="colValorTotal">
            <h6 className="valorTotalText">
              {CalculoValorTotalAgendada(entradaDisparo, entradaExec, qtde)}
            </h6>
          </Col>
        </Row>

        <InputGroupBoleta
          namespace={COMPRA_AGENDADA_NAMESPACE}
          cv="compra"
          popupToOpenGain="compra_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={COMPRA_AGENDADA_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={COMPRA_AGENDADA_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={COMPRA_AGENDADA_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoCompraAgendada;
