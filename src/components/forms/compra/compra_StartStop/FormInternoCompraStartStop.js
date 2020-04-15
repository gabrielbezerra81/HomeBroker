import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
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
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { compraStartStopAction } from "components/redux/actions/SubAppActions";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "components/redux/actions/api_actions/boletasAPIActions";
import { mapStateToPropsConfigurarStop } from "components/forms/compra/compra_StartStop/ConfigurarStop";
import { RowGainStopFormInternoConectada } from "components/utils/RowInputsFormatadosFormInterno";
import { StorePrincipalContext } from "components/redux/StoreCreation";
import { mapStateToPropsEnvioOrdem } from "components/redux/MapStateToProps";

class FormInternoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_STARTSTOP_NAMESPACE)}
          </Form>
          <RowGainStopFormInternoConectada
            namespace={COMPRA_STARTSTOP_NAMESPACE}
            cv="compra"
            handleShow={this.props.handleShow}
            iconeConfigGain="compra_gainreducao"
            iconeConfigStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, COMPRA_STARTSTOP_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_STARTSTOP_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_STARTSTOP_NAMESPACE)
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
  erro: state.compraStartStopReducer.erro,
  gainDisparo: state.compraStartStopReducer.gainDisparo,
  gainExec: state.compraStartStopReducer.gainExec,
  stopDisparo: state.compraStartStopReducer.stopDisparo,
  stopExec: state.compraStartStopReducer.stopExec,
  validadeSelect: state.compraStartStopReducer.validadeSelect,
  date: state.compraStartStopReducer.date,
  valorTotal: state.compraStartStopReducer.valorTotal,
  ativo: state.compraStartStopReducer.ativo,
  assinatura: state.compraStartStopReducer.assinatura,
  checkSalvarAssinatura: state.compraStartStopReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraStartStopReducer.dadosPesquisa,
  eventSourceCotacao: state.compraStartStopReducer.eventSourceCotacao,
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
    compraStartStopAction,
    pesquisarAtivoOnEnterAction,
    enviarOrdemAction,
  }),
  connect(mapStateToPropsConfigurarStop, {})
)(FormInternoCompraStartStop);
