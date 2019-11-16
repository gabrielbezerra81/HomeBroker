import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {} from "components/redux/actions/formInputActions";
import img from "img/compra/CompraStartMovel.png";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoMenorGrafico
} from "components/utils/TextoGrafico";
import { COMPRA_STARTMOVEL_NAMESPACE } from "constants/ActionTypes";
import GraficoInputs from "components/utils/GraficoInputs";

class GraficoCompraStartMovel extends React.Component {
  render() {
    const { props } = this;
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <GraficoInputs
              namespace={COMPRA_STARTMOVEL_NAMESPACE}
              tipoBoleta="tipoStartMovel"
              cv="CSM"
            />
          </Form>
          {LabelInputGrafico("Disparo Móvel", "TextoGainDisparo_CSM")}
          {LabelInputGrafico(
            "Disparo Móvel - 1º ajuste",
            "TextoDisparoMaisAjuste_CSM"
          )}
          {LabelInputGrafico("Disparo Stop", "TextoStopDisparo_CSM")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CSM")}

          {TextoGainStopGrafico("1º Ajuste", "TextoPrimeiroAjuste_CSM")}
          {TextoGainStopGrafico("2º Ajuste", "TextoSegundoAjuste_CSM")}
          {TextoGainStopGrafico("STOP", "TextoStop_CSM")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CSM")}

          {TextoMenorGrafico(
            "Stop - 1º ajuste",
            "TextoMenorGrafico_Stop1ajuste_CSM"
          )}
          {TextoMenorGrafico(
            "Stop anterior - 2º ajuste",
            "TextoMenorGrafico_StopAnterior_CSM"
          )}
          {TextoMenorGrafico("1º Ajuste", "TextoMenorGrafico_Ajuste1_CSM")}
          {TextoMenorGrafico("2º Ajuste", "TextoMenorGrafico_Ajuste2_CSM")}
          {TextoMenorGrafico("1º Ajuste", "TextoMenorGrafico_Ajuste3_CSM")}

          {renderTextos(props)}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.compraStartMovelReducer.gainDisparo,
  gainExec: state.compraStartMovelReducer.gainExec,
  stopDisparo: state.compraStartMovelReducer.stopDisparo,
  stopExec: state.compraStartMovelReducer.stopExec,
  dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa,
  inicioDisparo: state.compraStartMovelReducer.inicioDisparo,
  disparoMaisAjuste: state.compraStartMovelReducer.disparoMaisAjuste,
  stopMais1Ajuste: state.compraStartMovelReducer.stopMais1Ajuste,
  stopAnteriorAjuste: state.compraStartMovelReducer.stopAnteriorAjuste,
  tabelaOrdens: state.compraStartMovelReducer.tabelaOrdens
});

export default connect(mapStateToProps, {})(GraficoCompraStartMovel);

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
      "ValorAjuste1Grafico_CSM"
    );
    ajuste3 = TextoMenorGrafico(
      Number(linha1.ajuste).toFixed(2),
      "ValorAjuste3Grafico_CSM"
    );
    stopMais1Ajuste = TextoMenorGrafico(
      Number(linha1.novoStop).toFixed(2),
      "StopMais1AjusteGrafico_CSM"
    );
    disparoMaisAjuste = TextoMenorGrafico(
      Number(linha1.novoStop).toFixed(2),
      "DisparoMaisAjusteGrafico_CSM"
    );
  }
  if (linha2) {
    ajuste2 = TextoMenorGrafico(
      Number(linha2.ajuste).toFixed(2),
      "ValorAjuste2Grafico_CSM"
    );
    stopAnteriorAjuste = TextoMenorGrafico(
      Number(linha2.novoStop).toFixed(2),
      "StopAnteriorAjusteGrafico_CSM"
    );
  }

  return (
    <div>
      {ajuste1}
      {ajuste2}
      {ajuste3}
      {stopMais1Ajuste}
      {stopAnteriorAjuste}
      {disparoMaisAjuste}
    </div>
  );
};
