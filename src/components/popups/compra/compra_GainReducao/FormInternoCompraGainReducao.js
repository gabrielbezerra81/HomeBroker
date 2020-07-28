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
  adicionarItemTabelaGainReducaoAction,
} from "redux/actions/boletas/formInputActions";
import RowFormValidade from "components/utils/componentesUI/RowFormValidade";
import RowFormAssinatura from "components/utils/componentesUI/RowFormAssinatura";
import { COMPRA_GAINREDUCAO_NAMESPACE } from "constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";
import { compraGainReducaoAction } from "redux/actions/boletas/AppBoletasActions";
import { pesquisarAtivoOnEnterAction } from "redux/actions/boletas/boletasAPIActions";
import { RowInputsGainReducaoConectada } from "components/utils/componentesUI/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/componentesUI/BotaoEnviarOrdem";

class FormInternoCompraGainReducao extends React.Component {
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
              namespace={COMPRA_GAINREDUCAO_NAMESPACE}
            />
          </Form>
          {RowFormValidade(this.props, COMPRA_GAINREDUCAO_NAMESPACE)}

          <Row className="rowTabelaGainReducao">
            <Col className="colTabelaOrdens">
              <TabelaGainReducao
                tableDataOrdens={this.props.tabelaGainReducao}
              />
            </Col>
          </Row>

          <div className="customFooter footerSemBorda">
            {RowFormAssinatura(this.props, COMPRA_GAINREDUCAO_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_GAINREDUCAO_NAMESPACE)
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
  qtde: state.compraGainReducao.qtde,
  erro: state.compraGainReducao.erro,
  gainDisparo: state.compraGainReducao.gainDisparo,
  gainExec: state.compraGainReducao.gainExec,
  validadeSelect: state.compraGainReducao.validadeSelect,
  date: state.compraGainReducao.date,
  ativo: state.compraGainReducao.ativo,
  resultadoAtivo: state.compraGainReducao.resultadoAtivo,
  assinatura: state.compraGainReducao.assinatura,
  checkSalvarAssinatura: state.compraGainReducao.checkSalvarAssinatura,
  tabelaGainReducao: state.compraGainReducao.tabelaGainReducao,
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
  adicionarItemTabelaGainReducaoAction,
  compraGainReducaoAction,
  pesquisarAtivoOnEnterAction,
})(FormInternoCompraGainReducao);
