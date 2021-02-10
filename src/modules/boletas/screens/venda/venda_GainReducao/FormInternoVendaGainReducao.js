import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
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
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";
import { pesquisarAtivoOnEnterAction } from "modules/boletas/duck/actions/boletasAPIActions";
import { BoletaSendOrderButton } from "modules/boletas/components/BoletaSendOrderButton";
import InputGroupGainReducao from "modules/boletas/components/InternalForm/InputGroupGainReducao";

class FormInternoVendaGainReducao extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer formInternoCompraStartMovel">
          <Row className="rowTextoAtivoGainReducao">
            <Col>
              <h6 className="resultadoTextoAtivo">
                {this.props.resultadoAtivo}
              </h6>
            </Col>
          </Row>
          <Form className="item">
            <InputGroupGainReducao namespace={VENDA_GAINREDUCAO_NAMESPACE} />
          </Form>

          <BoletaDateSelector namespace={VENDA_GAINREDUCAO_NAMESPACE} />

          <Row className="rowTabelaGainReducao">
            <Col className="colTabelaOrdens">
              <TabelaGainReducao
                tableDataOrdens={this.props.tabelaGainReducao}
              />
            </Col>
          </Row>

          <div className="customFooter footerSemBorda">
            {RowFormAssinatura(this.props, VENDA_GAINREDUCAO_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_GAINREDUCAO_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BoletaSendOrderButton
                  orderInfo={this.props.ordem}
                  namespace={VENDA_GAINREDUCAO_NAMESPACE}
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
  qtde: state.vendaGainReducao.qtde,
  erro: state.vendaGainReducao.erro,
  gainDisparo: state.vendaGainReducao.gainDisparo,
  gainExec: state.vendaGainReducao.gainExec,
  validadeSelect: state.vendaGainReducao.validadeSelect,
  date: state.vendaGainReducao.date,
  ativo: state.vendaGainReducao.ativo,
  resultadoAtivo: state.vendaGainReducao.resultadoAtivo,
  assinatura: state.vendaGainReducao.assinatura,
  checkSalvarAssinatura: state.vendaGainReducao.checkSalvarAssinatura,
  tabelaGainReducao: state.vendaGainReducao.tabelaGainReducao,
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
})(FormInternoVendaGainReducao);
