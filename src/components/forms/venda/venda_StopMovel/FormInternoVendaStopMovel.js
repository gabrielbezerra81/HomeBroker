import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarAtivoAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  adicionarItemTabelaStopMovel,
  limparAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "components/redux/actions/formInputActions";
import { VENDA_STOPMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "components/redux/actions/api_actions/boletasAPIActions";
import InputFormatado from "components/utils/InputFormatado";
import { RowInputsStopMovelConectada } from "components/utils/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "components/utils/BotaoEnviarOrdem";

class FormInternoVendaStopMovel extends React.Component {
  render() {
    const { props } = this;
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer formInternoCompraStartMovel">
          <Form>
            {RowAtivoQtdeBoletas(props, VENDA_STOPMOVEL_NAMESPACE)}

            <RowInputsStopMovelConectada
              namespace={VENDA_STOPMOVEL_NAMESPACE}
            />
          </Form>

          {RowFormValidade(props, VENDA_STOPMOVEL_NAMESPACE)}
          <Form>
            <Row className="rowTextoAjusteAssimetrico">
              <Col md={7} className="colTextoAjusteAssimetrico">
                <h6>Ajuste Assimétrico</h6>
              </Col>
              <Col className="colTextInput colInputAjusteAssimetrico">
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <InputFormatado
                    tipoInput="preco"
                    step={0.01}
                    value={props.ajusteAssimetrico}
                    onChange={(valor) =>
                      props.mudarAtributoBoletaAction(
                        valor,
                        VENDA_STOPMOVEL_NAMESPACE,
                        "ajusteAssimetrico"
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button
                  variant="link"
                  onClick={() =>
                    props.adicionarItemTabelaStopMovel(
                      props,
                      VENDA_STOPMOVEL_NAMESPACE
                    )
                  }
                  className="operation-icons"
                >
                  <MDBIcon icon="plus-circle" size="2x" />
                </Button>
              </Col>
            </Row>
          </Form>

          <Row className="rowTabelaOrdens">
            <Col className="colTabelaOrdens">
              <TabelaOrdens
                tableDataOrdens={props.tabelaOrdens}
                tableDataOrdensSimulacao={props.tabelaOrdensSimulacao}
              />
            </Col>
          </Row>
          <div className="customFooter footerSemBorda">
            {RowFormAssinatura(props, VENDA_STOPMOVEL_NAMESPACE)}
            <Row>
              <Col md={4}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => props.limparAction(VENDA_STOPMOVEL_NAMESPACE)}
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={4}>
                <BotaoEnviarOrdem props={this.props} tipoCompraVenda="Vender" />
              </Col>
              <Col md={4}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    props.adicionarItemTabelaStopMovel(
                      props,
                      VENDA_STOPMOVEL_NAMESPACE,
                      "simulacao"
                    )
                  }
                >
                  <h6>Simular</h6>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  qtde: state.vendaStopMovel.qtde,
  erro: state.vendaStopMovel.erro,
  stopDisparo: state.vendaStopMovel.stopDisparo,
  stopExec: state.vendaStopMovel.stopExec,
  valorTotal: state.vendaStopMovel.valorTotal,
  ativo: state.vendaStopMovel.ativo,
  inicioDisparo: state.vendaStopMovel.inicioDisparo,
  ajustePadrao: state.vendaStopMovel.ajustePadrao,
  tabelaOrdens: state.vendaStopMovel.tabelaOrdens,
  ajusteAssimetrico: state.vendaStopMovel.ajusteAssimetrico,
  validadeSelect: state.vendaStopMovel.validadeSelect,
  date: state.vendaStopMovel.date,
  assinatura: state.vendaStopMovel.assinatura,
  checkSalvarAssinatura: state.vendaStopMovel.checkSalvarAssinatura,
  dadosPesquisa: state.vendaStopMovel.dadosPesquisa,
  eventSourceCotacao: state.vendaStopMovel.eventSourceCotacao,
  tabelaOrdensSimulacao: state.vendaStopMovel.tabelaOrdensSimulacao,
});

export default connect(mapStateToProps, {
  mudarQtdAction,
  mudarAtivoAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  mostrarErroQtdeOnBlurAction,
  adicionarItemTabelaStopMovel,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  limparAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
})(FormInternoVendaStopMovel);
