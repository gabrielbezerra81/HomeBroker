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
import img from "../../../../img/VendaStopMovel.png";
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
              id="StopDisparoGrafico_VSM"
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
              id="StopExecGrafico_VSM"
              className="inputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props.stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(event, VENDA_STOPMOVEL_NAMESPACE)
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_VSM"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
            <Form.Control
              type="number"
              step={0.01}
              id="Disparo1AjusteGrafico_VSM"
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
              id="DisparoMaisAjusteGrafico_VSM"
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
              id="StopMais1AjusteGrafico_VSM"
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
              id="StopAnteriorAjusteGrafico_VSM"
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
              this.props.disparoMaisAjuste - this.props.disparo1Ajuste
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
