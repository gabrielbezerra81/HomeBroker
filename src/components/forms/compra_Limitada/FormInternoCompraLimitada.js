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
  mudarPrecoAction,
  mudarCheckSalvarAssinaturaAction
} from "../../redux/actions/compraAgendadaActions";
import NumberFormat from "react-number-format";
import RowFormValidade from "../../utils/RowFormValidade";
import RowFormAssinatura from "../../utils/RowFormAssinatura";

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
                    onChange={event => this.props.mudarAtivoAction(event)}
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
                    onChange={event => this.props.mudarQtdAction(event)}
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
                  <NumberFormat
                    className="textInput form-control"
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    name="disparo"
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
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
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
                    name="gainExecucao"
                    value={this.props.gainExec}
                    onChange={event => this.props.mudarGainExecAction(event)}
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
                    step={0.1}
                    min={0}
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
                    name="stopExecucao"
                    value={this.props.stopExec}
                    onChange={event => this.props.mudarStopExecAction(event)}
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

          {RowFormValidade(this.props)}

          <div className="customFooter">
            {RowFormAssinatura(this.props)}
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
    mudarPrecoAction,
    mudarCheckSalvarAssinaturaAction
  }
)(FormInternoCompraLimitada);
