import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../redux/actions/formInputActions";
import img from "../../../img/compraAgendada.PNG";
import IconeConfigGrafico from "../../utils/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "../../utils/TextoGrafico";

class GraficoCompraStartMovel extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="GainDisparoGrafico_CA"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event => this.props.mudarGainDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="GainExecGrafico_CA"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event => this.props.mudarGainExecAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopDisparoGrafico_CA"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event => this.props.mudarStopDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopExecGrafico_CA"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event => this.props.mudarStopExecAction(event)}
            />
            <Form.Control
              id="CotacaoAtualGrafico_CA"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          {LabelInputGrafico("Disparo", "TextoGainDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_CA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CA")}
          {TextoGainStopGrafico("GAIN", "TextoGain_CA")}
          {TextoGainStopGrafico("STOP", "TextoStop_CA")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CA")}
          <IconeConfigGrafico id="ConfigGainGrafico_CA" />
          <IconeConfigGrafico id="ConfigStopGrafico_CA" />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.formInputReducer.gainDisparo,
  gainExec: state.formInputReducer.gainExec,
  stopDisparo: state.formInputReducer.stopDisparo,
  stopExec: state.formInputReducer.stopExec,
  cotacaoAtual: state.formInputReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(GraficoCompraStartMovel);
