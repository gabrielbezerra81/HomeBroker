import React from "react";
import { Col, Form, Button, Row } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../redux/actions/compraAgendadaActions";
import img from "../../../img/compraStartStop.PNG";

class GraficoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico_StartStop">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
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
          <div
            id="ConfigGainGrafico_CST"
            className="wrapperIconeConfiguracaoGrafico"
          >
            <Button variant="" className="iconeConfiguracaoGrafico">
              <MDBIcon icon="cog" size="2x" />
            </Button>
          </div>
          <div
            id="ConfigStopGrafico_CST"
            className="wrapperIconeConfiguracaoGrafico"
          >
            <Button variant="" className="iconeConfiguracaoGrafico">
              <MDBIcon icon="cog" size="2x" />
            </Button>
          </div>
          <div className="wrapperValorTotalGrafico" id="ValorTotalGain">
            <h6>VALOR TOTAL</h6>
            <h6>26,50</h6>
          </div>
          <div className="wrapperValorTotalGrafico" id="ValorTotalStop">
            <h6>VALOR TOTAL</h6>
            <h6>26,50</h6>
          </div>
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
)(GraficoCompraStartStop);
