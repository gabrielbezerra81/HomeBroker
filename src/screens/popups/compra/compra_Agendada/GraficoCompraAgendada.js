import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "assets/compra/CompraModeloNovo.png";
import IconeConfigGrafico from "shared/componentes/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico,
} from "shared/componentes/TextoGraficoBoletas";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import InputGroupBoletaGraphic from "shared/componentes/BoletaGraphics/InputGroupBoletaGraphic";

class GraficoCompraAgendada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <InputGroupBoletaGraphic
            namespace={COMPRA_AGENDADA_NAMESPACE}
            boletaType="graficoTipoAgendada"
            cv="CA"
          />
          <Form.Control
            className="inputGrafico CotacaoAtualGrafico_CA"
            value={this.props.dadosPesquisa.cotacaoAtual}
            onChange={() => false}
          />

          {LabelInputGrafico("Disparo", "TextoGainDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_CA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CA")}
          {TextoGainStopGrafico("GAIN", "TextoGain_CA")}
          {TextoGainStopGrafico("STOP", "TextoStop_CA")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CA")}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.gainDisparo,
              this.props.gainExec,
              this.props.qtde,
            ),
            "ValorTotalGain",
          )}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde,
            ),
            "ValorTotalStop",
          )}
          <IconeConfigGrafico
            className="ConfigGainGrafico_CA"
            name="compra_gainreducao"
          />
          <IconeConfigGrafico
            className="ConfigStopGrafico_CA"
            name="venda_stopmovel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  qtde: state.compraAgendadaReducer.qtde,
});

export default connect(mapStateToProps, {})(GraficoCompraAgendada);
