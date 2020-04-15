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
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { COMPRA_MERCADO_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorAproximadoMercado } from "components/utils/CalculoValorTotal";
import { compraMercadoAction } from "components/redux/actions/SubAppActions";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "components/redux/actions/api_actions/boletasAPIActions";
import { RowGainStopFormInternoConectada } from "components/utils/RowInputsFormatadosFormInterno";
import { compose } from "redux";
import { StorePrincipalContext } from "components/redux/StoreCreation";
import { mapStateToPropsEnvioOrdem } from "components/redux/MapStateToProps";

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
            handleShow={this.props.handleShow}
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => this.props.enviarOrdemAction(this.props)}
                >
                  <h6>Comprar</h6>
                </Button>
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

export default compose(
  connect(mapStateToPropsEnvioOrdem, {}, null, {
    context: StorePrincipalContext,
  }),
  connect(mapStateToProps, {
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
  })
)(FormInternoCompraMercado);
