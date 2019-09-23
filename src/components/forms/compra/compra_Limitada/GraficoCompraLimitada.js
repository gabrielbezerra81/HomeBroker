import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarStopDisparoAction,
  mudarStopExecAction
} from "components/redux/actions/formInputActions";
import img from "img/compra/CompraModeloNovo.png";
import IconeConfigGrafico from "components/utils/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico
} from "components/utils/TextoGrafico";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "components/utils/CalculoValorTotal";

class GraficoCompraLimitada extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="GainDisparoGrafico_CA"
              className="inputGrafico"
              value={this.props.gainDisparo}
              onChange={event =>
                this.props.mudarGainDisparoAction(
                  event,
                  COMPRA_LIMITADA_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="GainExecGrafico_CA"
              className="inputGrafico"
              value={this.props.gainExec}
              onChange={event =>
                this.props.mudarGainExecAction(event, COMPRA_LIMITADA_NAMESPACE)
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopDisparoGrafico_CA"
              className="inputGrafico"
              value={this.props.stopDisparo}
              onChange={event =>
                this.props.mudarStopDisparoAction(
                  event,
                  COMPRA_LIMITADA_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="StopExecGrafico_CA"
              className="inputGrafico"
              value={this.props.stopExec}
              onChange={event =>
                this.props.mudarStopExecAction(event, COMPRA_LIMITADA_NAMESPACE)
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_CA"
              className="inputGrafico"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>
          {LabelInputGrafico("Disparo", "TextoGainDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoGainExecucao_CA")}
          {LabelInputGrafico("Disparo", "TextoStopDisparo_CA")}
          {LabelInputGrafico("Execução", "TextoStopExecucao_CA")}
          {TextoGainStopGrafico("GAIN", "TextoGain_CA")}
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
          <IconeConfigGrafico
            id="ConfigGainGrafico_CA"
            name="compra_gainreducao"
            handleShow={this.props.handleShow}
          />
          <IconeConfigGrafico
            id="ConfigStopGrafico_CA"
            name="venda_stop_movel"
            handleShow={this.props.handleShow}
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  gainDisparo: state.compraLimitadaReducer.gainDisparo,
  gainExec: state.compraLimitadaReducer.gainExec,
  stopDisparo: state.compraLimitadaReducer.stopDisparo,
  stopExec: state.compraLimitadaReducer.stopExec,
  dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
  qtde: state.compraLimitadaReducer.qtde
});

export default connect(
  mapStateToProps,
  {
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarStopDisparoAction,
    mudarStopExecAction
  }
)(GraficoCompraLimitada);
