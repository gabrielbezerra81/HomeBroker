import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarReducao1Action,
  mudarReducao2Action,
  mudarGainAction
} from "../../../redux/actions/formInputActions";
import img from "../../../../img/venda/VendaGainReducao.png";
import {
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico
} from "../../../utils/TextoGrafico";
import { VENDA_GAINREDUCAO_NAMESPACE } from "../../../../constants/ActionTypes";

class GraficoVendaGainReducao extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <Form.Control
              type="number"
              step={0.01}
              id="Reducao1Grafico_VGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.reducao1}
              onChange={event =>
                this.props.mudarReducao1Action(
                  event,
                  VENDA_GAINREDUCAO_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="Reducao2Grafico_VGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.reducao2}
              onChange={event =>
                this.props.mudarReducao2Action(
                  event,
                  VENDA_GAINREDUCAO_NAMESPACE
                )
              }
            />
            <Form.Control
              type="number"
              step={0.01}
              id="GainGrafico_VGR"
              className="inputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props.gain}
              onChange={event =>
                this.props.mudarGainAction(
                  event,
                  VENDA_GAINREDUCAO_NAMESPACE
                )
              }
            />
            <Form.Control
              id="CotacaoAtualGrafico_VGR"
              className="inputGrafico"
              value={this.props.cotacaoAtual}
              onChange={() => false}
            />
          </Form>

          {TextoGainStopGrafico("GAIN", "TextoGain_VGR")}
          {TextoGainStopGrafico("Redução 1", "TextoReducao1_VGR")}
          {TextoGainStopGrafico("Redução 2", "TextoReducao2_VGR")}
          {TextoCotacaoAtualGrafico("TextoCotacaoAtualGrafico_VGR")}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  cotacaoAtual: state.vendaGainReducao.cotacaoAtual,
  reducao1: state.vendaGainReducao.reducao1,
  reducao2: state.vendaGainReducao.reducao2,
  gain: state.vendaGainReducao.gain
});

export default connect(
  mapStateToProps,
  { mudarReducao1Action, mudarReducao2Action, mudarGainAction }
)(GraficoVendaGainReducao);
