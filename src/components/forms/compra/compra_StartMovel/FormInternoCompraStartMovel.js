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
  adicionarItemTabelaStartMovel,
  limparAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction
} from "components/redux/actions/formInputActions";
import { COMPRA_STARTMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import { compraStartMovelAction } from "components/redux/actions/SubAppActions";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction
} from "components/redux/actions/api_actions/boletasAPIActions";
import InputFormatado from "components/utils/InputFormatado";
import { RowInputsStopMovelConectada } from "components/utils/RowInputsFormatadosFormInterno";

class FormInternoCompraStartMovel extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer formInternoCompraStartMovel">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_STARTMOVEL_NAMESPACE)}

            <RowInputsStopMovelConectada
              namespace={COMPRA_STARTMOVEL_NAMESPACE}
            />
          </Form>
          {RowFormValidade(this.props, COMPRA_STARTMOVEL_NAMESPACE)}

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
                    value={this.props.ajusteAssimetrico}
                    onChange={valor =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        COMPRA_STARTMOVEL_NAMESPACE,
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
                    this.props.adicionarItemTabelaStartMovel(
                      this.props,
                      COMPRA_STARTMOVEL_NAMESPACE
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
              <TabelaOrdens tableDataOrdens={this.props.tabelaOrdens} />
            </Col>
          </Row>

          <div className="customFooter footerSemBorda">
            {RowFormAssinatura(this.props, COMPRA_STARTMOVEL_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_STARTMOVEL_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => this.props.enviarOrdemAction(this.props)}
                >
                  <h6>Comprar</h6>
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
  dadosPesquisa: state.compraStartMovelReducer.dadosPesquisa
});

export default connect(
  mapStateToProps,
  {
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
    mudarAtributoBoletaAction
  }
)(FormInternoCompraStartMovel);

/**
 * 
          <div className="customFooter">
            <Row>
              <Col md={3} />
              <Col md={6} />
            </Row>
          </div>
 */
