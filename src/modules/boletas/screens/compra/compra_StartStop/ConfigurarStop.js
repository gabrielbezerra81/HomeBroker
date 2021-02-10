import React from "react";
// @ts-ignore
import { connect } from "react-redux";
import configurarStop from "assets/compra/configurarStop.PNG";
import IconeConfigGrafico from "shared/componentes/IconeConfigGrafico";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoValorTotalGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { mudarInputConfigAction } from "modules/boletas/duck/actions/boletaActions";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import { fecharFormConfigurarAction } from "redux/actions/GlobalAppActions";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import InputGroupGraphicConfigStartStop from "modules/boletas/components/BoletaGraphics/InputGroupGraphicConfigStartStop";

class ConfigurarStop extends React.Component {
  render() {
    return (
      <div className="configDiv mcontent">
        <ModalHeaderClean
          funcaoFechar={(event) => this.props.fecharFormConfigurarAction(event)}
          titulo="CONFIGURAR STOP"
          name="config_compra"
        />
        {modalBody(this.props)}
      </div>
    );
  }
}

const modalBody = (props) => (
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
        props.qtde,
      ),
      "ValorTotalGain1_CONFIGURAR",
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig1,
        props.stopExecConfig1,
        props.qtde,
      ),
      "ValorTotalStop1_CONFIGURAR",
    )}
    <IconeConfigGrafico
      className="ConfigGain1Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      className="ConfigStop1Grafico_CONFIGURAR"
      name="venda_stopmovel"
    />
    <IconeConfigGrafico
      className="ConfigGain2Grafico_CONFIGURAR"
      name="compra_gainreducao"
    />
    <IconeConfigGrafico
      className="ConfigStop2Grafico_CONFIGURAR"
      name="venda_stopmovel"
    />
    <InputGroupGraphicConfigStartStop
      namespace={COMPRA_STARTSTOP_NAMESPACE}
      cv="compra"
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
        props.qtde,
      ),
      "ValorTotalGain2_CONFIGURAR",
    )}
    {TextoValorTotalGrafico(
      "",
      CalculoValorTotalAgendada(
        props.stopDisparoConfig2,
        props.stopExecConfig2,
        props.qtde,
      ),
      "ValorTotalStop2_CONFIGURAR",
    )}
  </div>
);

export const mapStateToPropsConfigurarStop = (state) => ({
  qtde: state.compraStartStopReducer.qtde,
  gainDisparoConfig1: state.compraStartStopReducer.gainDisparoConfig1,
  gainExecConfig1: state.compraStartStopReducer.gainExecConfig1,
  stopDisparoConfig1: state.compraStartStopReducer.stopDisparoConfig1,
  stopExecConfig1: state.compraStartStopReducer.stopExecConfig1,
  gainDisparoConfig2: state.compraStartStopReducer.gainDisparoConfig2,
  gainExecConfig2: state.compraStartStopReducer.gainExecConfig2,
  stopDisparoConfig2: state.compraStartStopReducer.stopDisparoConfig2,
  stopExecConfig2: state.compraStartStopReducer.stopExecConfig2,
});

export default connect(mapStateToPropsConfigurarStop, {
  fecharFormConfigurarAction,
  mudarInputConfigAction,
})(ConfigurarStop);
