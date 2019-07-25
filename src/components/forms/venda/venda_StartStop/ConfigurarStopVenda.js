import React from "react";
import configurarStop from "img/venda/VendaConfigurar.png";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import { mostrarConfigurarStopAction } from "components/redux/actions/compraStartStopActions";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico
} from "components/utils/TextoGrafico";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarInputConfigAction
} from "components/redux/actions/formInputActions";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { fecharFormularioAction } from "components/redux/actions/AppActions";

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
      variant="link"
      className="iconesHeader"
      onClick={event => props.fecharFormularioAction(event)}
      name="config_venda"
    >
      <span className="fa-stack">
        <MDBIcon icon="circle" className="fa-stack-2x" />
        <MDBIcon
          icon="times"
          className="fa-stack-1x iconeFechar"
          name="config_venda"
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
    {TextoValorTotalGrafico(
      "TOTAL",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig1,
        props.stopExecConfig1,
        props.qtde
      ),
      "ValorTotalStop1_CONFIGURAR_VENDA"
    )}
    {TextoValorTotalGrafico(
      "TOTAL",
      CalculoValorTotalAgendada(
        props.gainDisparoConfig1,
        props.gainExecConfig1,
        props.qtde
      ),
      "ValorTotalGain1_CONFIGURAR_VENDA"
    )}
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
    {TextoValorTotalGrafico(
      "TOTAL",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig2,
        props.stopExecConfig2,
        props.qtde
      ),
      "ValorTotalStop2_CONFIGURAR_VENDA"
    )}
    {TextoValorTotalGrafico(
      "TOTAL",
      CalculoValorTotalAgendada(
        props.gainDisparoConfig2,
        props.gainExecConfig2,
        props.qtde
      ),
      "ValorTotalGain2_CONFIGURAR_VENDA"
    )}
    <Form>
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainDisparoConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="gainDisparoConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainExecConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="gainExecConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopDisparoConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="stopDisparoConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopExecConfig1}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="stopExecConfig1"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainDisparoGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainDisparoConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="gainDisparoConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="GainExecGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.gainExecConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="gainExecConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopDisparoGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopDisparoConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="stopDisparoConfig2"
      />
      <Form.Control
        type="number"
        step={0.01}
        id="StopExecGrafico2_CONFIGURAR_VENDA"
        className="inputGrafico"
        value={props.stopExecConfig2}
        onChange={event =>
          props.mudarInputConfigAction(event, VENDA_STARTSTOP_NAMESPACE)
        }
        name="stopExecConfig2"
      />
    </Form>
  </div>
);

const mapStateToProps = state => ({
  qtde: state.vendaStartStopReducer.qtde,
  gainDisparoConfig1: state.vendaStartStopReducer.gainDisparoConfig1,
  gainExecConfig1: state.vendaStartStopReducer.gainExecConfig1,
  stopDisparoConfig1: state.vendaStartStopReducer.stopDisparoConfig1,
  stopExecConfig1: state.vendaStartStopReducer.stopExecConfig1,
  gainDisparoConfig2: state.vendaStartStopReducer.gainDisparoConfig2,
  gainExecConfig2: state.vendaStartStopReducer.gainExecConfig2,
  stopDisparoConfig2: state.vendaStartStopReducer.stopDisparoConfig2,
  stopExecConfig2: state.vendaStartStopReducer.stopExecConfig2
});

export default connect(
  mapStateToProps,
  {
    mostrarConfigurarStopAction,
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    fecharFormularioAction,
    mudarInputConfigAction
  }
)(ConfigurarStopVenda);
