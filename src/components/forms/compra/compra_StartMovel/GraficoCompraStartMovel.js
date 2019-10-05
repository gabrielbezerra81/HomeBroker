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
          {LabelInputGrafico("Disparo", "TextoGainDisparo_CSM")}
          {LabelInputGrafico("Disparo + ajuste", "TextoDisparoMaisAjuste_CSM")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CSM")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CSM")}

          {TextoGainStopGrafico("1º Ajuste", "TextoPrimeiroAjuste_CSM")}
          {TextoGainStopGrafico("2º Ajuste", "TextoSegundoAjuste_CSM")}
          {TextoGainStopGrafico("STOP", "TextoStop_CSM")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CSM")}

          {TextoMenorGrafico(
            "Stop + 1 ajuste",
            "TextoMenorGrafico_Stop1ajuste_CSM"
          )}
          {TextoMenorGrafico(
            "Stop anterior + ajuste",
            "TextoMenorGrafico_StopAnterior_CSM"
          )}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste1_CSM")}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste2_CSM")}
          {TextoMenorGrafico("Ajuste", "TextoMenorGrafico_Ajuste3_CSM")}

          {TextoMenorGrafico(
            Number(this.props.stopMais1Ajuste - this.props.stopDisparo).toFixed(
              2
            ),
            "ValorAjuste1Grafico_CSM"
          )}
          {TextoMenorGrafico(
            Number(
              this.props.stopAnteriorAjuste - this.props.stopMais1Ajuste
            ).toFixed(2),
            "ValorAjuste2Grafico_CSM"
          )}
          {TextoMenorGrafico(
            Number(
              this.props.disparoMaisAjuste - this.props.inicioDisparo
            ).toFixed(2),
            "ValorAjuste3Grafico_CSM"
          )}
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
  stopAnteriorAjuste: state.compraStartMovelReducer.stopAnteriorAjuste
});

export default connect(
  mapStateToProps,
  {}
)(GraficoCompraStartMovel);
