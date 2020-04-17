import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { VENDA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "components/utils/CalculoValorTotal";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "components/redux/actions/api_actions/boletasAPIActions";
import InputFormatado from "components/utils/InputFormatado";
import { RowGainStopFormInternoConectada } from "components/utils/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/BotaoEnviarOrdem";

class FormInternoVendaLimitada extends React.Component {
  render() {
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
                  <InputFormatado
                    tipoInput="preco"
                    step={0.01}
                    value={this.props.preco}
                    onChange={(valor) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        VENDA_LIMITADA_NAMESPACE,
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
            namespace={VENDA_LIMITADA_NAMESPACE}
            cv="venda"
            iconeConfigGain="venda_gainreducao"
            iconeConfigStop="venda_stopmovel"
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
  eventSourceCotacao: state.vendaLimitadaReducer.eventSourceCotacao,
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
