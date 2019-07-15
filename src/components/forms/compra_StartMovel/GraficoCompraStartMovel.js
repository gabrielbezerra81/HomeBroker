import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarDisparo1AjusteAction,
  mudarDisparoMaisAjusteAction,
  mudarStopMaisPrimeiroAjusteAction,
  mudarStopAnteriorAjusteAction
} from "../../redux/actions/formInputActions";
import img from "../../../img/CompraStartMovel.png";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoMenorGrafico
} from "../../utils/TextoGrafico";
import { COMPRA_STARTMOVEL_NAMESPACE } from "../../../constants/ActionTypes";

class GraficoCompraStartMovel extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="StopDisparoGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.stopDisparo}
              onChange={event =>
                this.props.mudarStopDisparoAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopExecGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_CSM"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
            <Form.Control
              type="number"
              step={0.01}
              id="Disparo1AjusteGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.disparo1Ajuste}
              onChange={event =>
                this.props.mudarDisparo1AjusteAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="DisparoMaisAjusteGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.disparoMaisAjuste}
              onChange={event =>
                this.props.mudarDisparoMaisAjusteAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopMais1AjusteGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.stopMais1Ajuste}
              onChange={event =>
                this.props.mudarStopMaisPrimeiroAjusteAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopAnteriorAjusteGrafico_CSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.stopAnteriorAjuste}
              onChange={event =>
                this.props.mudarStopAnteriorAjusteAction(
                  event,
                  COMPRA_STARTMOVEL_NAMESPACE
                )
              }
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
            Number(
              this.props.stopMais1Ajuste - this.props.stopExec
            ).toFixed(2),
            "ValorAjuste1Grafico_CSM"
          )}
          {TextoMenorGrafico(
            Number(
              this.props.stopAnteriorAjuste - this.props.stopMais1Ajuste
            ).toFixed(2),
            "ValorAjuste2Grafico_CSM"
          )}
          {TextoMenorGrafico(
            Number(this.props.disparoMaisAjuste - this.props.disparo1Ajuste).toFixed(
              2
            ),
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
  cotacaoAtual: state.compraStartMovelReducer.cotacaoAtual,
  disparo1Ajuste: state.compraStartMovelReducer.disparo1Ajuste,
  disparoMaisAjuste: state.compraStartMovelReducer.disparoMaisAjuste,
  stopMais1Ajuste: state.compraStartMovelReducer.stopMais1Ajuste,
  stopAnteriorAjuste: state.compraStartMovelReducer.stopAnteriorAjuste
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    mudarDisparo1AjusteAction,
    mudarDisparoMaisAjusteAction,
    mudarStopMaisPrimeiroAjusteAction,
    mudarStopAnteriorAjusteAction
  }
)(GraficoCompraStartMovel);
