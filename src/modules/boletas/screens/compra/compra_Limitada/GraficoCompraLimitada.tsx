import React from "react";
import { Col, Form } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";
import img from "assets/compra/CompraModeloNovo.png";
import IconeConfigGrafico from "shared/componentes/IconeConfigGrafico";
import {
  LabelInputGrafico,
  TextoGainStopGrafico,
  TextoCotacaoAtualGrafico,
  TextoValorTotalGrafico,
} from "modules/boletas/components/TextoGraficoBoletas";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalAgendada } from "shared/utils/CalculoValorTotal";
import InputGroupBoletaGraphic from "modules/boletas/components/BoletaGraphics/InputGroupBoletaGraphic";
import { BoletasState } from "redux/reducers";

class GraficoCompraLimitada extends React.Component<PropsFromRedux> {
  render() {
    return (
      <Col className="colGrafico">
        <div className="imgContainer">
          <img src={img} className="imgChart" alt="" />
          <Form>
            <InputGroupBoletaGraphic
              namespace={COMPRA_LIMITADA_NAMESPACE}
              boletaType="graficoTipoAgendada"
              cv="CA"
            />
            <Form.Control
              className="graphQuoteInput CotacaoAtualGrafico_CA"
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
              this.props.qtde,
            ),
            "ValorTotalGain",
          )}
          {TextoValorTotalGrafico(
            "",
            CalculoValorTotalAgendada(
              this.props.stopDisparo,
              this.props.stopExec,
              this.props.qtde,
            ),
            "ValorTotalStop",
          )}
          <IconeConfigGrafico
            className="ConfigGainGrafico_CA"
            name="compra_gainreducao"
          />
          <IconeConfigGrafico
            className="ConfigStopGrafico_CA"
            name="venda_stopmovel"
          />
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state: BoletasState) => ({
  gainDisparo: state.compraLimitadaReducer.gainDisparo,
  gainExec: state.compraLimitadaReducer.gainExec,
  stopDisparo: state.compraLimitadaReducer.stopDisparo,
  stopExec: state.compraLimitadaReducer.stopExec,
  dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
  qtde: state.compraLimitadaReducer.qtde,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(GraficoCompraLimitada);
