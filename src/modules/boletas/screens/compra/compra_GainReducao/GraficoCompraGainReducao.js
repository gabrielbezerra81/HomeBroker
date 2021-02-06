import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import img from "assets/compra/GainReducaoCompra.png";
import {
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { COMPRA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import InputGroupBoletaGraphic from "modules/boletas/components/BoletaGraphics/InputGroupBoletaGraphic";

class GraficoCompraGainReducao extends React.Component {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <InputGroupBoletaGraphic
              namespace={COMPRA_GAINREDUCAO_NAMESPACE}
              boletaType="tipoGainReducao"
              cv="CGR"
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

const mapStateToProps = (state) => ({
  dadosPesquisa: state.compraGainReducao.dadosPesquisa,
  reducao1: state.compraGainReducao.reducao1,
  reducao2: state.compraGainReducao.reducao2,
  gain: state.compraGainReducao.gain,
});

export default connect(mapStateToProps, {})(GraficoCompraGainReducao);
