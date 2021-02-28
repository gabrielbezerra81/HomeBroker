import React, { useCallback, useMemo } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import {
  limparAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import { VENDA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import CustomInput from "shared/components/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoVendaAgendada: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[VENDA_AGENDADA_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const { entradaExec, entradaDisparo, qtde } = boletaState;

  const handleEntranceTriggerChange = useCallback(
    (valor) => {
      dispatch(
        mudarAtributoBoletaAction(
          valor,
          VENDA_AGENDADA_NAMESPACE,
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
          VENDA_AGENDADA_NAMESPACE,
          "entradaExec",
        ),
      );
    },
    [dispatch],
  );

  const handleClearData = useCallback(() => {
    dispatch(limparAction(VENDA_AGENDADA_NAMESPACE));
  }, [dispatch]);

  const totalValue = useMemo(() => {
    return CalculoValorTotalAgendada(entradaDisparo, entradaExec, qtde);
  }, [entradaDisparo, entradaExec, qtde]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer">
        <Form>
          <BoletaSymbolQttyRow namespace={VENDA_AGENDADA_NAMESPACE} />

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
            <h6 className="valorTotalText">{totalValue}</h6>
          </Col>
        </Row>

        <InputGroupBoleta
          namespace={VENDA_AGENDADA_NAMESPACE}
          cv="venda"
          popupToOpenGain="venda_gainreducao"
          popupToOpenStop="venda_stopmovel"
        />

        <BoletaDateSelector namespace={VENDA_AGENDADA_NAMESPACE} />

        <div className="customFooter">
          <BoletaSignature namespace={VENDA_AGENDADA_NAMESPACE} />

          <Row>
            <Col md={3}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={6}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={VENDA_AGENDADA_NAMESPACE}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoVendaAgendada;
