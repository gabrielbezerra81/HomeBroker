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
  mudarStopExecAction
} from "../../redux/actions/compraAgendadaActions";

class FormInternoCompraAgendada extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div className="divAsModalContainer">
        <Form>
          <Row>
            <Col md={2} className="labelCol">
              <h6 className="labelForm-verticalAlign">Ativo</h6>
            </Col>
            <Col md={4} className="formAtivo">
              <Form.Group>
                <Form.Label />
                <Form.Control type="text" placeholder="" name="ativo" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Qtde</Form.Label>
                <Form.Control
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
            <Col md={2} className="labelCol">
              <h6 className="labelForm-verticalAlign">Entrada</h6>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Disparo</Form.Label>
                <Form.Control type="number" step={0.1} min={0} name="disparo" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Execução</Form.Label>
                <Form.Control
                  type="number"
                  step={0.1}
                  min={0}
                  name="execucao"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <MDBIcon
                icon="cog"
                size="2x"
                className="labelForm-verticalAlign"
              />
            </Col>
          </Row>
        </Form>

        <Row>
          <Col className="colValorTotal">
            <h2 className="valorTotalText">VALOR TOTAL: 26,50</h2>
          </Col>
        </Row>

        <Form>
          <Row>
            <Col className="labelCol">
              <h6 className="labelForm-verticalAlign">Gain</h6>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Disparo</Form.Label>
                <Form.Control
                  type="number"
                  step={0.1}
                  min={0}
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
                  type="number"
                  step={0.1}
                  min={0}
                  name="gainExecucao"
                  value={this.props.gainExec}
                  onChange={event => this.props.mudarGainExecAction(event)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <MDBIcon
                icon="cog"
                size="2x"
                className="labelForm-verticalAlign"
              />
            </Col>
          </Row>

          <Row>
            <Col className="labelCol">
              <h6 className="labelForm-verticalAlign">Stop</h6>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Disparo</Form.Label>
                <Form.Control
                  type="number"
                  step={0.1}
                  min={0}
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
                  type="number"
                  step={0.1}
                  min={0}
                  name="stopExecucao"
                  value={this.props.stopExec}
                  onChange={event => this.props.mudarStopExecAction(event)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <MDBIcon
                icon="cog"
                size="2x"
                className="labelForm-verticalAlign"
              />
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
              onChange={value => false}
            />
          </Col>
          <Col md={3} className="colFormDate">
            <DatePicker
              className="form-control"
              selected={this.state.date}
              onChange={this.handleChange}
            />
          </Col>
          <Col className="colDateIcon">
            <MDBIcon icon="calendar-alt" size="lg" />
          </Col>
        </Row>

        <div className="customFooter">
          <Row className="rowAssinaturaEletronica">
            <Col md={7}>
              <Form>
                <Form.Group>
                  <Form.Label>Assinatura eletrônica</Form.Label>
                  <Form.Control />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Button variant="secondary">Limpar</Button>
            </Col>
            <Col md={5}>
              <Button variant="primary">Comprar</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  validadeChecked: state.compraAgendadaReducer.validadeChecked
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(FormInternoCompraAgendada);
