import React from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  mudarVariavelOrdensExecAction,
  filtrarHistoricoOpAction,
} from "redux/actions/ordensExecucao/OrdensExecActions";
import { StorePrincipalContext } from "redux/StoreCreation";

class FiltrarOrdens extends React.Component {
  render() {
    return (
      <div className="mcontent divFiltrarOrdens">
        <Form>
          <Row>
            <Col md={"0"}>
              <Form.Group>
                <h6>Ativo</h6>
                <Form.Control
                  type="text"
                  className="textInput"
                  value={this.props.ativoFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "ativoFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Form.Group>
                <h6>Mercado</h6>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.mercadoFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "mercadoFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                >
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Form.Group>
                <h6>Conta</h6>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.contaFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "contaFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                >
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Form.Group>
                <h6>Status</h6>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.statusFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "statusFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                >
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Form.Group>
                <h6>Data</h6>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.dataFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "dataFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                >
                  <option>1</option>
                  <option>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Form.Group>
                <h6>Oferta</h6>
                <Form.Control
                  as="select"
                  className="textInput"
                  value={this.props.ofertaFiltrarOrdens}
                  onChange={(event) =>
                    this.props.mudarVariavelOrdensExecAction(
                      "ofertaFiltrarOrdens",
                      event.currentTarget.value,
                    )
                  }
                >
                  <option value="C">Compra</option>
                  <option value="V">Venda</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={"0"}>
              <Button
                variant="primary"
                size="sm"
                className="botaoFiltrar"
                onClick={() => this.props.filtrarHistoricoOpAction()}
              >
                <h6>Histórico de operações</h6>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ativoFiltrarOrdens: state.ordersExecReducer.ativoFiltrarOrdens,
  mercadoFiltrarOrdens: state.ordersExecReducer.mercadoFiltrarOrdens,
  contaFiltrarOrdens: state.ordersExecReducer.contaFiltrarOrdens,
  statusFiltrarOrdens: state.ordersExecReducer.statusFiltrarOrdens,
  dataFiltrarOrdens: state.ordersExecReducer.dataFiltrarOrdens,
  ofertaFiltrarOrdens: state.ordersExecReducer.ofertaFiltrarOrdens,
});

export default connect(
  mapStateToProps,
  {
    mudarVariavelOrdensExecAction,
    filtrarHistoricoOpAction,
  },
  null,
  { context: StorePrincipalContext },
)(FiltrarOrdens);