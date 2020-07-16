import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "redux/actions/boletas/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "redux/actions/boletas/formInputActions";
import RowFormValidade from "components/utils/componentesUI/RowFormValidade";
import RowFormAssinatura from "components/utils/componentesUI/RowFormAssinatura";
import { VENDA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "components/utils/CalculoValorTotal";
import RowAtivoQtdeBoletas from "components/utils/componentesUI/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/boletas/boletasAPIActions";
import { RowGainStopFormInternoConectada } from "components/utils/componentesUI/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/componentesUI/BotaoEnviarOrdem";

class FormInternoVendaMercado extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, VENDA_MERCADO_NAMESPACE)}
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
            namespace={VENDA_MERCADO_NAMESPACE}
            cv="venda"
            iconeConfigGain="venda_gainreducao"
            iconeConfigStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, VENDA_MERCADO_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, VENDA_MERCADO_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_MERCADO_NAMESPACE)
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
  ativo: state.vendaMercadoReducer.ativo,
  qtde: state.vendaMercadoReducer.qtde,
  erro: state.vendaMercadoReducer.erro,
  gainDisparo: state.vendaMercadoReducer.gainDisparo,
  gainExec: state.vendaMercadoReducer.gainExec,
  stopDisparo: state.vendaMercadoReducer.stopDisparo,
  stopExec: state.vendaMercadoReducer.stopExec,
  validadeSelect: state.vendaMercadoReducer.validadeSelect,
  date: state.vendaMercadoReducer.date,
  valorTotal: state.vendaMercadoReducer.valorTotal,
  assinatura: state.vendaMercadoReducer.assinatura,
  checkSalvarAssinatura: state.vendaMercadoReducer.checkSalvarAssinatura,
  dadosPesquisa: state.vendaMercadoReducer.dadosPesquisa,
  eventSourceCotacao: state.vendaMercadoReducer.eventSourceCotacao,
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
})(FormInternoVendaMercado);
