import React from "react";
// @ts-ignore
import configurarStop from "img/compra/configurarStop.PNG";
import { connect } from "react-redux";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico
} from "components/utils/TextoGrafico";
import { mudarInputConfigAction } from "components/redux/actions/formInputActions";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { fecharFormConfigurarAction } from "components/redux/reducers/MainAppReducer";
import { modalHeaderLimpo } from "components/utils/FormHeader";
import GraficoInputsConfigStartStop from "components/utils/GraficoInputsConfigStartStop";

class ConfigurarStop extends React.Component {
  render() {
    return (
      <div className="configDiv mcontent">
        {modalHeaderLimpo(
          event => this.props.fecharFormConfigurarAction(event),
          "CONFIGURAR STOP",
          "config_compra"
        )}
        {modalBody(this.props)}
      </div>
    );
  }
}

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
      CalculoValorTotalAgendada(
        props.gainDisparoConfig1,
        props.gainExecConfig1,
        props.qtde
      ),
      "ValorTotalGain1_CONFIGURAR"
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig1,
        props.stopExecConfig1,
        props.qtde
      ),
      "ValorTotalStop1_CONFIGURAR"
    )}
    <IconeConfigGrafico
      id="ConfigGain1Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      id="ConfigStop1Grafico_CONFIGURAR"
      name="venda_stopmovel"
    />
    <IconeConfigGrafico
      id="ConfigGain2Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      id="ConfigStop2Grafico_CONFIGURAR"
      name="venda_stopmovel"
    />
    <GraficoInputsConfigStartStop
      namespace={COMPRA_STARTSTOP_NAMESPACE}
      cv="compra"
      posicionamento=""
    />
    {LabelInputGrafico("Disparo", "TextoGainDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoGainExecucao2_CONFIGURAR")}
    {LabelInputGrafico("Disparo", "TextoStopDisparo2_CONFIGURAR")}
    {LabelInputGrafico("Execução", "TextoStopExecucao2_CONFIGURAR")}
    {TextoGainStopGrafico("GAIN", "TextoGain2_CONFIGURAR")}
    {TextoGainStopGrafico("LOSS", "TextoStop2_CONFIGURAR")}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(
        props.gainDisparoConfig2,
        props.gainExecConfig2,
        props.qtde
      ),
      "ValorTotalGain2_CONFIGURAR"
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig2,
        props.stopExecConfig2,
        props.qtde
      ),
      "ValorTotalStop2_CONFIGURAR"
    )}
  </div>
);

export const mapStateToPropsConfigurarStop = state => ({
  qtde: state.compraStartStopReducer.qtde,
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
  mapStateToPropsConfigurarStop,
  {
    fecharFormConfigurarAction,
    mudarInputConfigAction
  }
)(ConfigurarStop);
