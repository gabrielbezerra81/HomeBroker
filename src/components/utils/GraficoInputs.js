import React from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import InputFormatado, {
  boxShadowInput
} from "components/utils/InputFormatado";
import { mudarAtributoBoletaAction } from "components/redux/actions/formInputActions";
import {
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  VENDA_AGENDADA_NAMESPACE,
  VENDA_LIMITADA_NAMESPACE,
  VENDA_MERCADO_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
  VENDA_STOPMOVEL_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE
} from "constants/ActionTypes";

class GraficoInputs extends React.Component {
  render() {
    switch (this.props.tipoBoleta) {
      case "graficoTipoAgendada":
        return (
          <div>
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`GainDisparoGrafico_${this.props.cv}`}
              className={`gainDisparo_Agendada ${boxShadowInput(
                "gainDisparo_Agendada"
              )}`}
              inputGrafico="containerInputGrafico"
              value={this.props[this.props.namespace].gainDisparo}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "gainDisparo"
                )
              }
            />
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`gainExec_Agendada ${boxShadowInput(
                "gainExec_Agendada"
              )}`}
              id={`GainExecGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico"
              value={this.props[this.props.namespace].gainExec}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "gainExec"
                )
              }
            />
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`stopDisparo_Agendada ${boxShadowInput(
                "stopDisparo_Agendada"
              )}`}
              id={`StopDisparoGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico"
              value={this.props[this.props.namespace].stopDisparo}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopDisparo"
                )
              }
            />
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`stopExec_Agendada ${boxShadowInput(
                "stopExec_Agendada"
              )}`}
              id={`StopExecGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico"
              value={this.props[this.props.namespace].stopExec}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopExec"
                )
              }
            />
          </div>
        );
      case "tipoStartMovel":
        return (
          <div>
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`StopDisparoGrafico_${this.props.cv}`}
              className={`stopDisparo_Movel ${boxShadowInput(
                "stopDisparo_Movel"
              )}`}
              inputGrafico={`containerInputGrafico TamanhoInputGrafico_StartMovel`}
              value={this.props[this.props.namespace].stopDisparo}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopDisparo"
                )
              }
            />
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`stopExec_Movel ${boxShadowInput("stopExec_Movel")}`}
              id={`StopExecGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props[this.props.namespace].stopExec}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopExec"
                )
              }
            />
            <Form.Control
              id={`CotacaoAtualGrafico_${this.props.cv}`}
              className="inputGrafico"
              value={
                this.props[this.props.namespace].dadosPesquisa.cotacaoAtual
              }
              onChange={() => false}
            />
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              className={`inicioDisparo_Movel ${boxShadowInput(
                "inicioDisparo_Movel"
              )}`}
              id={`Disparo1AjusteGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props[this.props.namespace].inicioDisparo}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "inicioDisparo"
                )
              }
            />
            {/* <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`DisparoMaisAjusteGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props[this.props.namespace].disparoMaisAjuste}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "disparoMaisAjuste"
                )
              }
            /> */}

            {/* <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`StopMais1AjusteGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props[this.props.namespace].stopMais1Ajuste}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopMais1Ajuste"
                )
              }
            /> */}
            {/* <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`StopAnteriorAjusteGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_StartMovel"
              value={this.props[this.props.namespace].stopAnteriorAjuste}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "stopAnteriorAjuste"
                )
              }
            /> */}
          </div>
        );
      case "tipoGainReducao":
        return (
          <div>
            <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`Reducao1Grafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props[this.props.namespace].reducao1}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "reducao1"
                )
              }
            />

            <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`Reducao2Grafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props[this.props.namespace].reducao2}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "reducao2"
                )
              }
            />

            <InputFormatado
              tipoInput="preco"
              step={0.01}
              id={`GainGrafico_${this.props.cv}`}
              inputGrafico="containerInputGrafico TamanhoInputGrafico_GainReducao"
              value={this.props[this.props.namespace].gain}
              onChange={valor =>
                this.props.mudarAtributoBoletaAction(
                  valor,
                  this.props.namespace,
                  "gain"
                )
              }
            />

            <Form.Control
              id={`CotacaoAtualGrafico_${this.props.cv}`}
              className="inputGrafico"
              value={
                this.props[this.props.namespace].dadosPesquisa.cotacaoAtual
              }
              onChange={() => false}
            />
          </div>
        );
      default:
        return null;
    }
  }
}

export const mapStateToPropsInputsPreco = state => {
  return {
    [COMPRA_AGENDADA_NAMESPACE]: {
      gainDisparo: state.compraAgendadaReducer.gainDisparo,
      gainExec: state.compraAgendadaReducer.gainExec,
      stopDisparo: state.compraAgendadaReducer.stopDisparo,
      stopExec: state.compraAgendadaReducer.stopExec,
      dadosPesquisa: state.compraAgendadaReducer.dadosPesquisa,
      valorTotal: state.compraAgendadaReducer.valorTotal,
      qtde: state.compraAgendadaReducer.qtde
    },
    [COMPRA_LIMITADA_NAMESPACE]: {
      gainDisparo: state.compraLimitadaReducer.gainDisparo,
      gainExec: state.compraLimitadaReducer.gainExec,
      stopDisparo: state.compraLimitadaReducer.stopDisparo,
      stopExec: state.compraLimitadaReducer.stopExec,
      dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
      qtde: state.compraLimitadaReducer.qtde
    },
    [COMPRA_MERCADO_NAMESPACE]: {
      gainDisparo: state.compraMercadoReducer.gainDisparo,
      gainExec: state.compraMercadoReducer.gainExec,
      stopDisparo: state.compraMercadoReducer.stopDisparo,
      stopExec: state.compraMercadoReducer.stopExec,
      dadosPesquisa: state.compraMercadoReducer.dadosPesquisa,
      qtde: state.compraMercadoReducer.qtde
    },
    [COMPRA_STARTSTOP_NAMESPACE]: {
      gainDisparo: state.compraStartStopReducer.gainDisparo,
      gainExec: state.compraStartStopReducer.gainExec,
      stopDisparo: state.compraStartStopReducer.stopDisparo,
      stopExec: state.compraStartStopReducer.stopExec,
      dadosPesquisa: state.compraStartStopReducer.dadosPesquisa,
      qtde: state.compraStartStopReducer.qtde,
      gainDisparoConfig1: state.compraStartStopReducer.gainDisparoConfig1,
      gainExecConfig1: state.compraStartStopReducer.gainExecConfig1,
      stopDisparoConfig1: state.compraStartStopReducer.stopDisparoConfig1,
      stopExecConfig1: state.compraStartStopReducer.stopExecConfig1,
      gainDisparoConfig2: state.compraStartStopReducer.gainDisparoConfig2,
      gainExecConfig2: state.compraStartStopReducer.gainExecConfig2,
      stopDisparoConfig2: state.compraStartStopReducer.stopDisparoConfig2,
      stopExecConfig2: state.compraStartStopReducer.stopExecConfig2
    },
    [COMPRA_STARTMOVEL_NAMESPACE]: {
      gainDisparo: state.compraStartMovelReducer.gainDisparo,
      gainExec: state.compraStartMovelReducer.gainExec,
      stopDisparo: state.compraStartMovelReducer.stopDisparo,
      stopExec: state.compraStartMovelReducer.stopExec,
      dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa,
      inicioDisparo: state.compraStartMovelReducer.inicioDisparo,
      disparoMaisAjuste: state.compraStartMovelReducer.disparoMaisAjuste,
      stopMais1Ajuste: state.compraStartMovelReducer.stopMais1Ajuste,
      stopAnteriorAjuste: state.compraStartMovelReducer.stopAnteriorAjuste,
      ajustePadrao: state.compraStartMovelReducer.ajustePadrao
    },
    [COMPRA_GAINREDUCAO_NAMESPACE]: {
      dadosPesquisa: state.compraGainReducao.dadosPesquisa,
      reducao1: state.compraGainReducao.reducao1,
      reducao2: state.compraGainReducao.reducao2,
      gain: state.compraGainReducao.gain,
      gainDisparo: state.compraGainReducao.gainDisparo,
      gainExec: state.compraGainReducao.gainExec,
      qtde: state.compraGainReducao.qtde,
      tabelaGainReducao: state.compraGainReducao.tabelaGainReducao
    },
    [VENDA_AGENDADA_NAMESPACE]: {
      gainDisparo: state.vendaAgendadaReducer.gainDisparo,
      gainExec: state.vendaAgendadaReducer.gainExec,
      stopDisparo: state.vendaAgendadaReducer.stopDisparo,
      stopExec: state.vendaAgendadaReducer.stopExec,
      dadosPesquisa: state.vendaAgendadaReducer.dadosPesquisa,
      valorTotal: state.vendaAgendadaReducer.valorTotal,
      qtde: state.vendaAgendadaReducer.qtde
    },
    [VENDA_LIMITADA_NAMESPACE]: {
      gainDisparo: state.vendaLimitadaReducer.gainDisparo,
      gainExec: state.vendaLimitadaReducer.gainExec,
      stopDisparo: state.vendaLimitadaReducer.stopDisparo,
      stopExec: state.vendaLimitadaReducer.stopExec,
      dadosPesquisa: state.vendaLimitadaReducer.dadosPesquisa,
      qtde: state.vendaLimitadaReducer.qtde
    },
    [VENDA_MERCADO_NAMESPACE]: {
      gainDisparo: state.vendaMercadoReducer.gainDisparo,
      gainExec: state.vendaMercadoReducer.gainExec,
      stopDisparo: state.vendaMercadoReducer.stopDisparo,
      stopExec: state.vendaMercadoReducer.stopExec,
      dadosPesquisa: state.vendaMercadoReducer.dadosPesquisa,
      qtde: state.vendaMercadoReducer.qtde
    },
    [VENDA_STARTSTOP_NAMESPACE]: {
      gainDisparo: state.vendaStartStopReducer.gainDisparo,
      gainExec: state.vendaStartStopReducer.gainExec,
      stopDisparo: state.vendaStartStopReducer.stopDisparo,
      stopExec: state.vendaStartStopReducer.stopExec,
      dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa,
      qtde: state.vendaStartStopReducer.qtde,
      gainDisparoConfig1: state.vendaStartStopReducer.gainDisparoConfig1,
      gainExecConfig1: state.vendaStartStopReducer.gainExecConfig1,
      stopDisparoConfig1: state.vendaStartStopReducer.stopDisparoConfig1,
      stopExecConfig1: state.vendaStartStopReducer.stopExecConfig1,
      gainDisparoConfig2: state.vendaStartStopReducer.gainDisparoConfig2,
      gainExecConfig2: state.vendaStartStopReducer.gainExecConfig2,
      stopDisparoConfig2: state.vendaStartStopReducer.stopDisparoConfig2,
      stopExecConfig2: state.vendaStartStopReducer.stopExecConfig2
    },
    [VENDA_STOPMOVEL_NAMESPACE]: {
      gainDisparo: state.vendaStopMovel.gainDisparo,
      gainExec: state.vendaStopMovel.gainExec,
      stopDisparo: state.vendaStopMovel.stopDisparo,
      stopExec: state.vendaStopMovel.stopExec,
      dadosPesquisa: state.vendaStopMovel.dadosPesquisa,
      inicioDisparo: state.vendaStopMovel.inicioDisparo,
      disparoMaisAjuste: state.vendaStopMovel.disparoMaisAjuste,
      stopMais1Ajuste: state.vendaStopMovel.stopMais1Ajuste,
      stopAnteriorAjuste: state.vendaStopMovel.stopAnteriorAjuste,
      ajustePadrao: state.vendaStopMovel.ajustePadrao
    },
    [VENDA_GAINREDUCAO_NAMESPACE]: {
      dadosPesquisa: state.vendaGainReducao.dadosPesquisa,
      reducao1: state.vendaGainReducao.reducao1,
      reducao2: state.vendaGainReducao.reducao2,
      gain: state.vendaGainReducao.gain,
      gainDisparo: state.vendaGainReducao.gainDisparo,
      gainExec: state.vendaGainReducao.gainExec,
      qtde: state.vendaGainReducao.qtde,
      tabelaGainReducao: state.vendaGainReducao.tabelaGainReducao
    }
  };
};

export default connect(mapStateToPropsInputsPreco, {
  mudarAtributoBoletaAction
})(GraficoInputs);
