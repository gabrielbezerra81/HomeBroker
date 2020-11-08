import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import { mostrarErroQtdeOnBlurAction } from "redux/actions/boletas/bookOfertaActions";
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
} from "redux/actions/boletas/formInputActions";
import { VENDA_STOPMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import RowFormValidade from "shared/componentes/RowFormValidade";
import RowFormAssinatura from "shared/componentes/RowFormAssinatura";
import RowAtivoQtdeBoletas from "shared/componentes/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/boletas/boletasAPIActions";
import InputFormatado from "shared/componentes/InputFormatado";
import { RowInputsStopMovelConectada } from "shared/componentes/RowInputsFormatadosFormInterno";
import { BotaoEnviarOrdem } from "shared/componentes/BotaoEnviarOrdem";

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
                        "ajusteAssimetrico",
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
                      VENDA_STOPMOVEL_NAMESPACE,
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
                      "simulacao",
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
