import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { mostrarErroQtdeOnBlurAction } from "modules/boletas/duck/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
} from "modules/boletas/duck/actions/formInputActions";
import RowFormValidade from "modules/boletas/components/RowFormValidade";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import { compraStartStopAction } from "modules/boletas/duck/actions/AppBoletasActions";
import RowAtivoQtdeBoletas from "modules/boletas/components/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "modules/boletas/duck/actions/boletasAPIActions";
import { mapStateToPropsConfigurarStop } from "./ConfigurarStop";
import { BotaoEnviarOrdem } from "modules/boletas/components/BotaoEnviarOrdem";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_STARTSTOP_NAMESPACE)}
          </Form>
          <InputGroupBoleta
            namespace={COMPRA_STARTSTOP_NAMESPACE}
            cv="compra"
            popupToOpenGain="compra_gainreducao"
            popupToOpenStop="venda_stopmovel"
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
  connect(mapStateToPropsConfigurarStop, {}),
)(FormInternoCompraStartStop);