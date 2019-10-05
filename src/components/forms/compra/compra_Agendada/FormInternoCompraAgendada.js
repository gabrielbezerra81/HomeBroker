import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarQtdAction
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { compraAgendadaAction } from "components/redux/actions/SubAppActions";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction
} from "components/redux/actions/api_actions/boletasAPIActions";
import { formatarNumero } from "components/redux/reducers/formInputReducer";

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
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="disparo"
                    value={this.props.entradaDisparo}
                    onChange={event =>
                      this.props.mudarEntradaDisparoAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="execucao"
                    value={this.props.entradaExec}
                    onChange={event =>
                      this.props.mudarEntradaExecAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
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
                  this.props.qtde
                )}
              </h6>
            </Col>
          </Row>

          <Form>
            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Gain</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="gainDisparo"
                    value={this.props.gainDisparo}
                    onChange={event =>
                      this.props.mudarGainDisparoAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="gainExecucao"
                    value={this.props.gainExec}
                    onChange={event =>
                      this.props.mudarGainExecAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                {iconeConfigAbrirFormulario(
                  this.props.handleShow,
                  "compra_gainreducao"
                )}
              </Col>
            </Row>

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Stop</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="stopDisparo"
                    value={this.props.stopDisparo}
                    onChange={event =>
                      this.props.mudarStopDisparoAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="stopExecucao"
                    value={this.props.stopExec}
                    onChange={event =>
                      this.props.mudarStopExecAction(
                        event,
                        COMPRA_AGENDADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                {iconeConfigAbrirFormulario(
                  this.props.handleShow,
                  "venda_stop_movel"
                )}
              </Col>
            </Row>
          </Form>

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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => this.props.enviarOrdemAction(this.props)}
                >
                  <h6>Comprar</h6>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
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
  dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {
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
    enviarOrdemAction
  }
)(FormInternoCompraAgendada);
