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
  mudarAtributoBoletaAction,
} from "redux/actions/boletas/formInputActions";
import RowFormValidade from "shared/componentes/RowFormValidade";
import RowFormAssinatura from "shared/componentes/RowFormAssinatura";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import RowAtivoQtdeBoletas from "shared/componentes/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/boletas/boletasAPIActions";
import { mapStateToPropsConfigStopVenda } from "screens/popups/venda/venda_StartStop/ConfigurarStopVenda";
import { RowGainStopFormInternoConectada } from "shared/componentes/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "shared/componentes/BotaoEnviarOrdem";

class FormInternoVendaStartStop extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, VENDA_STARTSTOP_NAMESPACE)}
          </Form>
          <RowGainStopFormInternoConectada
            namespace={VENDA_STARTSTOP_NAMESPACE}
            cv="venda"
            iconeConfigGain="venda_gainreducao"
            iconeConfigStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, VENDA_STARTSTOP_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, VENDA_STARTSTOP_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_STARTSTOP_NAMESPACE)
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
  erro: state.vendaStartStopReducer.erro,
  gainDisparo: state.vendaStartStopReducer.gainDisparo,
  gainExec: state.vendaStartStopReducer.gainExec,
  stopDisparo: state.vendaStartStopReducer.stopDisparo,
  stopExec: state.vendaStartStopReducer.stopExec,
  validadeSelect: state.vendaStartStopReducer.validadeSelect,
  date: state.vendaStartStopReducer.date,
  valorTotal: state.vendaStartStopReducer.valorTotal,
  ativo: state.vendaStartStopReducer.ativo,
  assinatura: state.vendaStartStopReducer.assinatura,
  checkSalvarAssinatura: state.vendaStartStopReducer.checkSalvarAssinatura,
  dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa,
  eventSourceCotacao: state.vendaStartStopReducer.eventSourceCotacao,
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
    pesquisarAtivoOnEnterAction,
    enviarOrdemAction,
    mudarAtributoBoletaAction,
  }),
  connect(mapStateToPropsConfigStopVenda, {})
)(FormInternoVendaStartStop);
