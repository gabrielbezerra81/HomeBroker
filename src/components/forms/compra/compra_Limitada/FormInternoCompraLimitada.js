import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
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
  mudarPrecoAction,
  mudarCheckSalvarAssinaturaAction
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "components/utils/CalculoValorTotal";

class FormInternoCompraLimitada extends React.Component {
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
                        COMPRA_LIMITADA_NAMESPACE
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
                      this.props.mudarQtdAction(
                        event,
                        COMPRA_LIMITADA_NAMESPACE
                      )
                    }
                    onBlur={() =>
                      this.props.mostrarErroQtdeOnBlurAction(this.props.erro)
                    }
                    name="qtde"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Preço</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label />
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="preco"
                    value={this.props.preco}
                    onChange={event =>
                      this.props.mudarPrecoAction(
                        event,
                        COMPRA_LIMITADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={5} className="colValorTotal_CL">
                <h6 className="valorTotalText_CL">
                  {CalculoValorTotalLimitada(this.props.preco, this.props.qtde)}
                </h6>
              </Col>
            </Row>
          </Form>

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
                        COMPRA_LIMITADA_NAMESPACE
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
                        COMPRA_LIMITADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button variant="link" className="operation-icons">
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
                        COMPRA_LIMITADA_NAMESPACE
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
                        COMPRA_LIMITADA_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button variant="link" className="operation-icons">
                  <MDBIcon
                    icon="cog"
                    size="2x"
                    className="labelInput-verticalAlign"
                  />
                </Button>
              </Col>
            </Row>
          </Form>

          {RowFormValidade(this.props, COMPRA_LIMITADA_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_LIMITADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_LIMITADA_NAMESPACE)
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
  qtde: state.compraLimitadaReducer.qtde,
  erro: state.compraLimitadaReducer.erro,
  gainDisparo: state.compraLimitadaReducer.gainDisparo,
  gainExec: state.compraLimitadaReducer.gainExec,
  stopDisparo: state.compraLimitadaReducer.stopDisparo,
  stopExec: state.compraLimitadaReducer.stopExec,
  validadeSelect: state.compraLimitadaReducer.validadeSelect,
  date: state.compraLimitadaReducer.date,
  valorTotal: state.compraLimitadaReducer.valorTotal,
  ativo: state.compraLimitadaReducer.ativo,
  assinatura: state.compraLimitadaReducer.assinatura,
  preco: state.compraLimitadaReducer.preco,
  checkSalvarAssinatura: state.compraLimitadaReducer.checkSalvarAssinatura
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
    mudarPrecoAction,
    mudarCheckSalvarAssinaturaAction,
    mostrarErroQtdeOnBlurAction
  }
)(FormInternoCompraLimitada);
