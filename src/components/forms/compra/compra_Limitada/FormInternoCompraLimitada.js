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
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "components/utils/CalculoValorTotal";
import { compraLimitadaAction } from "components/redux/actions/SubAppActions";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "components/redux/actions/api_actions/boletasAPIActions";
import InputFormatado from "components/utils/InputFormatado";
import { RowGainStopFormInternoConectada } from "components/utils/RowInputsFormatadosFormInterno";
import { compose } from "redux";
import { StorePrincipalContext } from "components/redux/StoreCreation";
import { mapStateToPropsEnvioOrdem } from "components/redux/MapStateToProps";

class FormInternoCompraLimitada extends React.Component {
  render() {
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
                    step={0.01}
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
            handleShow={this.props.handleShow}
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
    compraLimitadaAction,
    pesquisarAtivoOnEnterAction,
    enviarOrdemAction,
    mudarAtributoBoletaAction,
  })
)(FormInternoCompraLimitada);
