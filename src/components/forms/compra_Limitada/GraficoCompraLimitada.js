import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../redux/actions/compraAgendadaActions";
import img from "../../../img/compraAgendada.PNG";
import IconeConfigGrafico from "../../IconeConfigGrafico";

class GraficoCompraLimitada extends React.Component {
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
              id="GainDisparoGrafico_CL"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event => this.props.mudarGainDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="GainExecGrafico_CL"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event => this.props.mudarGainExecAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopDisparoGrafico_CL"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event => this.props.mudarStopDisparoAction(event)}
            />
            <Form.Control
              type="number"
              step={0.1}
              min={0}
              id="StopExecGrafico_CL"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event => this.props.mudarStopExecAction(event)}
            />
            <Form.Control
              id="CotacaoAtualGrafico_CL"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          <IconeConfigGrafico id="ConfigGainGrafico_CL" />
          <IconeConfigGrafico id="ConfigStopGrafico_CL" />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  cotacaoAtual: state.compraAgendadaReducer.cotacaoAtual
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(GraficoCompraLimitada);
