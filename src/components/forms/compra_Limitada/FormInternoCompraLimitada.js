import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { mudarQtdAction } from "../../redux/actions/bookOfertaActions";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  comprarAgendadaAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarPrecoAction
} from "../../redux/actions/compraAgendadaActions";
import NumberFormat from "react-number-format";
import { rowFormValidade } from "../../RowFormValidade";

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
              <Col md={4} className="formAtivo colTextInput">
                <Form.Group>
                  <Form.Label />
                  <Form.Control
                    className="textInput"
                    type="text"
                    placeholder=""
                    name="ativo"
                    value={this.props.ativo}
                    onChange={event => this.props.mudarAtivoAction(event)}
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="colTextInput">
                <Form.Group>
                  <Form.Label>Qtde</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={100}
                    min={0}
                    value={this.props.qtde}
                    onChange={event => this.props.mudarQtdAction(event)}
                    name="qtde"
                    max={9999999}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Preço</h6>
              </Col>
              <Col md={4} className="colTextInput">
                <Form.Group>
                  <Form.Label />
                  <NumberFormat
                    className="textInput form-control"
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    name="disparo"
                    max={9999999}
                    value={this.props.preco}
                    onChange={event => this.props.mudarPrecoAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="colValorTotal_CL">
                <h6 className="valorTotalText_CL">VALOR TOTAL</h6>
                <h6 className="valorTotalText_CL">{this.props.valorTotal}</h6>
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
                    step={0.1}
                    min={0}
                    max={999999}
                    name="gainDisparo"
                    value={this.props.gainDisparo}
                    onChange={event => this.props.mudarGainDisparoAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
                    max={999999}
                    name="gainExecucao"
                    value={this.props.gainExec}
                    onChange={event => this.props.mudarGainExecAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="colIconeConfig">
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
                    step={0.1}
                    min={0}
                    max={999999}
                    name="stopDisparo"
                    value={this.props.stopDisparo}
                    onChange={event => this.props.mudarStopDisparoAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
                    max={999999}
                    name="stopExecucao"
                    value={this.props.stopExec}
                    onChange={event => this.props.mudarStopExecAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="colIconeConfig">
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

          {rowFormValidade(this.props)}

          <div className="customFooter">
            <Row className="rowAssinaturaEletronica">
              <Col md={9}>
                <Form>
                  <Form.Group>
                    <Form.Label>Assinatura eletrônica</Form.Label>
                    <Form.Control
                      className="textInput"
                      type="password"
                      value={this.props.assinatura}
                      onChange={event =>
                        this.props.mudarAssinaturaAction(event)
                      }
                      autoComplete="current-password"
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => this.props.limparAction()}
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => this.props.comprarAgendadaAction()}
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
  qtde: state.bookOfertaReducer.qtde,
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  validadeSelect: state.compraAgendadaReducer.validadeSelect,
  date: state.compraAgendadaReducer.date,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  ativo: state.compraAgendadaReducer.ativo,
  assinatura: state.compraAgendadaReducer.assinatura,
  preco: state.compraAgendadaReducer.preco
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
    comprarAgendadaAction,
    mudarAtivoAction,
    mudarAssinaturaAction,
    mudarPrecoAction
  }
)(FormInternoCompraLimitada);
