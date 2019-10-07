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
  mudarAtributoBoletaAction
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction
} from "components/redux/actions/api_actions/boletasAPIActions";
import { mapStateToPropsConfigStopVenda } from "components/forms/venda/venda_StartStop/ConfigurarStopVenda";
import { RowGainStopFormInternoConectada } from "components/utils/RowInputsFormatadosFormInterno";

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
            handleShow={this.props.handleShow}
            iconeConfigGain="venda_gainreducao"
            iconeConfigStop="venda_stop_movel"
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
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => this.props.enviarOrdemAction(this.props)}
                >
                  <h6>Vender</h6>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
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
  dadosPesquisa: state.vendaStartStopReducer.dadosPesquisa
});

export default compose(
  connect(
    mapStateToProps,
    {
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
      mudarAtributoBoletaAction
    }
  ),
  connect(
    mapStateToPropsConfigStopVenda,
    {}
  )
)(FormInternoVendaStartStop);
