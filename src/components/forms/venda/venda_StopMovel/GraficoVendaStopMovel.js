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
          {LabelInputGrafico("Disparo Móvel", "TextoGainDisparo_VSM")}
          {LabelInputGrafico(
            "Disparo Móvel + 1º ajuste",
            "TextoDisparoMaisAjuste_VSM"
          )}
          {LabelInputGrafico("Disparo Stop", "TextoStopDisparo_VSM")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_VSM")}

          {TextoGainStopGrafico("1º Ajuste", "TextoPrimeiroAjuste_VSM")}
          {TextoGainStopGrafico("2º Ajuste", "TextoSegundoAjuste_VSM")}
          {TextoGainStopGrafico("STOP", "TextoStop_VSM")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VSM")}

          {TextoMenorGrafico(
            "Stop + 1º ajuste",
            "TextoMenorGrafico_Stop1ajuste_VSM"
          )}
          {TextoMenorGrafico(
            "Stop anterior + 2º ajuste",
            "TextoMenorGrafico_StopAnterior_VSM"
          )}
          {TextoMenorGrafico("1º Ajuste", "TextoMenorGrafico_Ajuste1_VSM")}
          {TextoMenorGrafico("2º Ajuste", "TextoMenorGrafico_Ajuste2_VSM")}
          {TextoMenorGrafico("1º Ajuste", "TextoMenorGrafico_Ajuste3_VSM")}

          {renderTextos(this.props)}
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
  stopAnteriorAjuste: state.vendaStopMovel.stopAnteriorAjuste,
  tabelaOrdens: state.vendaStopMovel.tabelaOrdens
});

export default connect(mapStateToProps, {})(GraficoVendaStopMovel);

const renderTextos = props => {
  const { tabelaOrdens } = props;

  let ajuste1,
    ajuste2,
    ajuste3,
    stopMais1Ajuste,
    stopAnteriorAjuste,
    disparoMaisAjuste;
  const linha1 = tabelaOrdens[0];
  const linha2 = tabelaOrdens[1];
  const linha3 = tabelaOrdens[2];

  if (linha1) {
    ajuste1 = TextoMenorGrafico(
      Number(linha1.ajuste).toFixed(2),
      "ValorAjuste1Grafico_VSM"
    );
    ajuste3 = TextoMenorGrafico(
      Number(linha1.ajuste).toFixed(2),
      "ValorAjuste3Grafico_VSM"
    );
    stopMais1Ajuste = TextoMenorGrafico(
      Number(linha1.novoStop).toFixed(2),
      "StopMais1AjusteGrafico_VSM"
    );
    disparoMaisAjuste = TextoMenorGrafico(
      Number(linha1.novoStop).toFixed(2),
      "DisparoMaisAjusteGrafico_VSM"
    );
  }
  if (linha2) {
    ajuste2 = TextoMenorGrafico(
      Number(linha2.ajuste).toFixed(2),
      "ValorAjuste2Grafico_VSM"
    );
    stopAnteriorAjuste = TextoMenorGrafico(
      Number(linha2.novoStop).toFixed(2),
      "StopAnteriorAjusteGrafico_VSM"
    );
  }

  return (
    <div>
      {ajuste1}
      {stopMais1Ajuste}
      {ajuste2}
      {stopAnteriorAjuste}
      {ajuste3}
      {disparoMaisAjuste}
    </div>
  );
};
