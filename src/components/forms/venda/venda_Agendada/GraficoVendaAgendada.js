import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "img/venda/VendaAgendada.png";
import IconeConfigGrafico from "components/utils/componentesUI/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico,
} from "components/utils/componentesUI/TextoGraficoBoletas";
import { VENDA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import GraficoInputs from "components/utils/componentesUI/GraficoInputs";

class GraficoVendaAgendada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={VENDA_AGENDADA_NAMESPACE}
              tipoBoleta="graficoTipoAgendada"
              cv="VA"
            />
            <Form.Control
              id="CotacaoAtualGrafico_VA"
              className="inputGrafico"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          {LabelInputGrafico("Disparo", "TextoGainDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_VA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_VA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_VA")}
          {TextoGainStopGrafico("GAIN", "TextoGain_VA")}
          {TextoGainStopGrafico("STOP", "TextoStop_VA")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VA")}
          {TextoValorTotalGrafico(
            "VALOR TOTAL",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde
            ),
            "ValorTotalGain_Venda"
          )}
          {TextoValorTotalGrafico(
            "VALOR TOTAL",
            CalculoValorTotalAgendada(
              this.props.gainDisparo,
              this.props.gainExec,
              this.props.qtde
            ),
            "ValorTotalStop_Venda"
          )}
          <IconeConfigGrafico
            id="ConfigGainGrafico_VA"
            name="venda_gainreducao"
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_VA"
            name="venda_stopmovel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  gainDisparo: state.vendaAgendadaReducer.gainDisparo,
  gainExec: state.vendaAgendadaReducer.gainExec,
  stopDisparo: state.vendaAgendadaReducer.stopDisparo,
  stopExec: state.vendaAgendadaReducer.stopExec,
  dadosPesquisa: state.vendaAgendadaReducer.dadosPesquisa,
  valorTotal: state.vendaAgendadaReducer.valorTotal,
  qtde: state.vendaAgendadaReducer.qtde,
});

export default connect(mapStateToProps, {})(GraficoVendaAgendada);
