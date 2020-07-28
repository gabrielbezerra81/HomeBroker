import React from "react";
import configurarStop from "assets/venda/VendaConfigurar.png";
import { connect } from "react-redux";
import IconeConfigGrafico from "components/utils/componentesUI/IconeConfigGrafico";
import { mostrarConfigurarStopAction } from "redux/actions/boletas/compraStartStopActions";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico,
} from "components/utils/componentesUI/TextoGraficoBoletas";
import { mudarInputConfigAction } from "redux/actions/boletas/formInputActions";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { fecharFormConfigurarAction } from "redux/actions/GlobalAppActions";
import { ModalHeaderLimpo } from "components/utils/componentesUI/FormHeader";
import GraficoInputsConfigStartStop from "components/utils/componentesUI/GraficoInputsConfigStartStop";

class ConfigurarStopVenda extends React.Component {
  render() {
    return (
      <div className="configDiv mcontent">
        <ModalHeaderLimpo titulo="CONFIGURAR STOP" name="config_venda" />

        {modalBody(this.props)}
      </div>
    );
  }
}

const modalBody = (props) => (
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
    <IconeConfigGrafico className="ConfigGain1Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico className="ConfigStop1Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico className="ConfigGain2Grafico_CONFIGURAR_VENDA" />
    <IconeConfigGrafico className="ConfigStop2Grafico_CONFIGURAR_VENDA" />
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
    <GraficoInputsConfigStartStop
      namespace={VENDA_STARTSTOP_NAMESPACE}
      cv="venda"
      posicionamento="_VENDA"
    />
  </div>
);

export const mapStateToPropsConfigStopVenda = (state) => ({
  qtde: state.vendaStartStopReducer.qtde,
  gainDisparoConfig1: state.vendaStartStopReducer.gainDisparoConfig1,
  gainExecConfig1: state.vendaStartStopReducer.gainExecConfig1,
  stopDisparoConfig1: state.vendaStartStopReducer.stopDisparoConfig1,
  stopExecConfig1: state.vendaStartStopReducer.stopExecConfig1,
  gainDisparoConfig2: state.vendaStartStopReducer.gainDisparoConfig2,
  gainExecConfig2: state.vendaStartStopReducer.gainExecConfig2,
  stopDisparoConfig2: state.vendaStartStopReducer.stopDisparoConfig2,
  stopExecConfig2: state.vendaStartStopReducer.stopExecConfig2,
});

export default connect(mapStateToPropsConfigStopVenda, {
  mostrarConfigurarStopAction,
  fecharFormConfigurarAction,
  mudarInputConfigAction,
})(ConfigurarStopVenda);
