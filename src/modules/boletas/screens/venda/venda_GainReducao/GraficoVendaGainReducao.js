import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "assets/venda/VendaGainReducao.png";
import {
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import InputGroupBoletaGraphic from "modules/boletas/components/BoletaGraphics/InputGroupBoletaGraphic";

class GraficoVendaGainReducao extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <InputGroupBoletaGraphic
              namespace={VENDA_GAINREDUCAO_NAMESPACE}
              boletaType="tipoGainReducao"
              cv="VGR"
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

const mapStateToProps = (state) => ({
  dadosPesquisa: state.vendaGainReducao.dadosPesquisa,
  reducao1: state.vendaGainReducao.reducao1,
  reducao2: state.vendaGainReducao.reducao2,
  gain: state.vendaGainReducao.gain,
});

export default connect(mapStateToProps, {})(GraficoVendaGainReducao);
