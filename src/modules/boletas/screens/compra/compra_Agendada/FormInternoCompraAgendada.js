import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "modules/boletas/duck/actions/bookOfertaActions";
import {
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarQtdAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/formInputActions";
import RowFormValidade from "modules/boletas/components/RowFormValidade";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import { compraAgendadaAction } from "modules/boletas/duck/actions/AppBoletasActions";
import RowAtivoQtdeBoletas from "modules/boletas/components/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "modules/boletas/duck/actions/boletasAPIActions";
import CustomInput from "shared/componentes/CustomInput";
import { BotaoEnviarOrdem } from "modules/boletas/components/BotaoEnviarOrdem";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoCompraAgendada extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_AGENDADA_NAMESPACE)}
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
                    value={this.props.entradaExec}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
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
                {CalculoValorTotalAgendada(
                  this.props.entradaDisparo,
                  this.props.entradaExec,
                  this.props.qtde,
                )}
              </h6>
            </Col>
          </Row>

          <InputGroupBoleta
            namespace={COMPRA_AGENDADA_NAMESPACE}
            cv="compra"
            popupToOpenGain="compra_gainreducao"
            popupToOpenStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, COMPRA_AGENDADA_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_AGENDADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_AGENDADA_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BotaoEnviarOrdem
                  props={this.props}
                  tipoCompraVenda="Comprar"
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
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mostrarErroQtdeOnBlurAction,
  compraAgendadaAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
})(FormInternoCompraAgendada);
