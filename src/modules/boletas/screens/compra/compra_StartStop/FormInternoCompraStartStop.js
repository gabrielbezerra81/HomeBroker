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
} from "modules/boletas/duck/actions/boletaActions";
import BoletaDateSelector from "modules/boletas/components/BoletaDateSelector";
import RowFormAssinatura from "modules/boletas/components/RowFormAssinatura";
import { COMPRA_STARTSTOP_NAMESPACE } from "constants/ActionTypes";
import BoletaSymbolQttyRow from "modules/boletas/components/BoletaSymbolQttyRow";
import { pesquisarAtivoOnEnterAction } from "modules/boletas/duck/actions/boletasAPIActions";
import { mapStateToPropsConfigurarStop } from "./ConfigurarStop";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

class FormInternoCompraStartStop extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            <BoletaSymbolQttyRow namespace={COMPRA_STARTSTOP_NAMESPACE} />
          </Form>
          <InputGroupBoleta
            namespace={COMPRA_STARTSTOP_NAMESPACE}
            cv="compra"
            popupToOpenGain="compra_gainreducao"
            popupToOpenStop="venda_stopmovel"
          />

          <BoletaDateSelector namespace={COMPRA_STARTSTOP_NAMESPACE} />

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
                <BoletaSendOrderButton
                  orderInfo={this.props.ordem}
                  namespace={COMPRA_STARTSTOP_NAMESPACE}
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
    pesquisarAtivoOnEnterAction,
  }),
  connect(mapStateToPropsConfigurarStop, {}),
)(FormInternoCompraStartStop);
