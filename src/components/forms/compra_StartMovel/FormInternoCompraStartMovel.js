import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mudarQtdAction } from "../../redux/actions/bookOfertaActions";
import {
  mudarStopDisparoAction,
  mudarStopExecAction,
  comprarAgendadaAction,
  mudarAtivoAction,
  mudarInicioDisparoAction,
  mudarAjustePadraoAction
} from "../../redux/actions/compraAgendadaActions";

class FormInternoCompraStartMovel extends React.Component {
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
                <h6 className="labelInput-verticalAlign">Início</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
                    name="disparo"
                    value={this.props.inicioDisparo}
                    onChange={event =>
                      this.props.mudarInicioDisparoAction(event)
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Ajuste padrão</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.1}
                    min={0}
                    name="execucao"
                    value={this.props.ajustePadrao}
                    onChange={event =>
                      this.props.mudarAjustePadraoAction(event)
                    }
                  />
                </Form.Group>
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
            </Row>
          </Form>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  ativo: state.compraAgendadaReducer.ativo,
  inicioDisparo: state.compraAgendadaReducer.inicioDisparo,
  ajustePadrao: state.compraAgendadaReducer.ajustePadrao
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    comprarAgendadaAction,
    mudarAtivoAction,
    mudarInicioDisparoAction,
    mudarAjustePadraoAction
  }
)(FormInternoCompraStartMovel);

/**
 * 
          <div className="customFooter">
            <Row>
              <Col md={3} />
              <Col md={6} />
            </Row>
          </div>
 */