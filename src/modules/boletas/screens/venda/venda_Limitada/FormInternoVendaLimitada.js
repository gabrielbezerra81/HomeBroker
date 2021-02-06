import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "modules/boletas/duck/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/formInputActions";
import RowFormValidade from "modules/boletas/components/RowFormValidade";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { VENDA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "shared/utils/CalculoValorTotal";
import RowAtivoQtdeBoletas from "modules/boletas/components/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "modules/boletas/duck/actions/boletasAPIActions";
import CustomInput from "shared/componentes/CustomInput";
import { BotaoEnviarOrdem } from "modules/boletas/components/BotaoEnviarOrdem";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoVendaLimitada extends React.Component {
  // componentDidUpdate(prevProps) {
  //   const prevStepQtde = prevProps.dadosPesquisa.stepQtde;
  //   const stepQtde = this.props.dadosPesquisa.stepQtde;

  //   if (prevStepQtde !== stepQtde && stepQtde === 100) {
  //     this.props.mudarAtributoBoletaAction(
  //       Number(this.props.preco).toFixed(2),
  //       VENDA_LIMITADA_NAMESPACE,
  //       "preco",
  //     );
  //   }
  // }

  render() {
    const { dadosPesquisa } = this.props;
    const { stepQtde } = dadosPesquisa;
    let stepPreco = 0.01,
      precisao = 2;
    if (stepQtde === 0.01) {
      stepPreco = 0.00001;
      precisao = 5;
    }

    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, VENDA_LIMITADA_NAMESPACE)}

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Preço</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label />
                  <CustomInput
                    type="preco"
                    step={stepPreco}
                    precision={precisao}
                    value={this.props.preco}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        VENDA_LIMITADA_NAMESPACE,
                        "preco",
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={5} className="colValorTotal_CL">
                <h6 className="valorTotalText_CL">
                  {CalculoValorTotalLimitada(this.props.preco, this.props.qtde)}
                </h6>
              </Col>
            </Row>
          </Form>

          <InputGroupBoleta
            namespace={VENDA_LIMITADA_NAMESPACE}
            cv="venda"
            popupToOpenGain="venda_gainreducao"
            popupToOpenStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, VENDA_LIMITADA_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, VENDA_LIMITADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_LIMITADA_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BotaoEnviarOrdem props={this.props} tipoCompraVenda="Vender" />
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  qtde: state.vendaLimitadaReducer.qtde,
  erro: state.vendaLimitadaReducer.erro,
  gainDisparo: state.vendaLimitadaReducer.gainDisparo,
  gainExec: state.vendaLimitadaReducer.gainExec,
  stopDisparo: state.vendaLimitadaReducer.stopDisparo,
  stopExec: state.vendaLimitadaReducer.stopExec,
  validadeSelect: state.vendaLimitadaReducer.validadeSelect,
  date: state.vendaLimitadaReducer.date,
  valorTotal: state.vendaLimitadaReducer.valorTotal,
  ativo: state.vendaLimitadaReducer.ativo,
  assinatura: state.vendaLimitadaReducer.assinatura,
  preco: state.vendaLimitadaReducer.preco,
  checkSalvarAssinatura: state.vendaLimitadaReducer.checkSalvarAssinatura,
  dadosPesquisa: state.vendaLimitadaReducer.dadosPesquisa,
});

export default connect(mapStateToProps, {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mostrarErroQtdeOnBlurAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
})(FormInternoVendaLimitada);
