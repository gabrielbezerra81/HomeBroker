import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import InputFormatado from "components/utils/InputFormatado";
import { mudarAtributoBoletaAction } from "components/redux/actions/formInputActions";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import { mapStateToPropsInputsPreco } from "components/utils/GraficoInputs";

class RowGainStopFormInterno extends React.Component {
  render() {
    const rowGain = (
      <Row>
        <Col md={2} className="colLabelInput">
          <h6 className="labelInput-verticalAlign">
            {this.props.namespace === "_COMPRA_STARTSTOP" ||
            this.props.namespace === "_VENDA_STARTSTOP"
              ? "Start"
              : "Gain"}
          </h6>
        </Col>
        <Col className="colTextInput">
          <Form.Group>
            <Form.Label>Disparo</Form.Label>
            <Form.Control
              className="textInput"
              type="number"
              step={0.01}
              name="gainDisparo"
              value={this.props[this.props.namespace].gainDisparo}
              onChange={event =>
                this.props.mudarGainDisparoAction(
                  event,
                  "COMPRA_AGENDADA_NAMESPACE"
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
              value={this.props[this.props.namespace].gainExec}
              onChange={event =>
                this.props.mudarGainExecAction(
                  event,
                  "COMPRA_AGENDADA_NAMESPACE"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={1} className="colIconeConfig">
          {iconeConfigAbrirFormulario(
            this.props.handleShow,
            this.props.iconeConfigGain
          )}
        </Col>
      </Row>
    );

    const rowStop = (
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
              value={this.props[this.props.namespace].stopDisparo}
              onChange={event =>
                this.props.mudarStopDisparoAction(
                  event,
                  "COMPRA_AGENDADA_NAMESPACE"
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
              value={this.props[this.props.namespace].stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(
                  event,
                  "COMPRA_AGENDADA_NAMESPACE"
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={1} className="colIconeConfig">
          {iconeConfigAbrirFormulario(
            this.props.handleShow,
            this.props.iconeConfigStop
          )}
        </Col>
      </Row>
    );

    return (
      <Form>
        {this.props.cv === "compra" ? (
          <div>
            {rowGain}
            {rowStop}
          </div>
        ) : (
          <div>
            {rowStop}
            {rowGain}
          </div>
        )}
      </Form>
    );
  }
}

export default connect(
  mapStateToPropsInputsPreco,
  { mudarAtributoBoletaAction }
)(RowGainStopFormInterno);
