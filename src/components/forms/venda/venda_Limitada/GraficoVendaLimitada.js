import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../../redux/actions/formInputActions";
import img from "../../../../img/venda/VendaAgendada.png";
import IconeConfigGrafico from "../../../utils/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico
} from "../../../utils/TextoGrafico";
import { VENDA_LIMITADA_NAMESPACE } from "../../../../constants/ActionTypes";

class GraficoVendaLimitada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="GainDisparoGrafico_VA"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event =>
                this.props.mudarGainDisparoAction(
                  event,
                  VENDA_LIMITADA_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="GainExecGrafico_VA"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event =>
                this.props.mudarGainExecAction(event, VENDA_LIMITADA_NAMESPACE)
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopDisparoGrafico_VA"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event =>
                this.props.mudarStopDisparoAction(
                  event,
                  VENDA_LIMITADA_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopExecGrafico_VA"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(event, VENDA_LIMITADA_NAMESPACE)
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_VA"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          {LabelInputGrafico("Disparo", "TextoGainDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_VA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_VA")}
          {TextoGainStopGrafico("GAIN", "TextoGain_VA")}
          {TextoGainStopGrafico("STOP", "TextoStop_VA")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VA")}
          {TextoValorTotalGrafico("VALOR TOTAL", 26.5, "ValorTotalGain")}
          {TextoValorTotalGrafico("VALOR TOTAL", 26.5, "ValorTotalStop")}
          <IconeConfigGrafico id="ConfigGainGrafico_VA" />
          <IconeConfigGrafico id="ConfigStopGrafico_VA" />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.vendaLimitadaReducer.gainDisparo,
  gainExec: state.vendaLimitadaReducer.gainExec,
  stopDisparo: state.vendaLimitadaReducer.stopDisparo,
  stopExec: state.vendaLimitadaReducer.stopExec,
  cotacaoAtual: state.vendaLimitadaReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(GraficoVendaLimitada);
