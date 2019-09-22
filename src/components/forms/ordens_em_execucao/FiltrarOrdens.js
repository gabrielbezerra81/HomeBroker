import React from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";

class FiltrarOrdens extends React.Component {
  render() {
    return (
      <div className="mcontent divFiltrarOrdens">
        <Form>
          <Row>
            <Col md={0}>
              <Form.Group>
                <h6>Ativo</h6>
                <Form.Control type="text" className="textInput" />
              </Form.Group>
            </Col>
            <Col md={0}>
              <Form.Group>
                <h6>Mercado</h6>
                <Form.Control as="select" className="textInput">
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={0}>
              <Form.Group>
                <h6>Conta</h6>
                <Form.Control as="select" className="textInput">
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={0}>
              <Form.Group>
                <h6>Status</h6>
                <Form.Control as="select" className="textInput">
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={0}>
              <Form.Group>
                <h6>Data</h6>
                <Form.Control as="select" className="textInput">
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={0}>
              <Form.Group>
                <h6>Oferta</h6>
                <Form.Control as="select" className="textInput">
                  <option value="C">Compra</option>
                  <option value="V">Venda</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={0}>
              <Button variant="primary" size="sm" className="botaoFiltrar">
                <h6>Histórico de operações</h6>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ativoFiltrarOrdens: state.telaPrincipalReducer.ativoFiltrarOrdens,
  mercadoFiltrarOrdens: state.telaPrincipalReducer.mercadoFiltrarOrdens,
  contaFiltrarOrdens: state.telaPrincipalReducer.contaFiltrarOrdens,
  statusFiltrarOrdens: state.telaPrincipalReducer.statusFiltrarOrdens,
  dataFiltrarOrdens: state.telaPrincipalReducer.dataFiltrarOrdens,
  ofertaFiltrarOrdens: state.telaPrincipalReducer.ofertaFiltrarOrdens
});

export default connect(
  mapStateToProps,
  {}
)(FiltrarOrdens);
