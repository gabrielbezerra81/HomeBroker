import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { COMPRA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "components/utils/CalculoValorTotal";
import { compraMercadoAction } from "components/redux/actions/SubAppActions";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction
} from "components/redux/actions/api_actions/boletasAPIActions";

class FormInternoCompraMercado extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_MERCADO_NAMESPACE)}
          </Form>

          <Row>
            <Col className="colValorTotal">
              <h6 className="valorTotalText">
                {CalculoValorAproximadoMercado(
                  this.props.qtde,
                  this.props.dadosPesquisa
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
                        COMPRA_MERCADO_NAMESPACE
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
                        COMPRA_MERCADO_NAMESPACE
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
                        COMPRA_MERCADO_NAMESPACE
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
                        COMPRA_MERCADO_NAMESPACE
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

          {RowFormValidade(this.props, COMPRA_MERCADO_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_MERCADO_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_MERCADO_NAMESPACE)
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
  ativo: state.compraMercadoReducer.ativo,
  qtde: state.compraMercadoReducer.qtde,
  erro: state.compraMercadoReducer.erro,
  gainDisparo: state.compraMercadoReducer.gainDisparo,
  gainExec: state.compraMercadoReducer.gainExec,
  stopDisparo: state.compraMercadoReducer.stopDisparo,
  stopExec: state.compraMercadoReducer.stopExec,
  validadeSelect: state.compraMercadoReducer.validadeSelect,
  date: state.compraMercadoReducer.date,
  valorTotal: state.compraMercadoReducer.valorTotal,
  assinatura: state.compraMercadoReducer.assinatura,
  checkSalvarAssinatura: state.compraMercadoReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraMercadoReducer.dadosPesquisa
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
    compraMercadoAction,
    pesquisarAtivoOnEnterAction,
    enviarOrdemAction
  }
)(FormInternoCompraMercado);
