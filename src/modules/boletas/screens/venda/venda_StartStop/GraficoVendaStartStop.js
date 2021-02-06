import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import IconeConfigGrafico from "shared/componentes/IconeConfigGrafico";
import graficoCompraStartStop from "assets/venda/VendaAgendada.png";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import { abrirFormConfigurarAction } from "redux/actions/GlobalAppActions";
import InputGroupBoletaGraphic from "modules/boletas/components/BoletaGraphics/InputGroupBoletaGraphic";

class GraficoVendaStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={graficoCompraStartStop} className="imgChart" alt="" />
          <Form>
            <InputGroupBoletaGraphic
              namespace={VENDA_STARTSTOP_NAMESPACE}
              boletaType="graficoTipoAgendada"
              cv="VA"
            />
            <Form.Control
              className="graphQuoteInput CotacaoAtualGrafico_VA"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          <IconeConfigGrafico
            className="ConfigGainGrafico_VA"
            name="config_venda"
          />
          <IconeConfigGrafico
            className="ConfigStopGrafico_VA"
            name="config_venda"
          />
          {LabelInputGrafico("Disparo", "TextoGainDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_VA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_VA")}
          {TextoGainStopGrafico("START", "TextoGain_VA")}
          {TextoGainStopGrafico("STOP", "TextoStop_VA")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VA")}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde,
            ),
            "ValorTotalGain_Venda",
          )}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.gainDisparo,
              this.props.gainExec,
              this.props.qtde,
            ),
            "ValorTotalStop_Venda",
          )}
        </div>
      </Col>
    );
  }
}

//

const mapStateToProps = (state) => ({
  gainDisparo: state.vendaStartStopReducer.gainDisparo,
  gainExec: state.vendaStartStopReducer.gainExec,
  stopDisparo: state.vendaStartStopReducer.stopDisparo,
  stopExec: state.vendaStartStopReducer.stopExec,
  dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa,
  qtde: state.vendaStartStopReducer.qtde,
});

export default connect(mapStateToProps, {
  abrirFormConfigurarAction,
})(GraficoVendaStartStop);
