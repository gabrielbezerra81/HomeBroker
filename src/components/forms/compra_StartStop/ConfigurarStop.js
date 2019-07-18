import React from "react";
import configurarStop from "../../../img/compra/configurarStop.PNG";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import IconeConfigGrafico from "../../utils/IconeConfigGrafico";
import { mostrarConfigurarStopAction } from "../../redux/actions/compraStartStopActions";
import { COMPRA_STARTSTOP_NAMESPACE } from "../../../constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico
} from "../../utils/TextoGrafico";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../redux/actions/formInputActions";

class ConfigurarStop extends React.Component {
  render() {
    return (
      <div className="configDiv mcontent">
        <div className="border-green mheader">
          <h6 className="mtitle">CONFIGURAR STOP</h6>
          {modalHeader(this.props)}
        </div>
        {modalBody(this.props)}
      </div>
    );
  }
}

const modalHeader = props => (
  <div className="wrapperIconesHeader">
    <Button
      variant=""
      className="iconesHeader"
      onClick={() =>
        props.mostrarConfigurarStopAction(COMPRA_STARTSTOP_NAMESPACE)
      }
    >
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon
          icon="times"
          className="fa-stack-1x iconeFechar"
          name="startstop"
        />
      </span>
    </Button>
  </div>
);

const modalBody = props => (
  <div className="imgContainer imgConfigurar">
    <img src={configurarStop} className="imgChart" alt="" />
    {LabelInputGrafico("Disparo", "TextoGainDisparo_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoGainExecucao_CONFIGURAR")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoStopExecucao_CONFIGURAR")}
    {TextoGainStopGrafico("GAIN", "TextoGain_CONFIGURAR")}
    {TextoGainStopGrafico("LOSS", "TextoStop_CONFIGURAR")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalGain1_CONFIGURAR")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalStop1_CONFIGURAR")}
    <IconeConfigGrafico id="ConfigGain1Grafico_CONFIGURAR" name="compra_gainreducao"/>
    <IconeConfigGrafico id="ConfigStop1Grafico_CONFIGURAR" name="venda_stop_movel"/>
    <IconeConfigGrafico id="ConfigGain2Grafico_CONFIGURAR" name="compra_gainreducao"/>
    <IconeConfigGrafico id="ConfigStop2Grafico_CONFIGURAR" name="venda_stop_movel"/>
    {LabelInputGrafico("Disparo", "TextoGainDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoGainExecucao2_CONFIGURAR")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoStopExecucao2_CONFIGURAR")}
    {TextoGainStopGrafico("GAIN", "TextoGain2_CONFIGURAR")}
    {TextoGainStopGrafico("LOSS", "TextoStop2_CONFIGURAR")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalGain2_CONFIGURAR")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalStop2_CONFIGURAR")}
    <Form>
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.gainDisparo}
        onChange={event =>
          props.mudarGainDisparoAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.gainExec}
        onChange={event =>
          props.mudarGainExecAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.stopDisparo}
        onChange={event =>
          props.mudarStopDisparoAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.stopExec}
        onChange={event =>
          props.mudarStopExecAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.gainDisparo}
        onChange={event =>
          props.mudarGainDisparoAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.gainExec}
        onChange={event =>
          props.mudarGainExecAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.stopDisparo}
        onChange={event =>
          props.mudarStopDisparoAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.stopExec}
        onChange={event =>
          props.mudarStopExecAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
      />
    </Form>
  </div>
);

const mapStateToProps = state => ({
  gainDisparo: state.compraStartStopReducer.gainDisparo,
  gainExec: state.compraStartStopReducer.gainExec,
  stopDisparo: state.compraStartStopReducer.stopDisparo,
  stopExec: state.compraStartStopReducer.stopExec
});

export default connect(
  mapStateToProps,
  {
    mostrarConfigurarStopAction,
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(ConfigurarStop);
