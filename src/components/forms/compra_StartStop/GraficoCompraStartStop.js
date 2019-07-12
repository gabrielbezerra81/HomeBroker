import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../redux/actions/formInputActions";
import IconeConfigGrafico from "../../utils/IconeConfigGrafico";
import graficoCompraStartStop from "../../../img/compraStartStop.PNG";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "../../utils/TextoGrafico";

class GraficoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={graficoCompraStartStop} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="GainDisparoGrafico_CST"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event => this.props.mudarGainDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="GainExecGrafico_CST"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event => this.props.mudarGainExecAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopDisparoGrafico_CST"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event => this.props.mudarStopDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopExecGrafico_CST"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event => this.props.mudarStopExecAction(event)}
            />
            <Form.Control
              id="CotacaoAtualGrafico_CST"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          <IconeConfigGrafico id="ConfigGainGrafico_CST" />
          <IconeConfigGrafico id="ConfigStopGrafico_CST" />
          {TextoValorTotalGrafico(26.5, "ValorTotalGain")}
          {TextoValorTotalGrafico(26.5, "ValorTotalStop")}
          {LabelInputGrafico("Disparo", "TextoGainDisparo_CST")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_CST")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CST")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CST")}
          {TextoGainStopGrafico("GAIN", "TextoGain_CST")}
          {TextoGainStopGrafico("STOP", "TextoStop_CST")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CST")}
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
)(GraficoCompraStartStop);
