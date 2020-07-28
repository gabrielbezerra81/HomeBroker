import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import IconeConfigGrafico from "components/utils/componentesUI/IconeConfigGrafico";
import graficoCompraStartStop from "assets/compra/CompraModeloNovo.png";
import {
  LabelInputGrafico,
  TextoValorTotalGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
} from "components/utils/componentesUI/TextoGraficoBoletas";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";
import { abrirFormConfigurarAction } from "redux/actions/GlobalAppActions";
import GraficoInputs from "components/utils/componentesUI/GraficoInputs";

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
              className="inputGrafico CotacaoAtualGrafico_CA"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          <IconeConfigGrafico
            className="ConfigGainGrafico_CA"
            name="config_compra"
          />
          <IconeConfigGrafico
            className="ConfigStopGrafico_CA"
            name="config_compra"
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

const mapStateToProps = (state) => ({
  gainDisparo: state.compraStartStopReducer.gainDisparo,
  gainExec: state.compraStartStopReducer.gainExec,
  stopDisparo: state.compraStartStopReducer.stopDisparo,
  stopExec: state.compraStartStopReducer.stopExec,
  dadosPesquisa: state.compraStartStopReducer.dadosPesquisa,
  qtde: state.compraStartStopReducer.qtde,
});

export default connect(mapStateToProps, {
  abrirFormConfigurarAction,
})(GraficoCompraStartStop);
