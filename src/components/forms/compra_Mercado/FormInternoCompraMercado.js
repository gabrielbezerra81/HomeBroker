import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  mudarQtdAction,
  mostrarErroQtdeOnBlurAction
} from "../../redux/actions/bookOfertaActions";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  alertaVendaAction
} from "../../redux/actions/formInputActions";
import RowFormValidade from "../../utils/RowFormValidade";
import RowFormAssinatura from "../../utils/RowFormAssinatura";
import { COMPRA_MERCADO_NAMESPACE } from "../../../constants/ActionTypes";

class FormInternoCompraMercado extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Ativo</h6>
              </Col>
              <Col className="formAtivo colTextInput">
                <Form.Group>
                  <Form.Label />
                  <Form.Control
                    className="textInput"
                    type="text"
                    placeholder=""
                    name="ativo"
                    value={this.props.ativo}
                    onChange={event =>
                      this.props.mudarAtivoAction(
                        event,
                        COMPRA_MERCADO_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Qtde</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={100}
                    min={0}
                    value={this.props.qtde}
                    onChange={event =>
                      this.props.mudarQtdAction(event, COMPRA_MERCADO_NAMESPACE)
                    }
                    onBlur={() =>
                      this.props.mostrarErroQtdeOnBlurAction(this.props.erro)
                    }
                    name="qtde"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <Row>
            <Col className="colValorTotal">
              <h6 className="valorTotalText">
                VALOR ESTIMADO: {this.props.valorTotal}
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
                    onBlur={()=>this.props.alertaVendaAction(this.props.gainDisparo, this.props.gainExec)}
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
                    onBlur={()=>this.props.alertaVendaAction(this.props.gainDisparo, this.props.gainExec)}
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button variant="" className="operation-icons">
                  <MDBIcon
                    icon="cog"
                    size="2x"
                    className="labelInput-verticalAlign"
                  />
                </Button>
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
                    onBlur={()=>this.props.alertaVendaAction(this.props.stopDisparo, this.props.stopExec)}
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
                    onBlur={()=>this.props.alertaVendaAction(this.props.stopDisparo, this.props.stopExec)}
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button variant="" className="operation-icons">
                  <MDBIcon
                    icon="cog"
                    size="2x"
                    className="labelInput-verticalAlign"
                  />
                </Button>
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
                <Button variant="primary" size="sm" onClick={() => false}>
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
  erro: state.bookOfertaReducer.erro,
  gainDisparo: state.compraMercadoReducer.gainDisparo,
  gainExec: state.compraMercadoReducer.gainExec,
  stopDisparo: state.compraMercadoReducer.stopDisparo,
  stopExec: state.compraMercadoReducer.stopExec,
  validadeSelect: state.compraMercadoReducer.validadeSelect,
  date: state.compraMercadoReducer.date,
  valorTotal: state.compraMercadoReducer.valorTotal,
  assinatura: state.compraMercadoReducer.assinatura,
  checkSalvarAssinatura: state.compraMercadoReducer.checkSalvarAssinatura
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    mudarValidadeSelectAction,
    mudarDataAction,
    limparAction,
    mudarAtivoAction,
    mudarAssinaturaAction,
    mudarCheckSalvarAssinaturaAction,
    mostrarErroQtdeOnBlurAction,
    alertaVendaAction
  }
)(FormInternoCompraMercado);
