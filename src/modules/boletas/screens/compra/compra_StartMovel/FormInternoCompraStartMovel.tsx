import React, { useCallback, useMemo } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import {
  adicionarItemTabelaStartMovel,
  limparAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/boletaActions";
import { COMPRA_STARTMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import BoletaSignature from "modules/boletas/components/BoletaSignature";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import CustomInput from "shared/componentes/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupStopMovel from "modules/boletas/components/InternalForm/InputGroupStopMovel";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";

interface Props {
  ordem: BoletaOrderInfo;
}

const FormInternoCompraStartMovel: React.FC<Props> = ({ ordem }) => {
  const boletaState = useStateBoletas()[COMPRA_STARTMOVEL_NAMESPACE];

  const dispatch = useDispatchBoletas();

  const {
    tabelaOrdens,
    tabelaOrdensSimulacao,
    ajusteAssimetrico,
    dadosPesquisa,
  } = boletaState;

  const handleValueChange = useCallback(
    (value) => {
      dispatch(
        mudarAtributoBoletaAction(
          value,
          COMPRA_STARTMOVEL_NAMESPACE,
          "ajusteAssimetrico",
        ),
      );
    },
    [dispatch],
  );

  const handleAddItemToTable = useCallback(() => {
    dispatch(
      adicionarItemTabelaStartMovel(boletaState, COMPRA_STARTMOVEL_NAMESPACE),
    );
  }, [boletaState, dispatch]);

  const handleSimulate = useCallback(() => {
    dispatch(
      adicionarItemTabelaStartMovel(
        boletaState,
        COMPRA_STARTMOVEL_NAMESPACE,
        "simulacao",
      ),
    );
  }, [boletaState, dispatch]);

  const handleClearData = useCallback(() => {
    dispatch(limparAction(COMPRA_STARTMOVEL_NAMESPACE));
  }, [dispatch]);

  const { adjustmentPrecision, adjustmentStep } = useMemo(() => {
    const config = {
      adjustmentStep: 0.01,
      adjustmentPrecision: 2,
    };

    if (dadosPesquisa.stepQtde === 0.01) {
      config.adjustmentStep = 0.00001;
      config.adjustmentPrecision = 5;
    }

    return config;
  }, [dadosPesquisa.stepQtde]);

  return (
    <Col className="colFormInterno">
      <div className="divAsModalContainer formInternoCompraStartMovel">
        <Form>
          <BoletaSymbolQttyRow namespace={COMPRA_STARTMOVEL_NAMESPACE} />

          <InputGroupStopMovel namespace={COMPRA_STARTMOVEL_NAMESPACE} />
        </Form>

        <BoletaDateSelector namespace={COMPRA_STARTMOVEL_NAMESPACE} />

        <Form>
          <Row className="rowTextoAjusteAssimetrico">
            <Col md={7} className="colTextoAjusteAssimetrico">
              <h6>Ajuste Assimétrico</h6>
            </Col>
            <Col className="colTextInput colInputAjusteAssimetrico">
              <Form.Group>
                <Form.Label>Valor</Form.Label>
                <CustomInput
                  type="preco"
                  step={adjustmentStep}
                  precision={adjustmentPrecision}
                  value={ajusteAssimetrico}
                  onChange={handleValueChange}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="colIconeConfig">
              <Button
                variant="link"
                onClick={handleAddItemToTable}
                className="operation-icons"
              >
                <MDBIcon icon="plus-circle" size="1x" />
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="rowTabelaOrdens">
          <Col className="colTabelaOrdens">
            <TabelaOrdens
              tableDataOrdens={tabelaOrdens}
              tableDataOrdensSimulacao={tabelaOrdensSimulacao}
            />
          </Col>
        </Row>

        <div className="customFooter footerSemBorda">
          <BoletaSignature namespace={COMPRA_STARTMOVEL_NAMESPACE} />

          <Row>
            <Col md={4}>
              <Button variant="secondary" size="sm" onClick={handleClearData}>
                <h6>Limpar</h6>
              </Button>
            </Col>
            <Col md={4}>
              <BoletaSendOrderButton
                orderInfo={ordem}
                namespace={COMPRA_STARTMOVEL_NAMESPACE}
              />
            </Col>
            <Col md={4}>
              <Button variant="primary" size="sm" onClick={handleSimulate}>
                <h6>Simular</h6>
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default FormInternoCompraStartMovel;
