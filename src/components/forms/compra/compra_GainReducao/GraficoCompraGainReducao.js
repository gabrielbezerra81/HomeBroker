import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarReducao1Action,
  mudarReducao2Action,
  mudarGainAction
} from "components/redux/actions/formInputActions";
import img from "img/compra/GainReducaoCompra.png";
import {
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "components/utils/TextoGrafico";
import { COMPRA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";

class GraficoCompraGainReducao extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="Reducao1Grafico_CGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.reducao1}
              onChange={event =>
                this.props.mudarReducao1Action(
                  event,
                  COMPRA_GAINREDUCAO_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="Reducao2Grafico_CGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.reducao2}
              onChange={event =>
                this.props.mudarReducao2Action(
                  event,
                  COMPRA_GAINREDUCAO_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="GainGrafico_CGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.gain}
              onChange={event =>
                this.props.mudarGainAction(event, COMPRA_GAINREDUCAO_NAMESPACE)
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_CGR"
              className="inputGrafico"
              value={this.props.dadosPesquisa.cotacaoAtual}
              onChange={() => false}
            />
          </Form>

          {TextoGainStopGrafico("GAIN", "TextoGain_CGR")}
          {TextoGainStopGrafico("Redução 1", "TextoReducao1_CGR")}
          {TextoGainStopGrafico("Redução 2", "TextoReducao2_CGR")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_CGR")}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  dadosPesquisa: state.compraGainReducao.dadosPesquisa,
  reducao1: state.compraGainReducao.reducao1,
  reducao2: state.compraGainReducao.reducao2,
  gain: state.compraGainReducao.gain
});

export default connect(
  mapStateToProps,
  { mudarReducao1Action, mudarReducao2Action, mudarGainAction }
)(GraficoCompraGainReducao);
