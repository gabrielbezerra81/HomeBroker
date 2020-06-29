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
} from "redux/actions/formInputActions";
import RowFormValidade from "components/utils/componentesUI/RowFormValidade";
import RowFormAssinatura from "components/utils/componentesUI/RowFormAssinatura";
import { COMPRA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "components/utils/CalculoValorTotal";
import { compraMercadoAction } from "redux/actions/AppBoletasActions";
import RowAtivoQtdeBoletas from "components/utils/componentesUI/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/api_actions/boletasAPIActions";
import { RowGainStopFormInternoConectada } from "components/utils/componentesUI/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/componentesUI/BotaoEnviarOrdem";

class FormInternoCompraMercado extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_MERCADO_NAMESPACE)}
          </Form>

          <Row>
            <Col className="colValorTotal">
              <h6 className="valorTotalText">
                {CalculoValorAproximadoMercado(
                  this.props.qtde,
                  this.props.dadosPesquisa
                )}
              </h6>
            </Col>
          </Row>

          <RowGainStopFormInternoConectada
            namespace={COMPRA_MERCADO_NAMESPACE}
            cv="compra"
            iconeConfigGain="compra_gainreducao"
            iconeConfigStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, COMPRA_MERCADO_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_MERCADO_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_MERCADO_NAMESPACE)
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
  ativo: state.compraMercadoReducer.ativo,
  qtde: state.compraMercadoReducer.qtde,
  erro: state.compraMercadoReducer.erro,
  gainDisparo: state.compraMercadoReducer.gainDisparo,
  gainExec: state.compraMercadoReducer.gainExec,
  stopDisparo: state.compraMercadoReducer.stopDisparo,
  stopExec: state.compraMercadoReducer.stopExec,
  validadeSelect: state.compraMercadoReducer.validadeSelect,
  date: state.compraMercadoReducer.date,
  valorTotal: state.compraMercadoReducer.valorTotal,
  assinatura: state.compraMercadoReducer.assinatura,
  checkSalvarAssinatura: state.compraMercadoReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraMercadoReducer.dadosPesquisa,
  eventSourceCotacao: state.compraMercadoReducer.eventSourceCotacao,
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
  compraMercadoAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
})(FormInternoCompraMercado);
