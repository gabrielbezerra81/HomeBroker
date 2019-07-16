import React from "react";
import configurarStop from "../../../../img/venda/VendaConfigurar.png";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import IconeConfigGrafico from "../../../utils/IconeConfigGrafico";
import { mostrarConfigurarStopAction } from "../../../redux/actions/compraStartStopActions";
import { VENDA_STARTSTOP_NAMESPACE } from "../../../../constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico
} from "../../../utils/TextoGrafico";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "../../../redux/actions/formInputActions";

class ConfigurarStopVenda extends React.Component {
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
        props.mostrarConfigurarStopAction(VENDA_STARTSTOP_NAMESPACE)
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
    {LabelInputGrafico("Disparo", "TextoGainDisparo_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Execução", "TextoGainExecucao_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Execução", "TextoStopExecucao_CONFIGURAR_VENDA")}
    {TextoGainStopGrafico("GAIN", "TextoGain_CONFIGURAR_VENDA")}
    {TextoGainStopGrafico("LOSS", "TextoStop_CONFIGURAR_VENDA")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalGain1_CONFIGURAR_VENDA")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalStop1_CONFIGURAR_VENDA")}
    <IconeConfigGrafico id="ConfigGain1Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico id="ConfigStop1Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico id="ConfigGain2Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico id="ConfigStop2Grafico_CONFIGURAR_VENDA" />
    {LabelInputGrafico("Disparo", "TextoGainDisparo2_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Execução", "TextoGainExecucao2_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo2_CONFIGURAR_VENDA")}
    {LabelInputGrafico("Execução", "TextoStopExecucao2_CONFIGURAR_VENDA")}
    {TextoGainStopGrafico("GAIN", "TextoGain2_CONFIGURAR_VENDA")}
    {TextoGainStopGrafico("LOSS", "TextoStop2_CONFIGURAR_VENDA")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalGain2_CONFIGURAR_VENDA")}
    {TextoValorTotalGrafico("TOTAL", 26.5, "ValorTotalStop2_CONFIGURAR_VENDA")}
    <Form>
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainDisparo}
        onChange={event =>
          props.mudarGainDisparoAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainExec}
        onChange={event =>
          props.mudarGainExecAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopDisparo}
        onChange={event =>
          props.mudarStopDisparoAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopExec}
        onChange={event =>
          props.mudarStopExecAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainDisparo}
        onChange={event =>
          props.mudarGainDisparoAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainExec}
        onChange={event =>
          props.mudarGainExecAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopDisparo}
        onChange={event =>
          props.mudarStopDisparoAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopExec}
        onChange={event =>
          props.mudarStopExecAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
      />
    </Form>
  </div>
);

const mapStateToProps = state => ({
  gainDisparo: state.vendaStartStopReducer.gainDisparo,
  gainExec: state.vendaStartStopReducer.gainExec,
  stopDisparo: state.vendaStartStopReducer.stopDisparo,
  stopExec: state.vendaStartStopReducer.stopExec
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
)(ConfigurarStopVenda);
