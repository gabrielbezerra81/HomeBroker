import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "img/compra/CompraModeloNovo.png";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico
} from "components/utils/TextoGrafico";
import { COMPRA_AGENDADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoCompraAgendada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <GraficoInputs
            namespace={COMPRA_AGENDADA_NAMESPACE}
            tipoBoleta="graficoTipoAgendada"
            cv="CA"
          />
          <Form.Control
            id="CotacaoAtualGrafico_CA"
            className="inputGrafico"
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
            handleShow={this.props.handleShow}
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_CA"
            name="venda_stop_movel"
            handleShow={this.props.handleShow}
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.compraAgendadaReducer.gainDisparo,
  gainExec: state.compraAgendadaReducer.gainExec,
  stopDisparo: state.compraAgendadaReducer.stopDisparo,
  stopExec: state.compraAgendadaReducer.stopExec,
  dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa,
  valorTotal: state.compraAgendadaReducer.valorTotal,
  qtde: state.compraAgendadaReducer.qtde
});

export default connect(
  mapStateToProps,
  {}
)(GraficoCompraAgendada);
