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
} from "../../../redux/actions/formInputActions";
import img from "../../../../img/CompraStartMovel.png";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoMenorGrafico
} from "../../../utils/TextoGrafico";
import { VENDA_STOPMOVEL_NAMESPACE } from "../../../../constants/ActionTypes";

class GraficoVendaStopMovel extends React.Component {
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
                  VENDA_STOPMOVEL_NAMESPACE
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
                this.props.mudarStopExecAction(event, VENDA_STOPMOVEL_NAMESPACE)
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
                  VENDA_STOPMOVEL_NAMESPACE
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
                  VENDA_STOPMOVEL_NAMESPACE
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
                  VENDA_STOPMOVEL_NAMESPACE
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
                  VENDA_STOPMOVEL_NAMESPACE
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
              this.props.disparoMaisAjuste - this.props.disparo1Ajuste
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
            Number(this.props.stopMais1Ajuste - this.props.stopDisparo).toFixed(
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
  gainDisparo: state.vendaStopMovel.gainDisparo,
  gainExec: state.vendaStopMovel.gainExec,
  stopDisparo: state.vendaStopMovel.stopDisparo,
  stopExec: state.vendaStopMovel.stopExec,
  cotacaoAtual: state.vendaStopMovel.cotacaoAtual,
  disparo1Ajuste: state.vendaStopMovel.disparo1Ajuste,
  disparoMaisAjuste: state.vendaStopMovel.disparoMaisAjuste,
  stopMais1Ajuste: state.vendaStopMovel.stopMais1Ajuste,
  stopAnteriorAjuste: state.vendaStopMovel.stopAnteriorAjuste
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
)(GraficoVendaStopMovel);
