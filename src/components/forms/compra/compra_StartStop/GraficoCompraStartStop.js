import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import graficoCompraStartStop from "img/compra/CompraModeloNovo.png";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "components/utils/TextoGrafico";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { abrirFormConfigurarAction } from "components/redux/reducers/MainAppReducer";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={graficoCompraStartStop} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={COMPRA_STARTSTOP_NAMESPACE}
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
          <IconeConfigGrafico
            id="ConfigGainGrafico_CA"
            name="config_compra"
            handleShow={event => {
              this.props.abrirFormConfigurarAction(event, this.props);
            }}
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_CA"
            name="config_compra"
            handleShow={event => {
              this.props.abrirFormConfigurarAction(event, this.props);
            }}
          />
          {LabelInputGrafico("Disparo", "TextoGainDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_CA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CA")}
          {TextoGainStopGrafico("START", "TextoGain_CA")}
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
        </div>
      </Col>
    );
  }
}

//

const mapStateToProps = state => ({
  gainDisparo: state.compraStartStopReducer.gainDisparo,
  gainExec: state.compraStartStopReducer.gainExec,
  stopDisparo: state.compraStartStopReducer.stopDisparo,
  stopExec: state.compraStartStopReducer.stopExec,
  dadosPesquisa: state.compraStartStopReducer.dadosPesquisa,
  qtde: state.compraStartStopReducer.qtde
});

export default connect(
  mapStateToProps,
  {
    abrirFormConfigurarAction
  }
)(GraficoCompraStartStop);
