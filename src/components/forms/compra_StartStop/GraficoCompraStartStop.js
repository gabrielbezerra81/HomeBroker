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
import graficoCompraStartStop from "../../../img/CompraModeloNovo.png";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "../../utils/TextoGrafico";
import { COMPRA_STARTSTOP_NAMESPACE } from "../../../constants/ActionTypes";

class GraficoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={graficoCompraStartStop} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="GainDisparoGrafico_CST"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event =>
                this.props.mudarGainDisparoAction(
                  event,
                  COMPRA_STARTSTOP_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="GainExecGrafico_CST"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event =>
                this.props.mudarGainExecAction(
                  event,
                  COMPRA_STARTSTOP_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopDisparoGrafico_CST"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event =>
                this.props.mudarStopDisparoAction(
                  event,
                  COMPRA_STARTSTOP_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopExecGrafico_CST"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(
                  event,
                  COMPRA_STARTSTOP_NAMESPACE
                )
              }
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

// {TextoValorTotalGrafico(26.5, "ValorTotalGain")}
//{TextoValorTotalGrafico(26.5, "ValorTotalStop")}

const mapStateToProps = state => ({
  gainDisparo: state.compraStartStopReducer.gainDisparo,
  gainExec: state.compraStartStopReducer.gainExec,
  stopDisparo: state.compraStartStopReducer.stopDisparo,
  stopExec: state.compraStartStopReducer.stopExec,
  cotacaoAtual: state.compraStartStopReducer.cotacaoAtual
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
