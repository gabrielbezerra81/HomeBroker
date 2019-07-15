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
  mudarEntradaDisparoAction,
  mudarEntradaExecAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction
} from "../../redux/actions/formInputActions";
import RowFormValidade from "../../utils/RowFormValidade";
import RowFormAssinatura from "../../utils/RowFormAssinatura";
import { COMPRA_AGENDADA_NAMESPACE } from "../../../constants/ActionTypes";

class FormInternoCompraGainReducao extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            <Row>
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
                <Button variant="" className="operation-icons">
                  <MDBIcon
                    icon="plus-circle"
                    size="2x"
                    className="labelInput-verticalAlign"
                  />
                </Button>
              </Col>
            </Row>

            <Row>
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
  entradaDisparo: state.compraAgendadaReducer.entradaDisparo,
  entradaExec: state.compraAgendadaReducer.entradaExec,
  ativo: state.compraAgendadaReducer.ativo,
  assinatura: state.compraAgendadaReducer.assinatura,
  checkSalvarAssinatura: state.compraAgendadaReducer.checkSalvarAssinatura
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
    mudarEntradaDisparoAction,
    mudarEntradaExecAction,
    mudarAssinaturaAction,
    mudarCheckSalvarAssinaturaAction
  }
)(FormInternoCompraGainReducao);
