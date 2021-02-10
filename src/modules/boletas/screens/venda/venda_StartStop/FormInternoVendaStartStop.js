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
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { VENDA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { pesquisarAtivoOnEnterAction } from "modules/boletas/duck/actions/boletasAPIActions";
import { mapStateToPropsConfigStopVenda } from "./ConfigurarStopVenda";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoVendaStartStop extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            <BoletaSymbolQttyRow namespace={VENDA_STARTSTOP_NAMESPACE} />
          </Form>
          <InputGroupBoleta
            namespace={VENDA_STARTSTOP_NAMESPACE}
            cv="venda"
            popupToOpenGain="venda_gainreducao"
            popupToOpenStop="venda_stopmovel"
          />

          <BoletaDateSelector namespace={VENDA_STARTSTOP_NAMESPACE} />

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
                <BoletaSendOrderButton
                  orderInfo={this.props.ordem}
                  namespace={VENDA_STARTSTOP_NAMESPACE}
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
    mudarAtributoBoletaAction,
  }),
  connect(mapStateToPropsConfigStopVenda, {}),
)(FormInternoVendaStartStop);
