import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import graficoCompraStartStop from "img/venda/VendaAgendada.png";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "components/utils/TextoGrafico";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { abrirFormConfigurarAction } from "components/redux/reducers/MainAppReducer";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoVendaStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={graficoCompraStartStop} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={VENDA_STARTSTOP_NAMESPACE}
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
          <IconeConfigGrafico
            id="ConfigGainGrafico_VA"
            name="config_venda"
            handleShow={event => {
              this.props.abrirFormConfigurarAction(event, this.props);
            }}
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_VA"
            name="config_venda"
            handleShow={event => {
              this.props.abrirFormConfigurarAction(event, this.props);
            }}
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
        </div>
      </Col>
    );
  }
}

//

const mapStateToProps = state => ({
  gainDisparo: state.vendaStartStopReducer.gainDisparo,
  gainExec: state.vendaStartStopReducer.gainExec,
  stopDisparo: state.vendaStartStopReducer.stopDisparo,
  stopExec: state.vendaStartStopReducer.stopExec,
  dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa,
  qtde: state.vendaStartStopReducer.qtde
});

export default connect(
  mapStateToProps,
  {
    abrirFormConfigurarAction
  }
)(GraficoVendaStartStop);
