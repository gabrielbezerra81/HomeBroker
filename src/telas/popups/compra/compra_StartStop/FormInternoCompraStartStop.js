import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { mostrarErroQtdeOnBlurAction } from "redux/actions/boletas/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
} from "redux/actions/boletas/formInputActions";
import RowFormValidade from "shared/componentes/RowFormValidade";
import RowFormAssinatura from "shared/componentes/RowFormAssinatura";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { compraStartStopAction } from "redux/actions/boletas/AppBoletasActions";
import RowAtivoQtdeBoletas from "shared/componentes/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/boletas/boletasAPIActions";
import { mapStateToPropsConfigurarStop } from "telas/popups/compra/compra_StartStop/ConfigurarStop";
import { RowGainStopFormInternoConectada } from "shared/componentes/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "shared/componentes/BotaoEnviarOrdem";

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
