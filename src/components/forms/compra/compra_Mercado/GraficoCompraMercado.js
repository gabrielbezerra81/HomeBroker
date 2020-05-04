import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "img/compra/CompraModeloNovo.png";
import IconeConfigGrafico from "components/utils/componentesUI/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico,
} from "components/utils/componentesUI/TextoGraficoBoletas";
import { COMPRA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import GraficoInputs from "components/utils/componentesUI/GraficoInputs";

class GraficoCompraMercado extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={COMPRA_MERCADO_NAMESPACE}
              tipoBoleta="graficoTipoAgendada"
              cv="CA"
            />
            <Form.Control
              id="CotacaoAtualGrafico_CA"
              className="inputGrafico"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
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
              this.props.qtde
            ),
            "ValorTotalGain"
          )}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde
            ),
            "ValorTotalStop"
          )}
          <IconeConfigGrafico
            id="ConfigGainGrafico_CA"
            name="compra_gainreducao"
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_CA"
            name="venda_stopmovel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  gainDisparo: state.compraMercadoReducer.gainDisparo,
  gainExec: state.compraMercadoReducer.gainExec,
  stopDisparo: state.compraMercadoReducer.stopDisparo,
  stopExec: state.compraMercadoReducer.stopExec,
  dadosPesquisa: state.compraMercadoReducer.dadosPesquisa,
  qtde: state.compraMercadoReducer.qtde,
});

export default connect(mapStateToProps, {})(GraficoCompraMercado);
