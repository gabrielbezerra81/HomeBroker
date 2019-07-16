import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  mudarQtdAction,
  mostrarErroQtdeOnBlurAction
} from "../../redux/actions/bookOfertaActions";
import {
  mudarGainDisparoAction,
  mudarGainExecAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction
} from "../../redux/actions/formInputActions";
import RowFormValidade from "../../utils/RowFormValidade";
import RowFormAssinatura from "../../utils/RowFormAssinatura";
import { COMPRA_GAINREDUCAO_NAMESPACE } from "../../../constants/ActionTypes";
import TabelaGainReducao from "./TabelaGainReducao";

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
            <Row>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Disparo</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={0.01}
                    name="gainDisparo"
                    value={this.props.gainDisparo}
                    onChange={event =>
                      this.props.mudarGainDisparoAction(
                        event,
                        COMPRA_GAINREDUCAO_NAMESPACE
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
                    name="gainExecucao"
                    value={this.props.gainExec}
                    onChange={event =>
                      this.props.mudarGainExecAction(
                        event,
                        COMPRA_GAINREDUCAO_NAMESPACE
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label>Qtde</Form.Label>
                  <Form.Control
                    className="textInput"
                    type="number"
                    step={100}
                    min={0}
                    value={this.props.qtde}
                    onChange={event => this.props.mudarQtdAction(event)}
                    onBlur={() =>
                      this.props.mostrarErroQtdeOnBlurAction(this.props.erro)
                    }
                    name="qtde"
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="colIconeConfig">
                <Button variant="" className="operation-icons">
                  <MDBIcon
                    icon="plus-circle"
                    size="2x"
                    className="labelInput-verticalAlign"
                  />
                </Button>
              </Col>
            </Row>
          </Form>
          {RowFormValidade(this.props, COMPRA_GAINREDUCAO_NAMESPACE)}

          <Row className="rowTabelaGainReducao">
            <Col className="colTabelaOrdens">
              <TabelaGainReducao
                tableDataOrdens={this.props.TabelaGainReducao}
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
                <Button variant="primary" size="sm" onClick={() => false}>
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
  qtde: state.bookOfertaReducer.qtde,
  erro: state.bookOfertaReducer.erro,
  gainDisparo: state.compraGainReducao.gainDisparo,
  gainExec: state.compraGainReducao.gainExec,
  validadeSelect: state.compraGainReducao.validadeSelect,
  date: state.compraGainReducao.date,
  ativo: state.compraGainReducao.ativo,
  resultadoAtivo: state.compraGainReducao.resultadoAtivo,
  assinatura: state.compraGainReducao.assinatura,
  checkSalvarAssinatura: state.compraGainReducao.checkSalvarAssinatura,
  TabelaGainReducao: state.compraGainReducao.TabelaGainReducao
});

export default connect(
  mapStateToProps,
  {
    mudarQtdAction,
    mudarGainDisparoAction,
    mudarGainExecAction,
    mudarValidadeSelectAction,
    mudarDataAction,
    limparAction,
    mudarAtivoAction,
    mudarAssinaturaAction,
    mudarCheckSalvarAssinaturaAction,
    mostrarErroQtdeOnBlurAction
  }
)(FormInternoCompraGainReducao);
