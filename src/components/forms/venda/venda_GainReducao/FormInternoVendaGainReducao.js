import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
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
  adicionarItemTabelaGainReducaoAction
} from "components/redux/actions/formInputActions";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";
import { pesquisarAtivoOnEnterAction } from "components/redux/actions/api_actions/boletasAPIActions";
import { RowInputsGainReducaoConectada } from "components/utils/RowInputsFormatadosFormInterno";

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
            <RowInputsGainReducaoConectada
              namespace={VENDA_GAINREDUCAO_NAMESPACE}
            />
          </Form>
          {RowFormValidade(this.props, VENDA_GAINREDUCAO_NAMESPACE)}

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
                <Button variant="danger" size="sm" onClick={() => false}>
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
  tabelaGainReducao: state.vendaGainReducao.tabelaGainReducao
});

export default connect(
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
    adicionarItemTabelaGainReducaoAction,
    pesquisarAtivoOnEnterAction
  }
)(FormInternoVendaGainReducao);
