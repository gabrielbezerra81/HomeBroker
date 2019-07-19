import React from "react";
import configurarStop from "../../../img/compra/configurarStop.PNG";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import IconeConfigGrafico from "../../utils/IconeConfigGrafico";
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
  mudarStopExecAction,
  mudarInputConfigAction
} from "../../redux/actions/formInputActions";
import { CalculoValorTotalAgendada } from "../../utils/CalculoValorTotal";
import { fecharFormularioAction } from "../../redux/actions/AppActions";

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
      onClick={event => props.fecharFormularioAction(event)}
      name="config_compra"
    >
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon
          icon="times"
          className="fa-stack-1x iconeFechar"
          name="config_compra"
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
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(props.gainDisparo, props.gainExec, props.qtde),
      "ValorTotalGain1_CONFIGURAR"
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(props.stopDisparo, props.stopExec, props.qtde),
      "ValorTotalStop1_CONFIGURAR"
    )}
    <IconeConfigGrafico
      id="ConfigGain1Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      id="ConfigStop1Grafico_CONFIGURAR"
      name="venda_stop_movel"
    />
    <IconeConfigGrafico
      id="ConfigGain2Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      id="ConfigStop2Grafico_CONFIGURAR"
      name="venda_stop_movel"
    />
    {LabelInputGrafico("Disparo", "TextoGainDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoGainExecucao2_CONFIGURAR")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoStopExecucao2_CONFIGURAR")}
    {TextoGainStopGrafico("GAIN", "TextoGain2_CONFIGURAR")}
    {TextoGainStopGrafico("LOSS", "TextoStop2_CONFIGURAR")}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(props.gainDisparo, props.gainExec, props.qtde),
      "ValorTotalGain2_CONFIGURAR"
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(props.stopDisparo, props.stopExec, props.qtde),
      "ValorTotalStop2_CONFIGURAR"
    )}
    <Form>
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.gainDisparoConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="gainDisparoConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.gainExecConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="gainExecConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.stopDisparoConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="stopDisparoConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico_CONFIGURAR"
        className="inputGrafico"
        value={props.stopExecConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="stopExecConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.gainDisparoConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="gainDisparoConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.gainExecConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="gainExecConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.stopDisparoConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="stopDisparoConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico2_CONFIGURAR"
        className="inputGrafico"
        value={props.stopExecConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, COMPRA_STARTSTOP_NAMESPACE)
        }
        name="stopExecConfig2"
      />
    </Form>
  </div>
);

const mapStateToProps = state => ({
  qtde: state.bookOfertaReducer.qtde,
  gainDisparoConfig1: state.compraStartStopReducer.gainDisparoConfig1,
  gainExecConfig1: state.compraStartStopReducer.gainExecConfig1,
  stopDisparoConfig1: state.compraStartStopReducer.stopDisparoConfig1,
  stopExecConfig1: state.compraStartStopReducer.stopExecConfig1,
  gainDisparoConfig2: state.compraStartStopReducer.gainDisparoConfig2,
  gainExecConfig2: state.compraStartStopReducer.gainExecConfig2,
  stopDisparoConfig2: state.compraStartStopReducer.stopDisparoConfig2,
  stopExecConfig2: state.compraStartStopReducer.stopExecConfig2
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    fecharFormularioAction,
    mudarInputConfigAction
  }
)(ConfigurarStop);
