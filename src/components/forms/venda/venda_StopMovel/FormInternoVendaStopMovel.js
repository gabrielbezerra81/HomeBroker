import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import { mostrarErroQtdeOnBlurAction } from "components/redux/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarStopDisparoAction,
  mudarStopExecAction,
  mudarAtivoAction,
  mudarInicioDisparoAction,
  mudarAjustePadraoAction,
  mudarAjusteAssimetricoAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  adicionarItemTabelaStopMovel,
  limparAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction
} from "components/redux/actions/formInputActions";
import { VENDA_STOPMOVEL_NAMESPACE } from "constants/ActionTypes";
import TabelaOrdens from "./TabelaOrdens";
import RowFormValidade from "components/utils/RowFormValidade";
import RowFormAssinatura from "components/utils/RowFormAssinatura";
import RowAtivoQtdeBoletas from "components/utils/RowAtivoQtdeBoletas";
import { pesquisarAtivoOnEnterAction } from "components/redux/actions/api_actions/boletasAPIActions";

class FormInternoVendaStopMovel extends React.Component {
  render() {
    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer formInternoCompraStartMovel">
          <Form>
            {RowAtivoQtdeBoletas(this.props, VENDA_STOPMOVEL_NAMESPACE)}

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Início</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="disparo"
                    value={this.props.inicioDisparo}
                    onChange={event =>
                      this.props.mudarInicioDisparoAction(
                        event,
                        VENDA_STOPMOVEL_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Ajuste padrão</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="execucao"
                    value={this.props.ajustePadrao}
                    onChange={event =>
                      this.props.mudarAjustePadraoAction(
                        event,
                        VENDA_STOPMOVEL_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Stop</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="stopDisparo"
                    value={this.props.stopDisparo}
                    onChange={event =>
                      this.props.mudarStopDisparoAction(
                        event,
                        VENDA_STOPMOVEL_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Execução</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="stopExecucao"
                    value={this.props.stopExec}
                    onChange={event =>
                      this.props.mudarStopExecAction(
                        event,
                        VENDA_STOPMOVEL_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          {RowFormValidade(this.props, VENDA_STOPMOVEL_NAMESPACE)}
          <Form>
            <Row className="rowTextoAjusteAssimetrico">
              <Col md={7} className="colTextoAjusteAssimetrico">
                <h6>Ajuste Assimétrico</h6>
              </Col>
              <Col className="colTextInput colInputAjusteAssimetrico">
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="ajusteAssimétrico"
                    pattern="0.00"
                    value={this.props.ajusteAssimetrico}
                    onChange={event =>
                      this.props.mudarAjusteAssimetricoAction(
                        event,
                        VENDA_STOPMOVEL_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button
                  variant="link"
                  onClick={() =>
                    this.props.adicionarItemTabelaStopMovel(
                      this.props,
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
              <TabelaOrdens tableDataOrdens={this.props.tabelaOrdens} />
            </Col>
          </Row>
          <div className="customFooter footerSemBorda">
            {RowFormAssinatura(this.props, VENDA_STOPMOVEL_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(VENDA_STOPMOVEL_NAMESPACE)
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
  checkSalvarAssinatura: state.vendaStopMovel.checkSalvarAssinatura
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    mudarStopDisparoAction,
    mudarStopExecAction,
    mudarAtivoAction,
    mudarInicioDisparoAction,
    mudarAjustePadraoAction,
    mudarAjusteAssimetricoAction,
    mudarValidadeSelectAction,
    mudarDataAction,
    mostrarErroQtdeOnBlurAction,
    adicionarItemTabelaStopMovel,
    mudarAssinaturaAction,
    mudarCheckSalvarAssinaturaAction,
    limparAction,
    pesquisarAtivoOnEnterAction
  }
)(FormInternoVendaStopMovel);
