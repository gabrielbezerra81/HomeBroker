import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import {
  // mudarValidadeSelectAction,
  // mudarDataAction,
  // mudarAtivoAction,
  // mudarAssinaturaAction,
  // mudarCheckSalvarAssinaturaAction,
  // mudarQtdAction,
  mudarAtributoBoletaAction,
  limparAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import CustomInput from "shared/componentes/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoCompraAgendada extends React.Component {
  render() {
    const {
      entradaDisparo,
      entradaExec,
      qtde,
      ordem,
      mudarAtributoBoletaAction,
      limparAction,
    } = this.props;

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
                    onChange={(valor) =>
                      mudarAtributoBoletaAction(
                        valor,
                        COMPRA_AGENDADA_NAMESPACE,
                        "entradaDisparo",
                      )
                    }
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
                    onChange={(valor) =>
                      mudarAtributoBoletaAction(
                        valor,
                        COMPRA_AGENDADA_NAMESPACE,
                        "entradaExec",
                      )
                    }
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
            {RowFormAssinatura(this.props, COMPRA_AGENDADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => limparAction(COMPRA_AGENDADA_NAMESPACE)}
                >
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
  }
}

const mapStateToProps = (state) => ({
  erro: state.compraAgendadaReducer.erro,
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  validadeSelect: state.compraAgendadaReducer.validadeSelect,
  date: state.compraAgendadaReducer.date,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  entradaDisparo: state.compraAgendadaReducer.entradaDisparo,
  entradaExec: state.compraAgendadaReducer.entradaExec,
  ativo: state.compraAgendadaReducer.ativo,
  assinatura: state.compraAgendadaReducer.assinatura,
  checkSalvarAssinatura: state.compraAgendadaReducer.checkSalvarAssinatura,
  qtde: state.compraAgendadaReducer.qtde,
  dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {
  limparAction,
  mudarAtributoBoletaAction,
})(FormInternoCompraAgendada);
