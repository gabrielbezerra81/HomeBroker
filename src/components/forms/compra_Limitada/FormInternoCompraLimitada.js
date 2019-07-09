import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { mudarQtdAction } from "../../redux/actions/bookOfertaActions";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarValidadeCheckAction,
  mudarDataAction,
  limparAction,
  comprarAgendadaAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarPrecoAction
} from "../../redux/actions/compraAgendadaActions";

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
              <Col md={4} className="formAtivo">
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

              <Col md={4}>
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label />
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
                    name="disparo"
                    max={9999999}
                    value={this.props.preco}
                    onChange={event => this.props.mudarPrecoAction(event)}
                  />
                </Form.Group>
              </Col>
              <Col md={5} className="colValorTotal_CL">
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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

          <Row className="rowFormValidade">
            <Col md={2}>
              <Form.Label>Validade:</Form.Label>
            </Col>
            <Col md={5} className="colValidadeCheck">
              <Form.Check
                type="checkbox"
                id="checkboxValidade"
                label="Até cancelar"
                checked={this.props.validadeChecked}
                onChange={() =>
                  this.props.mudarValidadeCheckAction(
                    this.props.validadeChecked
                  )
                }
              />
            </Col>
            <Col md={4} className="colFormDate">
              <DatePicker
                className="form-control textInput"
                selected={this.props.date}
                onChange={data => this.props.mudarDataAction(data)}
                dateFormat="dd/MM/yyyy"
              />
            </Col>
            <Col md={1} className="colDateIcon">
              <MDBIcon icon="calendar-alt" size="lg" />
            </Col>
          </Row>

          <div className="customFooter">
            <Row className="rowAssinaturaEletronica">
              <Col md={7}>
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
                  onClick={() => this.props.limparAction()}
                >
                  Limpar
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="primary"
                  onClick={() => this.props.comprarAgendadaAction()}
                >
                  Comprar
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
  validadeChecked: state.compraAgendadaReducer.validadeChecked,
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
    mudarValidadeCheckAction,
    mudarDataAction,
    limparAction,
    comprarAgendadaAction,
    mudarAtivoAction,
    mudarAssinaturaAction,
    mudarPrecoAction
  }
)(FormInternoCompraLimitada);
