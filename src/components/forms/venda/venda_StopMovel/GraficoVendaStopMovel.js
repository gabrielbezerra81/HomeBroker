import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";

import img from "img/venda/VendaStopMovel.png";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoMenorGrafico
} from "components/utils/TextoGrafico";
import { VENDA_STOPMOVEL_NAMESPACE } from "constants/ActionTypes";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoVendaStopMovel extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={VENDA_STOPMOVEL_NAMESPACE}
              tipoBoleta="tipoStartMovel"
              cv="VSM"
            />
          </Form>
          {LabelInputGrafico("Disparo", "TextoGainDisparo_VSM")}
          {LabelInputGrafico("Disparo + ajuste", "TextoDisparoMaisAjuste_VSM")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_VSM")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_VSM")}

          {TextoGainStopGrafico("1º Ajuste", "TextoPrimeiroAjuste_VSM")}
          {TextoGainStopGrafico("2º Ajuste", "TextoSegundoAjuste_VSM")}
          {TextoGainStopGrafico("STOP", "TextoStop_VSM")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VSM")}

          {TextoMenorGrafico(
            "Stop + 1 ajuste",
            "TextoMenorGrafico_Stop1ajuste_VSM"
          )}
          {TextoMenorGrafico(
            "Stop anterior + ajuste",
            "TextoMenorGrafico_StopAnterior_VSM"
          )}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste1_VSM")}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste2_VSM")}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste3_VSM")}

          {TextoMenorGrafico(
            Number(
              this.props.disparoMaisAjuste - this.props.inicioDisparo
            ).toFixed(2),
            "ValorAjuste1Grafico_VSM"
          )}
          {TextoMenorGrafico(
            Number(
              this.props.stopAnteriorAjuste - this.props.stopMais1Ajuste
            ).toFixed(2),
            "ValorAjuste2Grafico_VSM"
          )}
          {TextoMenorGrafico(
            Number(this.props.stopMais1Ajuste - this.props.stopDisparo).toFixed(
              2
            ),
            "ValorAjuste3Grafico_VSM"
          )}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.vendaStopMovel.gainDisparo,
  gainExec: state.vendaStopMovel.gainExec,
  stopDisparo: state.vendaStopMovel.stopDisparo,
  stopExec: state.vendaStopMovel.stopExec,
  dadosPesquisa: state.vendaStopMovel.dadosPesquisa,
  inicioDisparo: state.vendaStopMovel.inicioDisparo,
  disparoMaisAjuste: state.vendaStopMovel.disparoMaisAjuste,
  stopMais1Ajuste: state.vendaStopMovel.stopMais1Ajuste,
  stopAnteriorAjuste: state.vendaStopMovel.stopAnteriorAjuste
});

export default connect(
  mapStateToProps,
  {}
)(GraficoVendaStopMovel);
