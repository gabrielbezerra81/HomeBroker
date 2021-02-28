import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";

import img from "assets/venda/VendaAgendada.png";
import IconeConfigGrafico from "shared/components/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { VENDA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import InputGroupBoletaGraphic from "modules/boletas/components/BoletaGraphics/InputGroupBoletaGraphic";

class GraficoVendaMercado extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <InputGroupBoletaGraphic
              namespace={VENDA_MERCADO_NAMESPACE}
              boletaType="graficoTipoAgendada"
              cv="VA"
            />
            <Form.Control
              className="graphQuoteInput CotacaoAtualGrafico_VA"
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
          <IconeConfigGrafico
            className="ConfigGainGrafico_VA"
            name="venda_gainreducao"
          />
          <IconeConfigGrafico
            className="ConfigStopGrafico_VA"
            name="venda_stopmovel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  gainDisparo: state.vendaMercadoReducer.gainDisparo,
  gainExec: state.vendaMercadoReducer.gainExec,
  stopDisparo: state.vendaMercadoReducer.stopDisparo,
  stopExec: state.vendaMercadoReducer.stopExec,
  dadosPesquisa: state.vendaMercadoReducer.dadosPesquisa,
  qtde: state.vendaMercadoReducer.qtde,
});

export default connect(mapStateToProps, {})(GraficoVendaMercado);
