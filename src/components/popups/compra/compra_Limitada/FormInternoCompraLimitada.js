import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "redux/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "redux/actions/formInputActions";
import RowFormValidade from "components/utils/componentesUI/RowFormValidade";
import RowFormAssinatura from "components/utils/componentesUI/RowFormAssinatura";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "components/utils/CalculoValorTotal";
import { compraLimitadaAction } from "redux/actions/AppBoletasActions";
import RowAtivoQtdeBoletas from "components/utils/componentesUI/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/api_actions/boletasAPIActions";
import InputFormatado from "components/utils/componentesUI/InputFormatado";
import { RowGainStopFormInternoConectada } from "components/utils/componentesUI/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/componentesUI/BotaoEnviarOrdem";

class FormInternoCompraLimitada extends React.Component {
  componentDidUpdate(prevProps) {
    const prevStepQtde = prevProps.dadosPesquisa.stepQtde;
    const stepQtde = this.props.dadosPesquisa.stepQtde;

    if (prevStepQtde !== stepQtde && stepQtde === 100) {
      this.props.mudarAtributoBoletaAction(
        Number(this.props.preco).toFixed(2),
        COMPRA_LIMITADA_NAMESPACE,
        "preco"
      );
    }
  }

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
            {RowAtivoQtdeBoletas(this.props, COMPRA_LIMITADA_NAMESPACE)}

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Preço</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label />
                  <InputFormatado
                    tipoInput="preco"
                    step={stepPreco}
                    id="compralim"
                    precision={precisao}
                    value={this.props.preco}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        COMPRA_LIMITADA_NAMESPACE,
                        "preco"
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

          <RowGainStopFormInternoConectada
            namespace={COMPRA_LIMITADA_NAMESPACE}
            cv="compra"
            iconeConfigGain="compra_gainreducao"
            iconeConfigStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, COMPRA_LIMITADA_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_LIMITADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_LIMITADA_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BotaoEnviarOrdem
                  props={this.props}
                  tipoCompraVenda="Comprar"
                />
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  qtde: state.compraLimitadaReducer.qtde,
  erro: state.compraLimitadaReducer.erro,
  gainDisparo: state.compraLimitadaReducer.gainDisparo,
  gainExec: state.compraLimitadaReducer.gainExec,
  stopDisparo: state.compraLimitadaReducer.stopDisparo,
  stopExec: state.compraLimitadaReducer.stopExec,
  validadeSelect: state.compraLimitadaReducer.validadeSelect,
  date: state.compraLimitadaReducer.date,
  valorTotal: state.compraLimitadaReducer.valorTotal,
  ativo: state.compraLimitadaReducer.ativo,
  assinatura: state.compraLimitadaReducer.assinatura,
  preco: state.compraLimitadaReducer.preco,
  checkSalvarAssinatura: state.compraLimitadaReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
  eventSourceCotacao: state.compraLimitadaReducer.eventSourceCotacao,
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
  compraLimitadaAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
})(FormInternoCompraLimitada);
