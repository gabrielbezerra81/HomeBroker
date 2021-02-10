import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "modules/boletas/duck/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { VENDA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { pesquisarAtivoOnEnterAction } from "modules/boletas/duck/actions/boletasAPIActions";
import CustomInput from "shared/componentes/CustomInput";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoVendaAgendada extends React.Component {
  render() {
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
                    value={this.props.entradaDisparo}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        VENDA_AGENDADA_NAMESPACE,
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
                    value={this.props.entradaExec}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        VENDA_AGENDADA_NAMESPACE,
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
                {CalculoValorTotalAgendada(
                  this.props.entradaDisparo,
                  this.props.entradaExec,
                  this.props.qtde,
                )}
              </h6>
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
            {RowFormAssinatura(this.props, VENDA_AGENDADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_AGENDADA_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BoletaSendOrderButton
                  orderInfo={this.props.ordem}
                  namespace={VENDA_AGENDADA_NAMESPACE}
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
  qtde: state.vendaAgendadaReducer.qtde,
  erro: state.vendaAgendadaReducer.erro,
  gainDisparo: state.vendaAgendadaReducer.gainDisparo,
  gainExec: state.vendaAgendadaReducer.gainExec,
  stopDisparo: state.vendaAgendadaReducer.stopDisparo,
  stopExec: state.vendaAgendadaReducer.stopExec,
  validadeSelect: state.vendaAgendadaReducer.validadeSelect,
  date: state.vendaAgendadaReducer.date,
  valorTotal: state.vendaAgendadaReducer.valorTotal,
  entradaDisparo: state.vendaAgendadaReducer.entradaDisparo,
  entradaExec: state.vendaAgendadaReducer.entradaExec,
  ativo: state.vendaAgendadaReducer.ativo,
  assinatura: state.vendaAgendadaReducer.assinatura,
  checkSalvarAssinatura: state.vendaAgendadaReducer.checkSalvarAssinatura,
  dadosPesquisa: state.vendaAgendadaReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mostrarErroQtdeOnBlurAction,
  pesquisarAtivoOnEnterAction,
  mudarAtributoBoletaAction,
})(FormInternoVendaAgendada);
