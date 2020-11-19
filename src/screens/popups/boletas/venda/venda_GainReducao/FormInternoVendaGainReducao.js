import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
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
import { VENDA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";
import { pesquisarAtivoOnEnterAction } from "redux/actions/boletas/boletasAPIActions";
import { BotaoEnviarOrdem } from "shared/componentes/BotaoEnviarOrdem";
import InputGroupGainReducao from "shared/componentes/InternalForm/InputGroupGainReducao";

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
