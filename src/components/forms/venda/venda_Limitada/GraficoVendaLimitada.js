import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";

import img from "img/venda/VendaAgendada.png";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico
} from "components/utils/TextoGrafico";
import { VENDA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoVendaLimitada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={VENDA_LIMITADA_NAMESPACE}
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
            "",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde
            ),
            "ValorTotalGain_Venda"
          )}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.gainDisparo,
              this.props.gainExec,
              this.props.qtde
            ),
            "ValorTotalStop_Venda"
          )}
          <IconeConfigGrafico
            id="ConfigGainGrafico_VA"
            handleShow={this.props.handleShow}
            name="venda_gainreducao"
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_VA"
            handleShow={this.props.handleShow}
            name="venda_stop_movel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.vendaLimitadaReducer.gainDisparo,
  gainExec: state.vendaLimitadaReducer.gainExec,
  stopDisparo: state.vendaLimitadaReducer.stopDisparo,
  stopExec: state.vendaLimitadaReducer.stopExec,
  dadosPesquisa: state.vendaLimitadaReducer.dadosPesquisa,
  qtde: state.vendaLimitadaReducer.qtde
});

export default connect(
  mapStateToProps,
  {}
)(GraficoVendaLimitada);
