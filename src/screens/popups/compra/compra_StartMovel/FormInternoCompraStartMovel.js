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
  adicionarItemTabelaStartMovel,
  limparAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "redux/actions/boletas/formInputActions";
import { COMPRA_STARTMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import RowFormValidade from "shared/componentes/RowFormValidade";
import RowFormAssinatura from "shared/componentes/RowFormAssinatura";
import { compraStartMovelAction } from "redux/actions/boletas/AppBoletasActions";
import RowAtivoQtdeBoletas from "shared/componentes/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "redux/actions/boletas/boletasAPIActions";
import CustomInput from "shared/componentes/CustomInput";
import { BotaoEnviarOrdem } from "shared/componentes/BotaoEnviarOrdem";
import InputGroupStopMovel from "shared/componentes/InternalForm/InputGroupStopMovel";

class FormInternoCompraStartMovel extends React.Component {
  render() {
    const { props } = this;
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer formInternoCompraStartMovel">
          <Form>
            {RowAtivoQtdeBoletas(props, COMPRA_STARTMOVEL_NAMESPACE)}

            <InputGroupStopMovel namespace={COMPRA_STARTMOVEL_NAMESPACE} />
          </Form>
          {RowFormValidade(props, COMPRA_STARTMOVEL_NAMESPACE)}

          <Form>
            <Row className="rowTextoAjusteAssimetrico">
              <Col md={7} className="colTextoAjusteAssimetrico">
                <h6>Ajuste Assimétrico</h6>
              </Col>
              <Col className="colTextInput colInputAjusteAssimetrico">
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <CustomInput
                    type="preco"
                    step={0.01}
                    value={props.ajusteAssimetrico}
                    onChange={(valor) =>
                      props.mudarAtributoBoletaAction(
                        valor,
                        COMPRA_STARTMOVEL_NAMESPACE,
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
                    props.adicionarItemTabelaStartMovel(
                      props,
                      COMPRA_STARTMOVEL_NAMESPACE,
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
            {RowFormAssinatura(props, COMPRA_STARTMOVEL_NAMESPACE)}{" "}
            <Row>
              <Col md={4}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    props.limparAction(COMPRA_STARTMOVEL_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={4}>
                <BotaoEnviarOrdem
                  props={this.props}
                  tipoCompraVenda="Comprar"
                />
              </Col>
              <Col md={4}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    props.adicionarItemTabelaStartMovel(
                      props,
                      COMPRA_STARTMOVEL_NAMESPACE,
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
  qtde: state.compraStartMovelReducer.qtde,
  erro: state.compraStartMovelReducer.erro,
  stopDisparo: state.compraStartMovelReducer.stopDisparo,
  stopExec: state.compraStartMovelReducer.stopExec,
  valorTotal: state.compraStartMovelReducer.valorTotal,
  ativo: state.compraStartMovelReducer.ativo,
  inicioDisparo: state.compraStartMovelReducer.inicioDisparo,
  ajustePadrao: state.compraStartMovelReducer.ajustePadrao,
  tabelaOrdens: state.compraStartMovelReducer.tabelaOrdens,
  ajusteAssimetrico: state.compraStartMovelReducer.ajusteAssimetrico,
  validadeSelect: state.compraStartMovelReducer.validadeSelect,
  date: state.compraStartMovelReducer.date,
  assinatura: state.compraStartMovelReducer.assinatura,
  checkSalvarAssinatura: state.compraStartMovelReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa,
  tabelaOrdensSimulacao: state.compraStartMovelReducer.tabelaOrdensSimulacao,
});

export default connect(mapStateToProps, {
  mudarQtdAction,
  mudarAtivoAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  mostrarErroQtdeOnBlurAction,
  adicionarItemTabelaStartMovel,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  limparAction,
  compraStartMovelAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
})(FormInternoCompraStartMovel);
